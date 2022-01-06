// @flow
import 'videojs-contrib-ads'; // must be loaded in this order
import 'videojs-ima'; // loads directly after contrib-ads
import 'video.js/dist/alt/video-js-cdn.min.css';
import './plugins/videojs-mobile-ui/plugin';
import '@silvermine/videojs-chromecast/dist/silvermine-videojs-chromecast.css';
import * as ICONS from 'constants/icons';
import * as OVERLAY from './overlays';
import Button from 'component/button';
import classnames from 'classnames';
import events from './videojs-events';
import eventTracking from 'videojs-event-tracking';
import functions from './videojs-functions';
import hlsQualitySelector from './plugins/videojs-hls-quality-selector/plugin';
import keyboardShorcuts from './videojs-keyboard-shortcuts';
import LbryVolumeBarClass from './lbry-volume-bar';
import Chromecast from './chromecast';
import playerjs from 'player.js';
import qualityLevels from 'videojs-contrib-quality-levels';
import React, { useEffect, useRef, useState } from 'react';
import recsys from './plugins/videojs-recsys/plugin';
// import runAds from './ads';
import videojs from 'video.js';
const canAutoplay = require('./plugins/canAutoplay');

require('@silvermine/videojs-chromecast')(videojs);

export type Player = {
  controlBar: { addChild: (string, any) => void },
  loadingSpinner: any,
  autoplay: (any) => boolean,
  chromecast: (any) => void,
  currentTime: (?number) => number,
  dispose: () => void,
  ended: () => boolean,
  error: () => any,
  exitFullscreen: () => boolean,
  getChild: (string) => any,
  isFullscreen: () => boolean,
  mobileUi: (any) => void,
  muted: (?boolean) => boolean,
  on: (string, (any) => void) => void,
  one: (string, (any) => void) => void,
  overlay: (any) => void,
  play: () => Promise<any>,
  playbackRate: (?number) => number,
  readyState: () => number,
  requestFullscreen: () => boolean,
  userActive: (?boolean) => boolean,
  volume: (?number) => number,
};

type Props = {
  adUrl: ?string,
  allowPreRoll: ?boolean,
  autoplay: boolean,
  autoplaySetting: boolean,
  claimId: ?string,
  title: ?string,
  channelName: ?string,
  embedded: boolean,
  internalFeatureEnabled: ?boolean,
  isAudio: boolean,
  poster: ?string,
  replay: boolean,
  shareTelemetry: boolean,
  source: string,
  sourceType: string,
  startMuted: boolean,
  userId: ?number,
  videoTheaterMode: boolean,
  onPlayerReady: (Player, any) => void,
  playNext: () => void,
  playPrevious: () => void,
  toggleVideoTheaterMode: () => void,
  claimRewards: () => void,
  doAnalyticsView: (string, number) => void,
  uri: string,
  claimValues: any,
  clearPosition: (string) => void,
  centerPlayButton: () => void,
};

const videoPlaybackRates = [0.25, 0.5, 0.75, 1, 1.1, 1.25, 1.5, 1.75, 2];

const IS_IOS =
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
    // for iOS 13+ , platform is MacIntel, so use this to test
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window.MSStream;

if (!Object.keys(videojs.getPlugins()).includes('eventTracking')) {
  videojs.registerPlugin('eventTracking', eventTracking);
}

if (!Object.keys(videojs.getPlugins()).includes('hlsQualitySelector')) {
  videojs.registerPlugin('hlsQualitySelector', hlsQualitySelector);
}

if (!Object.keys(videojs.getPlugins()).includes('qualityLevels')) {
  videojs.registerPlugin('qualityLevels', qualityLevels);
}

if (!Object.keys(videojs.getPlugins()).includes('recsys')) {
  videojs.registerPlugin('recsys', recsys);
}

// ****************************************************************************
// VideoJs
// ****************************************************************************

/*
properties for this component should be kept to ONLY those that if changed should REQUIRE an entirely new videojs element
 */
export default React.memo<Props>(function VideoJs(props: Props) {
  const {
    // adUrl, // TODO: this ad functionality isn't used, can be pulled out
    // allowPreRoll,
    autoplay,
    autoplaySetting,
    claimId,
    title,
    channelName,
    embedded,
    // internalFeatureEnabled, // for people on the team to test new features internally
    isAudio,
    poster,
    replay,
    shareTelemetry,
    source,
    sourceType,
    startMuted,
    userId,
    videoTheaterMode,
    onPlayerReady,
    playNext,
    playPrevious,
    toggleVideoTheaterMode,
    claimValues,
    doAnalyticsView,
    claimRewards,
    uri,
    clearPosition,
    centerPlayButton,
  } = props;

  // will later store the videojs player
  const playerRef = useRef();
  const containerRef = useRef();

  const tapToUnmuteRef = useRef();
  const tapToRetryRef = useRef();

  const playerServerRef = useRef();

  // initiate keyboard shortcuts
  const { curried_function } = keyboardShorcuts({ toggleVideoTheaterMode, playNext, playPrevious });

  const [reload, setReload] = useState('initial');

  const { createVideoPlayerDOM } = functions({ isAudio });

  const { unmuteAndHideHint, retryVideoAfterFailure, initializeEvents } = events({
    tapToUnmuteRef,
    tapToRetryRef,
    setReload,
    videoTheaterMode,
    playerRef,
    autoplaySetting,
    replay,
    claimValues,
    userId,
    claimId,
    embedded,
    doAnalyticsView,
    claimRewards,
    uri,
    playerServerRef,
    clearPosition,
  });

  const videoJsOptions = {
    preload: 'auto',
    playbackRates: videoPlaybackRates,
    responsive: true,
    controls: true,
    html5: {
      vhs: {
        overrideNative: !videojs.browser.IS_ANY_SAFARI,
      },
    },
    autoplay: autoplay,
    muted: startMuted,
    poster: poster, // thumb looks bad in app, and if autoplay, flashing poster is annoying
    plugins: { eventTracking: true, overlay: OVERLAY.OVERLAY_DATA },
    // fixes problem of errant CC button showing up on iOS
    // the true fix here is to fix the m3u8 file, see: https://github.com/lbryio/lbry-desktop/pull/6315
    controlBar: { subsCapsButton: false },
    techOrder: ['chromecast', 'html5'],
    chromecast: {
      requestTitleFn: (src) => title || '',
      requestSubtitleFn: (src) => channelName || '',
    },
    bigPlayButton: embedded, // only show big play button if embedded
  };

  // Initialize video.js
  function initializeVideoPlayer(el, canAutoplayVideo) {
    if (!el) return;

    const vjs = videojs(el, videoJsOptions, async () => {
      const player = playerRef.current;
      const adapter = new playerjs.VideoJSAdapter(player);

      // this seems like a weird thing to have to check for here
      if (!player) return;

      // runAds(internalFeatureEnabled, allowPreRoll, player, embedded);

      initializeEvents();

      // Replace volume bar with custom LBRY volume bar
      LbryVolumeBarClass.replaceExisting(player);

      // Add reloadSourceOnError plugin
      player.reloadSourceOnError({ errorInterval: 10 });

      // Initialize mobile UI.
      player.mobileUi();

      if (!embedded) {
        window.player.bigPlayButton && window.player.bigPlayButton.hide();
      } else {
        const bigPlayButton = document.querySelector('.vjs-big-play-button');
        if (bigPlayButton) bigPlayButton.style.setProperty('display', 'block', 'important');
      }

      Chromecast.initialize(player);

      // Add quality selector to player
      player.hlsQualitySelector({
        displayCurrentQuality: true,
      });

      // Add recsys plugin
      if (shareTelemetry) {
        player.recsys({
          videoId: claimId,
          userId: userId,
          embedded: embedded,
        });
      }

      // set playsinline for mobile
      player.children_[0].setAttribute('playsinline', '');

      if (canAutoplayVideo === true) {
        // show waiting spinner as video is loading
        player.addClass('vjs-waiting');
        // document.querySelector('.vjs-big-play-button').style.setProperty('display', 'none', 'important');
      } else {
        // $FlowFixMe
        document.querySelector('.vjs-big-play-button').style.setProperty('display', 'block', 'important');
      }

      // center play button
      centerPlayButton();

      // I think this is a callback function
      const videoNode = containerRef.current && containerRef.current.querySelector('video, audio');

      onPlayerReady(player, videoNode);
      adapter.ready();

      // sometimes video doesnt start properly, this addresses the edge case
      if (autoplay) {
        const videoDiv = window.player.children_[0];
        if (videoDiv) {
          videoDiv.click();
        }
        window.player.userActive(true);
      }
    });

    // fixes #3498 (https://github.com/lbryio/lbry-desktop/issues/3498)
    // summary: on firefox the focus would stick to the fullscreen button which caused buggy behavior with spacebar
    vjs.on('fullscreenchange', () => document.activeElement && document.activeElement.blur());

    return vjs;
  }

  /** instantiate videoJS and dispose of it when done with code **/
  // This lifecycle hook is only called once (on mount), or when `isAudio` or `source` changes.
  useEffect(() => {
    (async function() {
      // test if perms to play video are available
      let canAutoplayVideo = await canAutoplay.video({ timeout: 2000 });

      canAutoplayVideo = canAutoplayVideo.result === true;

      const vjsElement = createVideoPlayerDOM(containerRef.current);

      // Initialize Video.js
      const vjsPlayer = initializeVideoPlayer(vjsElement, canAutoplayVideo);

      // Add reference to player to global scope
      window.player = vjsPlayer;

      // Set reference in component state
      playerRef.current = vjsPlayer;

      window.addEventListener('keydown', curried_function(playerRef, containerRef));

      // $FlowFixMe
      document.querySelector('.vjs-control-bar').style.setProperty('opacity', '1', 'important');

      // change to m3u8 if applicable
      const response = await fetch(source, { method: 'HEAD', cache: 'no-store' });

      playerServerRef.current = response.headers.get('x-powered-by');

      if (response && response.redirected && response.url && response.url.endsWith('m3u8')) {
        // use m3u8 source
        // $FlowFixMe
        vjsPlayer.src({
          type: 'application/x-mpegURL',
          src: response.url,
        });
      } else {
        // use original mp4 source
        // $FlowFixMe
        vjsPlayer.src({
          type: sourceType,
          src: source,
        });
      }
      // load video once source setup
      // $FlowFixMe
      vjsPlayer.load();
    })();

    // Cleanup
    return () => {
      window.removeEventListener('keydown', curried_function);

      const player = playerRef.current;
      if (player) {
        try {
          window.cast.framework.CastContext.getInstance().getCurrentSession().endSession(false);
        } catch {}

        player.dispose();
        window.player = undefined;
      }
    };
  }, [isAudio, source, reload]);

  return (
    <div className={classnames('video-js-parent', { 'video-js-parent--ios': IS_IOS })} ref={containerRef}>
      <Button
        label={__('Tap to unmute')}
        button="link"
        icon={ICONS.VOLUME_MUTED}
        className="video-js--tap-to-unmute"
        onClick={unmuteAndHideHint}
        ref={tapToUnmuteRef}
      />
      <Button
        label={__('Retry')}
        button="link"
        icon={ICONS.REFRESH}
        className="video-js--tap-to-unmute"
        onClick={retryVideoAfterFailure}
        ref={tapToRetryRef}
      />
    </div>
  );
});
