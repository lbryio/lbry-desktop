// @flow
import React, { useEffect, useRef, useState } from 'react';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import * as KEYCODES from 'constants/keycodes';
import classnames from 'classnames';
import videojs from 'video.js';
import 'video.js/dist/alt/video-js-cdn.min.css';
import eventTracking from 'videojs-event-tracking';
import * as OVERLAY from './overlays';
import './plugins/videojs-mobile-ui/plugin';
import hlsQualitySelector from './plugins/videojs-hls-quality-selector/plugin';
import recsys from './plugins/videojs-recsys/plugin';
import qualityLevels from 'videojs-contrib-quality-levels';
import isUserTyping from 'util/detect-typing';

const isDev = process.env.NODE_ENV !== 'production';

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

// type VideoJSOptions = {
//   controls: boolean,
//   preload: string,
//   playbackRates: Array<number>,
//   responsive: boolean,
//   poster?: string,
//   muted?: boolean,
// };

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

const SEEK_STEP_5 = 5;
const SEEK_STEP = 10; // time to seek in seconds

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
// LbryVolumeBarClass
// ****************************************************************************

const VIDEOJS_CONTROL_BAR_CLASS = 'ControlBar';
const VIDEOJS_VOLUME_PANEL_CLASS = 'VolumePanel';
const VIDEOJS_VOLUME_CONTROL_CLASS = 'VolumeControl';
const VIDEOJS_VOLUME_BAR_CLASS = 'VolumeBar';

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
    event.stopPropagation();
  }

  handleMouseMove(event) {
    super.handleMouseMove(event);
    event.stopPropagation();
  }
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

  const [reload, setReload] = useState('initial');
  const playerRef = useRef();
  const containerRef = useRef();
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

  const tapToUnmuteRef = useRef();
  const tapToRetryRef = useRef();

  const TAP = {
    NONE: 'NONE',
    UNMUTE: 'UNMUTE',
    RETRY: 'RETRY',
  };

  function showTapButton(tapButton) {
    const setButtonVisibility = (theRef, newState) => {
      // Use the DOM to control the state of the button to prevent re-renders.
      if (theRef.current) {
        const curState = theRef.current.style.visibility === 'visible';
        if (newState !== curState) {
          theRef.current.style.visibility = newState ? 'visible' : 'hidden';
        }
      }
    };

    switch (tapButton) {
      case TAP.NONE:
        setButtonVisibility(tapToUnmuteRef, false);
        setButtonVisibility(tapToRetryRef, false);
        break;
      case TAP.UNMUTE:
        setButtonVisibility(tapToUnmuteRef, true);
        setButtonVisibility(tapToRetryRef, false);
        break;
      case TAP.RETRY:
        setButtonVisibility(tapToUnmuteRef, false);
        setButtonVisibility(tapToRetryRef, true);
        break;
      default:
        if (isDev) throw new Error('showTapButton: unexpected ref');
        break;
    }
  }

  function unmuteAndHideHint() {
    const player = playerRef.current;
    if (player) {
      player.muted(false);
      if (player.volume() === 0) {
        player.volume(1.0);
      }
    }
    showTapButton(TAP.NONE);
  }

  function retryVideoAfterFailure() {
    const player = playerRef.current;
    if (player) {
      setReload(Date.now());
      showTapButton(TAP.NONE);
    }
  }

  function resolveCtrlText(e) {
    // Override the player's control text. We override to:
    // 1. Add keyboard shortcut to the tool-tip.
    // 2. Override videojs' i18n and use our own (don't want to have 2 systems).
    //
    // Notes:
    // - For dynamic controls (e.g. play/pause), those unfortunately need to be
    // updated again at their event-listener level (that's just the way videojs
    // updates the text), hence the need to listen to 'play', 'pause' and 'volumechange'
    // on top of just 'loadstart'.
    // - videojs changes the MuteToggle text at 'loadstart', so this was chosen
    // as the listener to update static texts.

    const setLabel = (controlBar, childName, label) => {
      const c = controlBar.getChild(childName);
      if (c) {
        c.controlText(label);
      }
    };

    const player = playerRef.current;
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
          ctrlBar
            .getChild('VolumePanel')
            .getChild('MuteToggle')
            .controlText(player.muted() || player.volume() === 0 ? __('Unmute (m)') : __('Mute (m)'));
          break;
        case 'fullscreenchange':
          setLabel(
            ctrlBar,
            'FullscreenToggle',
            player.isFullscreen() ? __('Exit Fullscreen (f)') : __('Fullscreen (f)')
          );
          break;
        case 'loadstart':
          // --- Do everything ---
          setLabel(ctrlBar, 'PlaybackRateMenuButton', __('Playback Rate (<, >)'));
          setLabel(ctrlBar, 'QualityButton', __('Quality'));
          setLabel(ctrlBar, 'PlayNextButton', __('Play Next (SHIFT+N)'));
          setLabel(ctrlBar, 'PlayPreviousButton', __('Play Previous (SHIFT+P)'));
          setLabel(ctrlBar, 'TheaterModeButton', videoTheaterMode ? __('Default Mode (t)') : __('Theater Mode (t)'));
          setLabel(ctrlBar, 'AutoplayNextButton', autoplaySetting ? __('Autoplay Next On') : __('Autoplay Next Off'));

          resolveCtrlText({ type: 'play' });
          resolveCtrlText({ type: 'pause' });
          resolveCtrlText({ type: 'volumechange' });
          resolveCtrlText({ type: 'fullscreenchange' });
          break;
        default:
          if (isDev) throw Error('Unexpected: ' + e.type);
          break;
      }
    }
  }

  function onInitialPlay() {
    const player = playerRef.current;
    if (player && (player.muted() || player.volume() === 0)) {
      // The css starts as "hidden". We make it visible here without
      // re-rendering the whole thing.
      showTapButton(TAP.UNMUTE);
    } else {
      showTapButton(TAP.NONE);
    }
  }

  function onVolumeChange() {
    const player = playerRef.current;
    if (player && !player.muted()) {
      showTapButton(TAP.NONE);
    }
  }

  function onError() {
    const player = playerRef.current;
    showTapButton(TAP.RETRY);

    // reattach initial play listener in case we recover from error successfully
    // $FlowFixMe
    player.one('play', onInitialPlay);

    if (player && player.loadingSpinner) {
      player.loadingSpinner.hide();
    }
  }

  const onEnded = React.useCallback(() => {
    // not sure if this is necessary - used to be dependent on !adUrl
    showTapButton(TAP.NONE);
  }, []);

  function handleKeyDown(e: KeyboardEvent) {
    const player = playerRef.current;
    const videoNode = containerRef.current && containerRef.current.querySelector('video, audio');
    if (!videoNode || !player || isUserTyping()) return;
    handleSingleKeyActions(e);
    handleShiftKeyActions(e);
  }

  function handleShiftKeyActions(e: KeyboardEvent) {
    if (e.altKey || e.ctrlKey || e.metaKey || !e.shiftKey) return;
    if (e.keyCode === KEYCODES.PERIOD) changePlaybackSpeed(true);
    if (e.keyCode === KEYCODES.COMMA) changePlaybackSpeed(false);
    if (e.keyCode === KEYCODES.N) playNext();
    if (e.keyCode === KEYCODES.P) playPrevious();
  }

  function handleSingleKeyActions(e: KeyboardEvent) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.keyCode === KEYCODES.SPACEBAR || e.keyCode === KEYCODES.K) togglePlay();
    if (e.keyCode === KEYCODES.F) toggleFullscreen();
    if (e.keyCode === KEYCODES.M) toggleMute();
    if (e.keyCode === KEYCODES.UP) volumeUp();
    if (e.keyCode === KEYCODES.DOWN) volumeDown();
    if (e.keyCode === KEYCODES.T) toggleTheaterMode();
    if (e.keyCode === KEYCODES.L) seekVideo(SEEK_STEP);
    if (e.keyCode === KEYCODES.J) seekVideo(-SEEK_STEP);
    if (e.keyCode === KEYCODES.RIGHT) seekVideo(SEEK_STEP_5);
    if (e.keyCode === KEYCODES.LEFT) seekVideo(-SEEK_STEP_5);
  }

  function seekVideo(stepSize: number) {
    const player = playerRef.current;
    const videoNode = containerRef.current && containerRef.current.querySelector('video, audio');
    if (!videoNode || !player) return;
    const duration = videoNode.duration;
    const currentTime = videoNode.currentTime;
    const newDuration = currentTime + stepSize;
    if (newDuration < 0) {
      videoNode.currentTime = 0;
    } else if (newDuration > duration) {
      videoNode.currentTime = duration;
    } else {
      videoNode.currentTime = newDuration;
    }
    OVERLAY.showSeekedOverlay(player, Math.abs(stepSize), stepSize > 0);
    player.userActive(true);
  }

  function changePlaybackSpeed(shouldSpeedUp: boolean) {
    const player = playerRef.current;
    if (!player) return;
    const isSpeedUp = shouldSpeedUp;
    const rate = player.playbackRate();
    let rateIndex = videoPlaybackRates.findIndex((x) => x === rate);
    if (rateIndex >= 0) {
      rateIndex = isSpeedUp ? Math.min(rateIndex + 1, videoPlaybackRates.length - 1) : Math.max(rateIndex - 1, 0);
      const nextRate = videoPlaybackRates[rateIndex];

      OVERLAY.showPlaybackRateOverlay(player, nextRate, isSpeedUp);
      player.userActive(true);
      player.playbackRate(nextRate);
    }
  }

  function toggleFullscreen() {
    const player = playerRef.current;
    if (!player) return;
    if (!player.isFullscreen()) {
      player.requestFullscreen();
    } else {
      player.exitFullscreen();
    }
  }

  function toggleTheaterMode() {
    const player = playerRef.current;
    if (!player) return;
    toggleVideoTheaterMode();
    if (player.isFullscreen()) {
      player.exitFullscreen();
    }
  }

  function toggleMute() {
    const videoNode = containerRef.current && containerRef.current.querySelector('video, audio');
    if (!videoNode) return;
    videoNode.muted = !videoNode.muted;
  }

  function togglePlay() {
    const videoNode = containerRef.current && containerRef.current.querySelector('video, audio');
    if (!videoNode) return;
    videoNode.paused ? videoNode.play() : videoNode.pause();
  }

  function volumeUp() {
    const player = playerRef.current;
    if (!player) return;
    player.volume(player.volume() + 0.05);
    OVERLAY.showVolumeverlay(player, Math.round(player.volume() * 100));
    player.userActive(true);
  }

  function volumeDown() {
    const player = playerRef.current;
    if (!player) return;
    player.volume(player.volume() - 0.05);
    OVERLAY.showVolumeverlay(player, Math.round(player.volume() * 100));
    player.userActive(true);
  }

  // Create the video DOM element and wrapper
  function createVideoPlayerDOM(container) {
    if (!container) return;

    // This seems like a poor way to generate the DOM for video.js
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-vjs-player', 'true');
    const el = document.createElement(isAudio ? 'audio' : 'video');
    el.className = 'video-js vjs-big-play-centered ';
    wrapper.appendChild(el);

    container.appendChild(wrapper);

    return el;
  }

  function detectFileType() {
    return new Promise(async (res, rej) => {
      try {
        const response = await fetch(source, { method: 'HEAD', cache: 'no-store' });

        // Temp variables to hold results
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

        return res(videoJsOptions);
      } catch (error) {
        return rej(error);
      }
    });
  }

  // Initialize video.js
  function initializeVideoPlayer(el) {
    if (!el) return;

    const vjs = videojs(el, videoJsOptions, () => {
      const player = playerRef.current;

      // this seems like a weird thing to have to check for here
      if (!player) return;

      // Add various event listeners to player
      player.one('play', onInitialPlay);
      player.on('play', resolveCtrlText);
      player.on('pause', resolveCtrlText);
      player.on('loadstart', resolveCtrlText);
      player.on('fullscreenchange', resolveCtrlText);
      player.on('volumechange', resolveCtrlText);
      player.on('volumechange', onVolumeChange);
      player.on('error', onError);
      player.on('ended', onEnded);

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
      // TODO: make this better
      player.children_[0].setAttribute('playsinline', '');

      // I think this is a callback function
      const videoNode = containerRef.current && containerRef.current.querySelector('video, audio');
      onPlayerReady(player, videoNode);
    });

    vjs.on('fullscreenchange', () => document.activeElement && document.activeElement.blur());

    return vjs;
  }

  useEffect(() => {
    const player = playerRef.current;
    if (replay && player) {
      player.play();
    }
  }, [replay]);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      const controlBar = player.getChild('controlBar');
      controlBar
        .getChild('TheaterModeButton')
        .controlText(videoTheaterMode ? __('Default Mode (t)') : __('Theater Mode (t)'));
    }
  }, [videoTheaterMode]);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      const touchOverlay = player.getChild('TouchOverlay');
      const controlBar = player.getChild('controlBar') || touchOverlay.getChild('controlBar');
      const autoplayButton = controlBar.getChild('AutoplayNextButton');

      if (autoplayButton) {
        const title = autoplaySetting ? __('Autoplay Next On') : __('Autoplay Next Off');

        autoplayButton.controlText(title);
        autoplayButton.setAttribute('aria-label', title);
        autoplayButton.setAttribute('aria-checked', autoplaySetting);
      }
    }
  }, [autoplaySetting]);

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

      // Add event listener for keyboard shortcuts
      window.addEventListener('keydown', handleKeyDown);
    });

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);

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
