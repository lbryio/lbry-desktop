// Created by xander on 6/21/2021
import videojs from 'video.js/dist/video.min.js';
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

  fetch(recsysEndpoint, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log(`Recsys response data:`, data);
    });
}

const defaults = {
  endpoint: recsysEndpoint,
  recsysId: recsysId,
  videoId: '0',
  userId: '0',
  debug: false,
};

const Component = videojs.getComponent('Component');
const registerPlugin = videojs.registerPlugin || videojs.plugin;

class RecsysPlugin extends Component {
  constructor(player, options) {
    super(player, options);

    // Plugin started
    console.log(`Created recsys plugin for: videoId:${options.videoId}, userId:${options.userId}`);

    // To help with debugging, we'll add a global vjs object with the video js player
    window.vjs = player;

    this.player = player;

    this.recsysEvents = [];
    this.lastTimeUpdate = null;
    this.currentTimeUpdate = null;
    this.loadedAt = Date.now();

    // Plugin event listeners
    player.on('playing', (event) => this.onPlay(event));
    player.on('pause', (event) => this.onPause(event));
    player.on('ended', (event) => this.onEnded(event));
    player.on('ratechange', (event) => this.onRateChange(event));
    player.on('timeupdate', (event) => this.onTimeUpdate(event));
    player.on('seeked', (event) => this.onSeeked(event));

    player.on('dispose', (event) => this.onDispose(event));
  }

  addRecsysEvent(recsysEvent) {
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
    console.log(event);
    sendRecsysEvents(event);
  }

  onPlay(event) {
    const recsysEvent = newRecsysEvent(RecsysData.event.start, this.player.currentTime());
    this.log('onPlay', recsysEvent);
    this.addRecsysEvent(recsysEvent);
  }

  onPause(event) {
    const recsysEvent = newRecsysEvent(RecsysData.event.stop, this.player.currentTime());
    this.log('onPause', recsysEvent);
    this.addRecsysEvent(recsysEvent);
  }

  onEnded(event) {
    const recsysEvent = newRecsysEvent(RecsysData.event.stop, this.player.currentTime());
    this.log('onEnded', recsysEvent);
    this.addRecsysEvent(recsysEvent);
  }

  onRateChange(event) {
    const recsysEvent = newRecsysEvent(RecsysData.event.speed, this.player.currentTime());
    this.log('onRateChange', recsysEvent);
    this.addRecsysEvent(recsysEvent);
  }

  onTimeUpdate(event) {
    this.lastTimeUpdate = this.currentTimeUpdate;
    this.currentTimeUpdate = this.player.currentTime();
  }

  onSeeked(event) {
    console.log(event);
    const recsysEvent = newRecsysEvent(RecsysData.event.scrub, this.lastTimeUpdate, this.player.currentTime());
    this.log('onSeeked', recsysEvent);
    this.addRecsysEvent(recsysEvent);
  }

  onDispose(event) {
    this.sendRecsysEvents();
  }

  log(...args) {
    console.log(`Recsys Debug:`, JSON.stringify(args));
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
const plugin = function(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

plugin.VERSION = VERSION;

registerPlugin('recsys', plugin);

export default plugin;
