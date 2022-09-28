// @flow
import videojs from 'video.js';
import type { Player } from '../../videojs';

const VERSION = '1.0.0';
const defaultOptions = {};

type Options = {
  timeoutMs: number,
  action?: () => void,
  livestreamsOnly?: boolean,
};

function onPlayerReady(player: Player, options: Options) {
  let watchdog;

  const stopWatchdog = () => {
    player.clearInterval(watchdog);
  };

  const resetWatchdog = function () {
    stopWatchdog();
    watchdog = player.setInterval(function () {
      if (options.action && (!options.livestreamsOnly || player.isLivestream)) {
        options.action();
      }
    }, options.timeoutMs);
  };

  player.on('waiting', resetWatchdog);
  player.on('timeupdate', stopWatchdog);
  player.on('dispose', stopWatchdog);
}

function watchdog(options: Options) {
  this.ready(() => onPlayerReady(this, videojs.mergeOptions(defaultOptions, options)));
}

videojs.registerPlugin('watchdog', watchdog);
watchdog.VERSION = VERSION;

export default watchdog;
