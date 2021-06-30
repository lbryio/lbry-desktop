// Created by xander on 6/21/2021
import videojs from 'video.js';
import { v4 as uuidV4 } from 'uuid';
const VERSION = '0.0.1';

const recsysEndpoint = 'https://clickstream.odysee.com/log/video/view';
const recsysId = 'lighthouse-v0';

/* RecSys */
const RecsysData = {
  event: {
    start: 0,
    stop: 1,
    scrub: 2,
    speed: 3,
  },
};

function createRecsys(claimId, userId, events, loadedAt, isEmbed) {
  // TODO: use a UUID generator
  const uuid = uuidV4();
  const pageLoadedAt = loadedAt;
  const pageExitedAt = Date.now();
  return {
    uuid: uuid,
    parentUuid: null,
    uid: userId,
    claimId: claimId,
    pageLoadedAt: pageLoadedAt,
    pageExitedAt: pageExitedAt,
    recsysId: recsysId,
    recClaimIds: null,
    recClickedVideoIdx: null,
    events: events,
    isEmbed: isEmbed,
  };
}

function newRecsysEvent(eventType, offset, arg) {
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

function sendRecsysEvents(recsys) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' }, // application/json
    body: JSON.stringify(recsys),
  };

  try {
    fetch(recsysEndpoint, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        // console.log(`Recsys response data:`, data);
      });
  } catch (error) {
    // console.error(`Recsys Error`, error);
  }
}

const defaults = {
  endpoint: recsysEndpoint,
  recsysId: recsysId,
  videoId: null,
  userId: 0,
  debug: false,
};

const Component = videojs.getComponent('Component');
const registerPlugin = videojs.registerPlugin || videojs.plugin;

class RecsysPlugin extends Component {
  constructor(player, options) {
    super(player, options);

    // Plugin started
    if (options.debug) {
      this.log(`Created recsys plugin for: videoId:${options.videoId}, userId:${options.userId}`);
    }

    // To help with debugging, we'll add a global vjs object with the video js player
    window.vjs = player;

    this.player = player;

    this.recsysEvents = [];
    this.loadedAt = Date.now();
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

  addRecsysEvent(recsysEvent) {
    // For now, don't do client-side preprocessing. I think there
    // are browser inconsistencies and preprocessing loses too much info.
    this.recsysEvents.push(recsysEvent);
  }

  getRecsysEvents() {
    return this.recsysEvents;
  }

  sendRecsysEvents() {
    const event = createRecsys(
      this.options_.videoId,
      this.options_.userId,
      this.getRecsysEvents(),
      this.loadedAt,
      false
    );
    sendRecsysEvents(event);
  }

  onPlay(event) {
    const recsysEvent = newRecsysEvent(RecsysData.event.start, this.player.currentTime());
    this.log('onPlay', recsysEvent);
    this.addRecsysEvent(recsysEvent);

    this.inPause = false;
    this.lastTimeUpdate = recsysEvent.offset;
  }

  onPause(event) {
    const recsysEvent = newRecsysEvent(RecsysData.event.stop, this.player.currentTime());
    this.log('onPause', recsysEvent);
    this.addRecsysEvent(recsysEvent);

    this.inPause = true;
  }

  onEnded(event) {
    const recsysEvent = newRecsysEvent(RecsysData.event.stop, this.player.currentTime());
    this.log('onEnded', recsysEvent);
    this.addRecsysEvent(recsysEvent);
  }

  onRateChange(event) {
    const recsysEvent = newRecsysEvent(RecsysData.event.speed, this.player.currentTime(), this.player.playbackRate());
    this.log('onRateChange', recsysEvent);
    this.addRecsysEvent(recsysEvent);
  }

  onTimeUpdate(event) {
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

  onSeeked(event) {
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
      const recsysEvent = newRecsysEvent(RecsysData.event.scrub, fromTime, curTime);
      this.log('onSeeked', recsysEvent);
      this.addRecsysEvent(recsysEvent);
    }
  }

  onDispose(event) {
    this.sendRecsysEvents();
  }

  log(...args) {
    if (this.options_.debug) {
      console.log(`Recsys Debug:`, JSON.stringify(args));
    }
  }
}

videojs.registerComponent('recsys', RecsysPlugin);

const onPlayerReady = (player, options) => {
  player.recsys = new RecsysPlugin(player, options);
};

/**
 * Initialize the plugin.
 *
 * @function plugin
 * @param    {Object} [options={}]
 */
const plugin = function (options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

plugin.VERSION = VERSION;

registerPlugin('recsys', plugin);

export default plugin;
