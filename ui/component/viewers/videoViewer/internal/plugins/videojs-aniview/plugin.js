// Created by xander on 6/21/2021
import videojs from 'video.js';
import 'videojs-contrib-ads';
import 'videojs-ima';
const VERSION = '0.0.1';

/* Macro provided by aniview
* const macroUrl =
  `https://vast.aniview.com/api/adserver61/vast/` +
  `?AV_PUBLISHERID=60afcbc58cfdb065440d2426` +
  `&AV_CHANNELID=60b354389c7adb506d0bd9a4` +
  `&AV_URL=[URL_MACRO]` +
  `&cb=[TIMESTAMP_MACRO]` +
  `&AV_WIDTH=[WIDTH_MACRO]` +
  `&AV_HEIGHT=[HEIGHT_MACRO]` +
  `&AV_SCHAIN=[SCHAIN_MACRO]` +
  `&AV_CCPA=[CCPA_MACRO]` +
  `&AV_GDPR=[GDPR_MACRO]` +
  `&AV_CONSENT=[CONSENT_MACRO]` +
  `&skip=true` +
  `&skiptimer=5` +
  `&logo=false` +
  `&usevslot=true` +
  `&vastretry=3` +
  `&hidecontrols=false`;
* */

// TEST PRE-ROLL WITH THIS TAG:
// https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpreonly&cmsid=496&vid=short_onecue&correlator=

// Modified to work with IMA
const macroUrl =
  `https://vast.aniview.com/api/adserver61/vast/` +
  `?AV_PUBLISHERID=60afcbc58cfdb065440d2426` +
  `&AV_CHANNELID=60b354389c7adb506d0bd9a4` +
  `&AV_URL=[URL]` +
  `&cb=[CACHEBUSTING]` +
  `&AV_WIDTH=[WIDTH]` +
  `&AV_HEIGHT=[HEIGHT]` +
  // `&AV_SCHAIN=[SCHAIN_MACRO]` +
  // `&AV_CCPA=[CCPA_MACRO]` +
  // `&AV_GDPR=[GDPR_MACRO]` +
  // `&AV_CONSENT=[CONSENT_MACRO]` +
  `&skip=true` +
  `&skiptimer=5` +
  `&logo=true` +
  `&usevslot=true` +
  `&vastretry=5` +
  `&hidecontrols=false`;

const defaults = {
  adTagUrl: macroUrl,
  debug: false,
};

const Component = videojs.getComponent('Component');
const registerPlugin = videojs.registerPlugin || videojs.plugin;

class AniviewPlugin extends Component {
  constructor(player, options) {
    super(player, options);

    // Plugin started
    if (options.debug) this.log(`Created aniview plugin.`);

    // To help with debugging, we'll add a global vjs object with the video js player
    window.aniview = player;

    this.player = player;

    // request ads whenever there's new video content
    /* player.on('contentchanged', () => {
      // in a real plugin, you might fetch your ad inventory here
      player.trigger('adsready');
    }); */

    // Plugin event listeners
    // player.on('readyforpreroll', (event) => this.onReadyForPreroll(event));
  }

  /* onReadyForPreroll(event) {
    // send event when ad is playing to remove loading spinner
    this.player.one('adplaying', () => {
      this.player.trigger('ads-ad-started');
    });

    // resume content when all your linear ads have finished
    this.player.one('adended', () => {
      this.player.ads.endLinearAdMode();
    });
  } */

  log(...args) {
    if (this.options_.debug) {
      console.log(`Aniview Debug:`, JSON.stringify(args));
    }
  }
}

videojs.registerComponent('aniview', AniviewPlugin);

const onPlayerReady = (player, options) => {
  player.aniview = new AniviewPlugin(player, options);
};

/**
 * Initialize the plugin.
 *
 * @function plugin
 * @param    {Object} [options={}]
 */
const plugin = function (options) {
  const google = window.google;

  this.ima({
    // $FlowFixMe
    vpaidMode: google.ima.ImaSdkSettings.VpaidMode.INSECURE,
    adTagUrl: macroUrl,
  });

  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

plugin.VERSION = VERSION;

registerPlugin('aniview', plugin);

export default plugin;
