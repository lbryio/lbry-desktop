// @flow

let gTitle = '';
let gChannelTitle = '';

/**
 * Wrapper for @silvermine/videojs-chromecast to consolidate all things related
 * to chromecast.
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

  /**
   * A React-to-vjs interface to pass the new content and channel titles to the
   * chromecast plugin.  Inline functions cannot be used in the `chromecast`
   * property in `videoJsOptions` due to stale closure, since we no longer
   * dispose the player when the src changes.
   *
   * We need this info from React because are unable to derive them from the
   * `src` argument of `requestTitleFn | requestSubtitleFn`.
   *
   * @param title
   * @param channelTitle
   */
  static updateTitles(title: ?string, channelTitle: ?string) {
    gTitle = title;
    gChannelTitle = channelTitle;
  }

  /**
   * Returns the required 'chromecast' options to be appended to the videojs
   * options object.
   */
  static getOptions() {
    return {
      chromecast: {
        requestTitleFn: (src: ?string) => gTitle || '',
        requestSubtitleFn: (src: ?string) => gChannelTitle || '',
      },
    };
  }
}
