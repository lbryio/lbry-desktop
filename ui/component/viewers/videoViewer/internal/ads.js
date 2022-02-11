import videojs from 'video.js';

function hitsFiftyPercent() {
  // from 0 - 999
  const rand = Math.floor(Math.random() * (1000 + 1));

  // 499 is 50% chance of running
  if (rand > 499) {
    return true;
  } else {
    return false;
  }
}

const adTags = {
  ford: '612fb75a42715a07645a614c',
  live: '60b354389c7adb506d0bd9a4',
};

// Modified to work with IMA
// const vastMacroUrl =
//   `https://vast.aniview.com/api/adserver61/vast/` +
//   `?AV_PUBLISHERID=60afcbc58cfdb065440d2426` +
//   `&AV_CHANNELID=${adTags.ford}` +
//   `&AV_URL=[URL]` +
//   `&cb=[CACHEBUSTING]` +
//   `&AV_WIDTH=[WIDTH]` +
//   `&AV_HEIGHT=[HEIGHT]` +
//   // `&AV_SCHAIN=[SCHAIN_MACRO]` +
//   // `&AV_CCPA=[CCPA_MACRO]` +
//   // `&AV_GDPR=[GDPR_MACRO]` +
//   // `&AV_CONSENT=[CONSENT_MACRO]` +
//   `&skip=true` +
//   `&skiptimer=5` +
//   `&logo=true` +
//   `&usevslot=true` +
//   `&vastretry=2` +
//   `&hidecontrols=false`;

// only run on chrome (brave included) and don't run on mobile for time being
const browserIsChrome = videojs.browser.IS_CHROME;
const IS_IOS = videojs.browser.IS_IOS;
const IS_ANDROID = videojs.browser.IS_ANDROID;
const IS_MOBILE = IS_IOS || IS_ANDROID;

const hitsAtFiftyPercentChance = hitsFiftyPercent();

/**
 *
 * @param internalFeatureEnabled
 * @param allowPreRoll
 * @param player
 */
function runAds(internalFeatureEnabled, allowPreRoll, player, embedded) {
  // current timestamp for vpaid
  const timestamp = new Date().toISOString();

  const videoElement = document.getElementsByClassName('vjs-tech')[0];

  if (!videoElement) return;

  // height and width of player
  const height = videoElement.offsetHeight;
  const width = videoElement.offsetWidth;

  const vpaidMacroUrl =
    'https://gov.aniview.com/api/adserver/vast3/' +
    '?AV_PUBLISHERID=60afcbc58cfdb065440d2426' +
    `&AV_CHANNELID=${adTags.live}` +
    `&AV_URL=${encodeURIComponent(window.location.href)}` +
    `&cb=${encodeURIComponent(timestamp)}` +
    `&AV_WIDTH=${width}` +
    `&AV_HEIGHT=${height}` +
    // '&AV_SCHAIN=[SCHAIN_MACRO]' +
    // '&AV_CCPA=[CCPA_MACRO]' +
    // '&AV_GDPR=[GDPR_MACRO]' +
    // '&AV_CONSENT=[CONSENT_MACRO]' +
    `&skip=true` +
    `&skiptimer=5` +
    `&logo=true` +
    `&usevslot=true` +
    `&vastretry=2` +
    `&hidecontrols=false`;

  // always have ads on if internal feature is on,
  // otherwise if not authed, roll for 20% to see an ad
  // allowPreRoll currently means unauthenticated (don't show to logged in users)
  const shouldShowAnAd = internalFeatureEnabled || (!embedded && allowPreRoll && hitsAtFiftyPercentChance);

  if (shouldShowAnAd && browserIsChrome && !IS_MOBILE) {
    // fire up ima integration via module
    player.ima({
      adTagUrl: vpaidMacroUrl,
      vpaidMode: 2, // 2 maps to insecure
    });
  }
}

export default runAds;
