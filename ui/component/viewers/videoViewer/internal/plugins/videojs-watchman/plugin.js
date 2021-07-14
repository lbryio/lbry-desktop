// Created by xander on 7/10/2021
import videojs from 'video.js';
const VERSION = '0.0.1';

const watchmanEndpoint = 'https://watchman.na-backend.dev.odysee.com';

/* Watchman */
function createWatchmanData(
  url,
  duration,
  position,
  relPosition,
  rebufCount,
  rebufDuration,
  format,
  player,
  userId,
  device
) {
  return {
    url: url,
    duration: duration,
    rel_position: relPosition,
    rebuf_count: rebufCount,
    rebuf_duration: rebufDuration,
    format: format,
    player: player,
    user_id: userId,
    device: device,
  };
}

function sendWatchmanData(watchmanData) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' }, // application/json
    body: JSON.stringify(watchmanData),
  };

  try {
    fetch(watchmanEndpoint, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        // Response data
      });
  } catch (error) {
    // Response error
  }
}

// Plugin default options
const defaults = {
  endpoint: watchmanEndpoint,
  reportRate: 15,
  videoUrl: null,
  userId: 0,
  debug: false,
};

const Component = videojs.getComponent('Component');
const registerPlugin = videojs.registerPlugin || videojs.plugin;

class WatchmanPlugin extends Component {
  constructor(player, options) {
    super(player, options);

    // Plugin started
    if (options.debug) {
      this.log(`Created watchman plugin for: videoUrl:${options.videoUrl}, userId:${options.userId}`);
    }

    // Plugin variables
    this.player = player;
    this.loadedAt = Date.now();
    this.watchmanIntervalId = null;
    this.bufferEventData = [];

    // Plugin event listeners
    player.on('tracking:firstplay', (event, data) => this.onTrackingFirstPlay(event, data));
    player.on('tracking:buffered', (event, data) => this.onTrackingBuffered(event, data));

    // Event trigger to send recsys event
    player.on('dispose', (event) => this.onDispose(event));
  }

  sendWatchmanData() {
    const event = createWatchmanData(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
    sendWatchmanData(event);
  }

  onTrackingFirstPlay(event, data) {
    // data attr: secondsToLoad
    console.log(`First Play Data:`, data);

    // Start analytics interval here
    this.watchmanIntervalId = setInterval(() => this.onWatchmanInterval(), this.options_.reportRate);
  }

  onTrackingBuffered(event, data) {
    // data attr: currentTime, readyState, secondsToLoad, bufferCount
    console.log(`Buffer Data:`, data);
    this.bufferEventData.push(data);
  }

  onWatchmanInterval() {
    // process and send watchman data here

    // clear processed data
    this.bufferEventData = [];
  }

  onDispose(event) {
    // Stop analytics interval
    clearInterval(this.watchmanIntervalId);
  }

  log(...args) {
    if (this.options_.debug) {
      console.log(`Watchman Debug:`, JSON.stringify(args));
    }
  }
}

videojs.registerComponent('watchman', WatchmanPlugin);

const onPlayerReady = (player, options) => {
  player.recsys = new WatchmanPlugin(player, options);
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

registerPlugin('watchman', plugin);

export default plugin;
