// Created by xander on 6/21/2021
import videojs from 'video.js/dist/video.min.js';
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

function sendRecsysEvent(recsysEvent) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recsysEvent),
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
    console.log(`created recsys plugin for: videoId:${options.videoId}, userId:${options.userId}`);

    // To help with debugging, we'll add a global vjs object with the video js player
    window.vjs = player;

    this.player = player;

    // Plugin event listeners
    player.on('playing', (event) => this.onPlay(event));
    player.on('pause', (event) => this.onPause(event));
    player.on('ended', (event) => this.onEnded(event));
    player.on('ratechange', (event) => this.onRateChange(event));
    player.on('seeking', (event) => this.onSeeking(event));
  }

  onPlay(event) {
    const recsysEvent = newRecsysEvent(RecsysData.event.start, this.player.currentTime());
    this.log('onPlay', recsysEvent);
    sendRecsysEvent(recsysEvent);
  }

  onPause(event) {
    const recsysEvent = newRecsysEvent(RecsysData.event.stop, this.player.currentTime());
    this.log('onPause', recsysEvent);
    sendRecsysEvent(recsysEvent);
  }

  onEnded(event) {
    const recsysEvent = newRecsysEvent(RecsysData.event.stop, this.player.currentTime());
    this.log('onEnded', recsysEvent);
    sendRecsysEvent(recsysEvent);
  }

  onRateChange(event) {
    const recsysEvent = newRecsysEvent(RecsysData.event.speed, this.player.currentTime());
    this.log('onRateChange', recsysEvent);
    sendRecsysEvent(recsysEvent);
  }

  onSeeking(event) {
    const recsysEvent = newRecsysEvent(RecsysData.event.scrub, this.player.currentTime());
    this.log('onSeeking', recsysEvent);
    sendRecsysEvent(recsysEvent);
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
