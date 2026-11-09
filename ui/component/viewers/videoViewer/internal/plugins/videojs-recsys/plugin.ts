//@ts-nocheck
// Created by xander on 6/21/2021
import videojs from 'video.js';

import RecSys from 'extras/recsys/recsys';
const VERSION = '0.0.1';

/* RecSys */
const PlayerEvent = {
  event: {
    start: 0, // event types
    stop: 1,
    scrub: 2,
    speed: 3,
  },
} as const;

function newRecsysPlayerEvent(eventType: unknown, offset: unknown, arg: unknown) {
  if (arg) {
    return {
      event: eventType,
      offset: offset,
      arg: arg,
    };
  } else {
    return {
      event: eventType,
      offset: offset,
    };
  }
}

const defaults = {
  videoId: null,
  userId: 0,
  debug: false,
  embedded: false,
} as const;

const Component = videojs.getComponent('Component');
const registerPlugin = videojs.registerPlugin || videojs.plugin;

class RecsysPlugin extends Component {
  constructor(player: unknown, options: unknown) {
    super(player, options);

    // Plugin started
    if (options.debug) {
      this.log(`Created recsys plugin for: videoId:${options.videoId}`);
    }

    // To help with debugging, we'll add a global vjs object with the video js player
    window.vjs = player;

    this.player = player;
    this.lastTimeUpdate = null;
    this.currentTimeUpdate = null;
    this.inPause = false;

    // Plugin event listeners
    player.on('playing', (event) => this.onPlay(event));
    player.on('pause', (event) => this.onPause(event));
    player.on('ended', (event) => this.onEnded(event));
    player.on('ratechange', (event) => this.onRateChange(event));
    player.on('timeupdate', (event) => this.onTimeUpdate(event));
    player.on('seeked', (event) => this.onSeeked(event));

    // Event trigger to send recsys event
    player.on('dispose', (event) => this.onDispose(event));
  }

  onPlay(event: unknown) {
    const recsysEvent = newRecsysPlayerEvent(PlayerEvent.event.start, this.player.currentTime());
    this.log('onPlay', recsysEvent);
    RecSys.onRecsysPlayerEvent(this.options_.videoId, recsysEvent, this.options_.embedded);

    this.inPause = false;
    this.lastTimeUpdate = recsysEvent.offset;
  }

  onPause(event: unknown) {
    const recsysEvent = newRecsysPlayerEvent(PlayerEvent.event.stop, this.player.currentTime());
    this.log('onPause', recsysEvent);
    RecSys.onRecsysPlayerEvent(this.options_.videoId, recsysEvent);

    this.inPause = true;
  }

  onEnded(event: unknown) {
    const recsysEvent = newRecsysPlayerEvent(PlayerEvent.event.stop, this.player.currentTime());
    this.log('onEnded', recsysEvent);
    RecSys.onRecsysPlayerEvent(this.options_.videoId, recsysEvent);
  }

  onRateChange(event: unknown) {
    const recsysEvent = newRecsysPlayerEvent(
      PlayerEvent.event.speed,
      this.player.currentTime(),
      this.player.playbackRate()
    );
    this.log('onRateChange', recsysEvent);
    RecSys.onRecsysPlayerEvent(this.options_.videoId, recsysEvent);
  }

  onTimeUpdate(event: unknown) {
    const nextCurrentTime = this.player.currentTime();

    if (!this.inPause && Math.abs(this.lastTimeUpdate - nextCurrentTime) < 0.5) {
      // Don't update lastTimeUpdate if we are in a pause segment.
      //
      // However, if we aren't in a pause and the time jumped
      // the onTimeUpdate event probably fired before the pause and seek.
      // Don't update in that case, either.
      this.lastTimeUpdate = this.currentTimeUpdate;
    }

    this.currentTimeUpdate = nextCurrentTime;
  }

  onSeeked(event: unknown) {
    const curTime = this.player.currentTime();

    // There are three patterns for seeking:
    //
    // Assuming the video is playing,
    //
    // 1. Dragging the player head emits: onPause -> onSeeked -> onSeeked -> ... -> onPlay
    // 2. Key press left right emits: onSeeked -> onPlay
    // 3. Clicking a position emits: onPause -> onSeeked -> onPlay
    //
    // If the video is NOT playing,
    //
    // 1. Dragging the player head emits: onSeeked
    // 2. Key press left right emits: onSeeked
    // 3. Clicking a position emits: onSeeked
    const fromTime = this.lastTimeUpdate;

    if (fromTime !== curTime) {
      // This removes duplicates that aren't useful.
      const recsysEvent = newRecsysPlayerEvent(PlayerEvent.event.scrub, fromTime, curTime);
      this.log('onSeeked', recsysEvent);
      RecSys.onRecsysPlayerEvent(this.options_.videoId, recsysEvent);
    }
  }

  onDispose(event: unknown) {
    RecSys.onPlayerDispose(this.options_.videoId, this.options_.embedded);
  }

  log(...args) {
    if (this.options_.debug) {
      console.log(`Recsys Player Debug:`, JSON.stringify(args));
    }
  }
}

videojs.registerComponent('recsys', RecsysPlugin);

const onPlayerReady = (player: unknown, options: unknown) => {
  player.recsys = new RecsysPlugin(player, options);
};

/**
 * Initialize the plugin.
 *
 * @function plugin
 * @param    {Object} [options={}]
 */
const plugin = function (options: unknown) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

plugin.VERSION = VERSION;

registerPlugin('recsys', plugin);

export default plugin;
