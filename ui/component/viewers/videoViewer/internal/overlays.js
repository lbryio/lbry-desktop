import React from 'react';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';
import ReactDOMServer from 'react-dom/server';

import './plugins/videojs-overlay/plugin';
import './plugins/videojs-overlay/plugin.scss';

// ****************************************************************************
// ****************************************************************************

const OVERLAY_NAME_ONE_OFF = 'one-off';
const OVERLAY_CLASS_PLAYBACK_RATE = 'vjs-overlay-playrate';
const OVERLAY_CLASS_SEEKED = 'vjs-overlay-seeked';

// ****************************************************************************
// ****************************************************************************

/**
 * Overlays that will always be registered with the plugin.
 * @type {*[]}
 */
const PERMANENT_OVERLAYS = [
  // Nothing for now.
  // --- Example: ---
  // {
  //   content: 'Video is now playing',
  //   start: 'play',
  //   end: 'pause',
  //   align: 'center',
  // },
];

export const OVERLAY_DATA = {
  // https://github.com/brightcove/videojs-overlay/blob/master/README.md#documentation
  overlays: [...PERMANENT_OVERLAYS],
};

/**
 * Wrapper to hide away the complexity of adding dynamic content, which the
 * plugin currently does not support. To change the 'content' of an overlay,
 * we need to re-create the entire array.
 * This wrapper ensures the PERMANENT_OVERLAYS (and potentially other overlays)
 * don't get lost.
 */
function showOneOffOverlay(player, className, overlayJsx, align) {
  // Delete existing:
  OVERLAY_DATA.overlays = OVERLAY_DATA.overlays.filter((x) => x.name !== OVERLAY_NAME_ONE_OFF);
  // Create new one:
  OVERLAY_DATA.overlays.push({
    name: OVERLAY_NAME_ONE_OFF,
    class: className,
    content: ReactDOMServer.renderToStaticMarkup(overlayJsx),
    start: 'immediate',
    align: align,
  });
  // Display it:
  player.overlay(OVERLAY_DATA);
}

/**
 * Displays a transient "Playback Rate" overlay.
 *
 * @param player The videojs instance.
 * @param newRate The current playback rate value.
 * @param isSpeedUp true if the change was speeding up, false otherwise.
 */
export function showPlaybackRateOverlay(player, newRate, isSpeedUp) {
  const overlayJsx = (
    <div>
      <p>{newRate}x</p>
      <p>
        <Icon icon={isSpeedUp ? ICONS.ARROW_RIGHT : ICONS.ARROW_LEFT} size={48} />
      </p>
    </div>
  );

  showOneOffOverlay(player, OVERLAY_CLASS_PLAYBACK_RATE, overlayJsx, 'center');
}

/**
 * Displays a transient "Seeked" overlay.
 *
 * @param player The videojs instance.
 * @param duration The seek delta duration.
 * @param isForward true if seeking forward, false otherwise.
 */
export function showSeekedOverlay(player, duration, isForward, isJumpTo) {
  const overlayJsx = (
    <div>
      <p>
        {!isJumpTo && (isForward ? '+' : '-')}
        {duration}
        {isJumpTo && '%'}
      </p>
    </div>
  );

  showOneOffOverlay(player, OVERLAY_CLASS_SEEKED, overlayJsx, 'center');
}

/**
 * Displays a transient "Volume Percentage" overlay.
 *
 * @param player The videojs instance.
 * @param percentage how much % of volume active.
 */
export function showVolumeverlay(player, percentage) {
  const overlayJsx = (
    <div>
      <p>
        {percentage}
        {'%'}
      </p>
    </div>
  );

  showOneOffOverlay(player, OVERLAY_CLASS_SEEKED, overlayJsx, 'center');
}
