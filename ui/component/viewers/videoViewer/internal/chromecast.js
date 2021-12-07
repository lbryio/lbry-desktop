// @flow

/**
 * Wrapper for @silvermine/videojs-chromecast
 */
export default class Chromecast {
  /**
   * Actions that need to happen after initializing 'videojs'
   */
  static initialize(player: any) {
    // --- Start plugin ---
    player.chromecast();
    // --- Init cast framework ---
    const CHROMECAST_API_SCRIPT_ID = 'chromecastApi';
    const existingChromecastScript = document.getElementById(CHROMECAST_API_SCRIPT_ID);
    if (!existingChromecastScript) {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
      script.id = CHROMECAST_API_SCRIPT_ID;
      // $FlowFixMe
      document.body.appendChild(script);
    }
  }
}
