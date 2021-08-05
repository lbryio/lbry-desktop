// Created by xander on 7/10/2021
import videojs from 'video.js';
const VERSION = '0.0.1';

const watchmanEndpoint = 'https://watchman.na-backend.odysee.com/reports/playback';

let previousEventTime = Date.now();

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
    headers: { 'Content-Type': 'application/json' }, // application/json
    body: JSON.stringify(watchmanData),
  };

  try {
    fetch(watchmanEndpoint, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log('it worked')
        // Response data
      });
  } catch (error) {
    console.log('was an error');
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
    this.poweredBy = '';

    // Plugin event listeners
    player.on('tracking:firstplay', (event, data) => this.onTrackingFirstPlay(event, data));
    player.on('tracking:buffered', (event, data) => this.onTrackingBuffered(event, data));

    // player.on('tracking:buffered', function(event, data){
    //   console.log('here!');
    //   console.log(event);
    //   console.log(data);
    // })

    // Event trigger to send recsys event
    player.on('dispose', (event) => this.onDispose(event));
  }

  sendWatchmanData() {
    console.log('running once here');

    const processedData = this.bufferEventData.reduce(
      (accumulator, current) => {
        // Always update with the most current player x-powered-by header
        if (current.hasOwnProperty('playerPoweredBy') && current.playerPoweredBy) {
          this.poweredBy = current.playerPoweredBy;
        }

        return {
          secondsToLoad: accumulator.secondsToLoad + current.secondsToLoad,
          bufferCount: accumulator.bufferCount + current.bufferCount,
        };
      },
      {
        secondsToLoad: 0,
        bufferCount: 0,
      }
    );

    const timeSinceLastEvent = Date.now() - previousEventTime;
    previousEventTime = Date.now();

    const currentTime = this.player.currentTime();
    const totalTime = this.player.duration();

    const event = createWatchmanData(
      this.options_.videoUrl,
      timeSinceLastEvent,
      currentTime,
      currentTime / totalTime,
      processedData.bufferCount,
      processedData.secondsToLoad * 1000,
      this.player.currentSource().type,
      this.poweredBy,
      this.options_.userId,
      navigator.userAgent
    );

    if (this.options_.debug) {
      console.log('[watchman] Data Payload', event);
    }

    sendWatchmanData(event);
  }

  onTrackingFirstPlay(event, data) {
    // data attr: secondsToLoad
    if (this.options_.debug) {
      console.log(`[watchman] First Play Data:`, data);
    }

    // Start analytics interval here
    this.watchmanIntervalId = setInterval(() => this.onWatchmanInterval(), this.options_.reportRate * 1000);
  }

  onTrackingBuffered(event, data) {
    const duration = this.player.duration();

    const reportData = {
      ...data,
      relativePosition: data.currentTime / duration,
    };

    // data attr: currentTime, readyState, secondsToLoad, bufferCount
    if (this.options_.debug) {
      console.log(`[watchman] Buffer Data:`, reportData);
    }

    this.bufferEventData.push(data);
  }

  onWatchmanInterval() {

    console.log('player paused');
    console.log(this.player.paused())

    // don't report while player is paused
    if (this.player.paused()) return;

    // process and send watchman data here
    if (this.options_.debug) {
      console.log('[watchman] interval', this.bufferEventData);
    }

    // this.sendWatchmanData();

    // clear processed data
    this.bufferEventData = [];
  }

  onDispose(event) {
    // Stop analytics interval
    clearInterval(this.watchmanIntervalId);
  }

  log(...args) {
    if (this.options_.debug) {
      console.log(`[watchman] Debug:`, JSON.stringify(args));
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
const plugin = function (options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

plugin.VERSION = VERSION;

registerPlugin('watchman', plugin);

export default plugin;
