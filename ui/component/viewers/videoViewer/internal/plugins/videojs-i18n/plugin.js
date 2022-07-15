/**
 * Although videojs has its own i18n system, it is not trivial to pass our
 * translation data to it. Instead of maintaining two sets of localization
 * systems, we'll just ignore the videojs one and update the strings ourselves
 * through events.
 *
 * We use events because that's the only way to update components with dynamic
 * text like "Play/Pause" in videojs. We can't just define the set of texts at
 * initialization, unless we use custom components to do that.
 *
 * For the case of 'MuteToggle', videojs changes the text at 'loadstart', so
 * this event was chosen as the "lowest common denominator" to update the other
 * static-text components.
 *
 * --- Notes ---
 * (1) 'AutoplayNextButton' and 'TheaterModeButton' handles i18n (among other
 * things) on its own.
 */

// @flow
import videojs from 'video.js';
import type { Player } from '../../videojs';

const VERSION = '1.0.0';
const defaultOptions = {};

function logError(msg) {
  // @if process.env.LOG_VIDEOJS_I18N='true'
  console.error(msg);
  // @endif
}

function setLabel(controlBar, childName, label) {
  try {
    controlBar.getChild(childName).controlText(label);
  } catch (e) {
    // We want to be notified, at least on dev, over any structural changes,
    // so don't check for null children and let the error surface.
    logError(childName + ': ' + e);
  }
}

function resolveCtrlText(e, player) {
  if (player) {
    const ctrlBar = player.getChild('controlBar');
    switch (e.type) {
      case 'play':
        setLabel(ctrlBar, 'PlayToggle', __('Pause (space)'));
        break;

      case 'pause':
        setLabel(ctrlBar, 'PlayToggle', __('Play (space)'));
        break;

      case 'volumechange':
        try {
          ctrlBar
            .getChild('VolumePanel')
            .getChild('MuteToggle')
            .controlText(player.muted() || player.volume() === 0 ? __('Unmute (m)') : __('Mute (m)'));
        } catch (e) {
          logError('MuteToggle: ' + e);
        }
        break;

      case 'fullscreenchange':
        setLabel(ctrlBar, 'FullscreenToggle', player.isFullscreen() ? __('Exit Fullscreen (f)') : __('Fullscreen (f)'));
        break;

      case 'loadstart':
        // --- Do everything ---
        setLabel(ctrlBar, 'PlaybackRateMenuButton', __('Playback Rate (<, >)'));
        setLabel(ctrlBar, 'QualityButton', __('Quality'));
        setLabel(ctrlBar, 'PlayNextButton', __('Play Next (SHIFT+N)'));
        setLabel(ctrlBar, 'PlayPreviousButton', __('Play Previous (SHIFT+P)'));
        setLabel(ctrlBar, 'ChaptersButton', __('Chapters'));
        setLabel(ctrlBar, 'ChromecastButton', __('Open Chromecast menu'));
        setLabel(ctrlBar, 'FullscreenToggle', player.isFullscreen() ? __('Exit Fullscreen (f)') : __('Fullscreen (f)'));

        try {
          ctrlBar
            .getChild('VolumePanel')
            .getChild('MuteToggle')
            .controlText(player.muted() || player.volume() === 0 ? __('Unmute (m)') : __('Mute (m)'));
        } catch (e) {
          logError('MuteToggle: ' + e);
        }

        resolveCtrlText({ type: 'play' });
        resolveCtrlText({ type: 'pause' });
        resolveCtrlText({ type: 'volumechange' });
        resolveCtrlText({ type: 'fullscreenchange' });
        break;

      default:
        logError('Unexpected: ' + e.type);
        break;
    }
  }
}

function onPlayerReady(player: Player, options: {}) {
  const h = (e) => resolveCtrlText(e, player);

  player.on('play', h);
  player.on('pause', h);
  player.on('loadstart', h);
  player.on('fullscreenchange', h);
  player.on('volumechange', h);
}

/**
 * Odysee custom i18n plugin.
 * @param options
 */
function i18n(options: {}) {
  this.ready(() => onPlayerReady(this, videojs.mergeOptions(defaultOptions, options)));
}

videojs.registerPlugin('i18n', i18n);
i18n.VERSION = VERSION;

export default i18n;
