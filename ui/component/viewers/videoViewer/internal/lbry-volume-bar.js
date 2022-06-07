// ****************************************************************************
// LbryVolumeBarClass
// ****************************************************************************

import videojs from 'video.js';

const isDev = process.env.NODE_ENV !== 'production';

const VIDEOJS_CONTROL_BAR_CLASS = 'ControlBar';
const VIDEOJS_VOLUME_PANEL_CLASS = 'VolumePanel';
const VIDEOJS_VOLUME_CONTROL_CLASS = 'VolumeControl';
const VIDEOJS_VOLUME_BAR_CLASS = 'VolumeBar';

/**
 * LbryVolumeBarClass
 *
 * NOTE_1: https://github.com/lbryio/lbry-desktop/pull/5034 Stop propagation of
 *         mouse down/up events for it to work in Floating Player.
 */
class LbryVolumeBarClass extends videojs.getComponent(VIDEOJS_VOLUME_BAR_CLASS) {
  constructor(player, options = {}) {
    super(player, options);
  }

  static replaceExisting(player) {
    try {
      const volumeControl = player
        .getChild(VIDEOJS_CONTROL_BAR_CLASS)
        .getChild(VIDEOJS_VOLUME_PANEL_CLASS)
        .getChild(VIDEOJS_VOLUME_CONTROL_CLASS);
      const volumeBar = volumeControl.getChild(VIDEOJS_VOLUME_BAR_CLASS);
      volumeControl.removeChild(volumeBar);
      volumeControl.addChild(new LbryVolumeBarClass(player));
    } catch (error) {
      // In case it slips in 'Production', the original volume bar will be used and the site should still be working
      // (just not exactly the way we want).
      if (isDev) throw Error('\n\nvideojs.jsx: Volume Panel hierarchy changed?\n\n' + error);
    }
  }

  handleMouseDown(event) {
    super.handleMouseDown(event);
    event.stopPropagation(); // @see NOTE_1
  }

  handleMouseMove(event) {
    super.handleMouseMove(event);
    event.stopPropagation(); // @see NOTE_1
  }
}

export default LbryVolumeBarClass;
