// @flow
import React, { useEffect, useRef, useState } from 'react';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import classnames from 'classnames';
import videojs from 'video.js';
import 'video.js/dist/alt/video-js-cdn.min.css';
import eventTracking from 'videojs-event-tracking';
import * as OVERLAY from './overlays';
import './plugins/videojs-mobile-ui/plugin';
import hlsQualitySelector from './plugins/videojs-hls-quality-selector/plugin';
import recsys from './plugins/videojs-recsys/plugin';
import qualityLevels from 'videojs-contrib-quality-levels';
import LbryVolumeBarClass from './lbry-volume-bar';
import keyboardShorcuts from './videojs-keyboard-shortcuts';
import events from './videojs-events';
import functions from './videojs-functions';

export type Player = {
  on: (string, (any) => void) => void,
  one: (string, (any) => void) => void,
  isFullscreen: () => boolean,
  exitFullscreen: () => boolean,
  requestFullscreen: () => boolean,
  play: () => Promise<any>,
  volume: (?number) => number,
  muted: (?boolean) => boolean,
  dispose: () => void,
  currentTime: (?number) => number,
  ended: () => boolean,
  error: () => any,
  loadingSpinner: any,
  getChild: (string) => any,
  playbackRate: (?number) => number,
  readyState: () => number,
  userActive: (?boolean) => boolean,
  overlay: (any) => void,
  mobileUi: (any) => void,
  controlBar: {
    addChild: (string, any) => void,
  },
  autoplay: (any) => boolean,
};

type Props = {
  source: string,
  sourceType: string,
  poster: ?string,
  onPlayerReady: (Player, any) => void,
  isAudio: boolean,
  autoplay: boolean,
  autoplaySetting: boolean,
  toggleVideoTheaterMode: () => void,
  claimId: ?string,
  userId: ?number,
  // allowPreRoll: ?boolean,
  shareTelemetry: boolean,
  replay: boolean,
  videoTheaterMode: boolean,
  playNext: () => void,
  playPrevious: () => void,
};

const videoPlaybackRates = [0.25, 0.5, 0.75, 1, 1.1, 1.25, 1.5, 1.75, 2];

const IS_IOS =
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window.MSStream;

const VIDEO_JS_OPTIONS = {
  preload: 'auto',
  playbackRates: videoPlaybackRates,
  responsive: true,
  controls: true,
  html5: {
    vhs: {
      overrideNative: !videojs.browser.IS_ANY_SAFARI,
    },
  },
};

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
    autoplay,
    autoplaySetting,
    source,
    sourceType,
    poster,
    isAudio,
    onPlayerReady,
    toggleVideoTheaterMode,
    claimId,
    userId,
    shareTelemetry,
    replay,
    videoTheaterMode,
    playNext,
    playPrevious,
  } = props;

  // will later store the videojs player
  const playerRef = useRef();
  const containerRef = useRef();

  const tapToUnmuteRef = useRef();
  const tapToRetryRef = useRef();

  // initiate keyboard shortcuts
  const { curried_function } = keyboardShorcuts({ toggleVideoTheaterMode, playNext, playPrevious });

  const [reload, setReload] = useState('initial');

  const videoJsOptions = {
    ...VIDEO_JS_OPTIONS,
    autoplay: autoplay,
    sources: [
      {
        src: source,
        type: sourceType,
      },
    ],
    poster: poster, // thumb looks bad in app, and if autoplay, flashing poster is annoying
    plugins: {
      eventTracking: true,
      overlay: OVERLAY.OVERLAY_DATA,
    },
    // fixes problem of errant CC button showing up on iOS
    // the true fix here is to fix the m3u8 file, see: https://github.com/lbryio/lbry-desktop/pull/6315
    controlBar: {
      subsCapsButton: false,
    },
  };

  const { detectFileType, createVideoPlayerDOM } = functions({ source, sourceType, videoJsOptions, isAudio });

  const { unmuteAndHideHint, retryVideoAfterFailure, initializeEvents } = events({
    tapToUnmuteRef,
    tapToRetryRef,
    setReload,
    videoTheaterMode,
    playerRef,
    autoplaySetting,
    replay,
  });

  // Initialize video.js
  function initializeVideoPlayer(el) {
    if (!el) return;

    const vjs = videojs(el, videoJsOptions, () => {
      const player = playerRef.current;

      // this seems like a weird thing to have to check for here
      if (!player) return;

      initializeEvents();

      // Replace volume bar with custom LBRY volume bar
      LbryVolumeBarClass.replaceExisting(player);

      // Add reloadSourceOnError plugin
      player.reloadSourceOnError({ errorInterval: 10 });

      // initialize mobile UI
      player.mobileUi(); // Inits mobile version. No-op if Desktop.

      // Add quality selector to player
      player.hlsQualitySelector({
        displayCurrentQuality: true,
      });

      // Add recsys plugin
      if (shareTelemetry) {
        player.recsys({
          videoId: claimId,
          userId: userId,
        });
      }

      // set playsinline for mobile
      player.children_[0].setAttribute('playsinline', '');

      // I think this is a callback function
      const videoNode = containerRef.current && containerRef.current.querySelector('video, audio');
      onPlayerReady(player, videoNode);
    });

    // fixes #3498 (https://github.com/lbryio/lbry-desktop/issues/3498)
    // summary: on firefox the focus would stick to the fullscreen button which caused buggy behavior with spacebar
    vjs.on('fullscreenchange', () => document.activeElement && document.activeElement.blur());

    return vjs;
  }

  /** instantiate videoJS and dispose of it when done with code **/
  // This lifecycle hook is only called once (on mount), or when `isAudio` or `source` changes.
  useEffect(() => {
    const vjsElement = createVideoPlayerDOM(containerRef.current);

    // Detect source file type via pre-fetch (async)
    detectFileType().then(() => {
      // Initialize Video.js
      const vjsPlayer = initializeVideoPlayer(vjsElement);

      // Add reference to player to global scope
      window.player = vjsPlayer;

      // Set reference in component state
      playerRef.current = vjsPlayer;

      window.addEventListener('keydown', curried_function(playerRef, containerRef));
    });

    // Cleanup
    return () => {
      window.removeEventListener('keydown', curried_function);

      const player = playerRef.current;
      if (player) {
        player.dispose();
        window.player = undefined;
      }
    };
  }, [isAudio, source]);

  // Update video player and reload when source URL changes
  useEffect(() => {
    // For some reason the video player is responsible for detecting content type this way
    fetch(source, { method: 'HEAD', cache: 'no-store' }).then((response) => {
      let finalType = sourceType;
      let finalSource = source;

      // override type if we receive an .m3u8 (transcoded mp4)
      // do we need to check if explicitly redirected
      // or is checking extension only a safer method
      if (response && response.redirected && response.url && response.url.endsWith('m3u8')) {
        finalType = 'application/x-mpegURL';
        finalSource = response.url;
      }

      // Modify video source in options
      videoJsOptions.sources = [
        {
          src: finalSource,
          type: finalType,
        },
      ];

      // Update player source
      const player = playerRef.current;
      if (!player) return;

      // PR #5570: Temp workaround to avoid double Play button until the next re-architecture.
      if (!player.paused()) {
        player.bigPlayButton.hide();
      }
    });
  }, [source, reload]);

  return (
    // $FlowFixMe
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
