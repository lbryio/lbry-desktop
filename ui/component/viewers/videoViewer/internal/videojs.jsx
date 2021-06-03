// @flow
import React, { useEffect, useRef, useState } from 'react';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import classnames from 'classnames';
import videojs from 'video.js/dist/video.min.js';
import 'video.js/dist/alt/video-js-cdn.min.css';
import eventTracking from 'videojs-event-tracking';
import * as OVERLAY from './overlays';
import './plugins/videojs-mobile-ui/plugin';
import hlsQualitySelector from './plugins/videojs-hls-quality-selector/plugin';
import qualityLevels from 'videojs-contrib-quality-levels';
import isUserTyping from 'util/detect-typing';
import analytics from 'analytics';

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
  onPlayerReady: (Player) => void,
  isAudio: boolean,
  startMuted: boolean,
  autoplay: boolean,
  toggleVideoTheaterMode: () => void,
  adUrl: ?string,
};

// type VideoJSOptions = {
//   controls: boolean,
//   preload: string,
//   playbackRates: Array<number>,
//   responsive: boolean,
//   poster: ?string,
//   muted: ?boolean,
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
    nativeControlsForTouch: IS_IOS,
    hls: {
      overrideNative: !videojs.browser.IS_ANY_SAFARI,
    },
  },
};

const SPACE_BAR_KEYCODE = 32;
const SMALL_F_KEYCODE = 70;
const SMALL_M_KEYCODE = 77;
const SMALL_T_KEYCODE = 84;
const ARROW_LEFT_KEYCODE = 37;
const ARROW_UP_KEYCODE = 38;
const ARROW_RIGHT_KEYCODE = 39;
const ARROW_DOWN_KEYCODE = 40;
const COMMA_KEYCODE = 188;
const PERIOD_KEYCODE = 190;
const SMALL_J_KEYCODE = 74;
const SMALL_K_KEYCODE = 75;
const SMALL_L_KEYCODE = 76;

const FULLSCREEN_KEYCODE = SMALL_F_KEYCODE;
const MUTE_KEYCODE = SMALL_M_KEYCODE;
const THEATER_MODE_KEYCODE = SMALL_T_KEYCODE;

const VOLUME_UP_KEYCODE = ARROW_UP_KEYCODE;
const VOLUME_DOWN_KEYCODE = ARROW_DOWN_KEYCODE;

const SEEK_FORWARD_KEYCODE = SMALL_L_KEYCODE;
const SEEK_BACKWARD_KEYCODE = SMALL_J_KEYCODE;
const SEEK_FORWARD_KEYCODE_5 = ARROW_RIGHT_KEYCODE;
const SEEK_BACKWARD_KEYCODE_5 = ARROW_LEFT_KEYCODE;

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
    startMuted,
    source,
    sourceType,
    poster,
    isAudio,
    onPlayerReady,
    toggleVideoTheaterMode,
    adUrl,
  } = props;

  const [reload, setReload] = useState('initial');
  const playerRef = useRef();
  const containerRef = useRef();
  const videoJsOptions = {
    ...VIDEO_JS_OPTIONS,
    autoplay: autoplay,
    muted: startMuted,
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
    const player = playerRef.current;
    if (player) {
      const controlBar = player.getChild('controlBar');
      switch (e.type) {
        case 'play':
          controlBar.getChild('PlayToggle').controlText(__('Pause (space)'));
          break;
        case 'pause':
          controlBar.getChild('PlayToggle').controlText(__('Play (space)'));
          break;
        case 'volumechange':
          controlBar
            .getChild('VolumePanel')
            .getChild('MuteToggle')
            .controlText(player.muted() || player.volume() === 0 ? __('Unmute (m)') : __('Mute (m)'));
          break;
        case 'fullscreenchange':
          controlBar
            .getChild('FullscreenToggle')
            .controlText(player.isFullscreen() ? __('Exit Fullscreen (f)') : __('Fullscreen (f)'));
          break;
        case 'loadstart':
          // --- Do everything ---
          controlBar.getChild('PlaybackRateMenuButton').controlText(__('Playback Rate (<, >)'));
          controlBar.getChild('QualityButton').controlText(__('Quality'));
          resolveCtrlText({ type: 'play' });
          resolveCtrlText({ type: 'pause' });
          resolveCtrlText({ type: 'volumechange' });
          resolveCtrlText({ type: 'fullscreenchange' });
          // (1) The 'Theater mode' button should probably be changed to a class
          // so that we can use getChild() with a specific name. There might be
          // clashes if we add a new button in the future.
          // (2) We'll have to get 'makeSelectClientSetting(SETTINGS.VIDEO_THEATER_MODE)'
          // as a prop here so we can say "Theater mode|Default mode" instead of
          // "Toggle Theather mode".
          controlBar.getChild('Button').controlText(__('Toggle Theater mode (t)'));
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

    if (player && player.loadingSpinner) {
      player.loadingSpinner.hide();
    }
  }

  const onEnded = React.useCallback(() => {
    if (!adUrl) {
      showTapButton(TAP.NONE);
    }
  }, [adUrl]);

  function handleKeyDown(e: KeyboardEvent) {
    const player = playerRef.current;
    const videoNode = containerRef.current && containerRef.current.querySelector('video, audio');
    if (!videoNode || !player || isUserTyping()) return;
    handleSingleKeyActions(e);
    handleShiftKeyActions(e);
  }

  function handleShiftKeyActions(e: KeyboardEvent) {
    if (e.altKey || e.ctrlKey || e.metaKey || !e.shiftKey) return;
    if (e.keyCode === PERIOD_KEYCODE) changePlaybackSpeed(true);
    if (e.keyCode === COMMA_KEYCODE) changePlaybackSpeed(false);
  }

  function handleSingleKeyActions(e: KeyboardEvent) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.keyCode === SPACE_BAR_KEYCODE || e.keyCode === SMALL_K_KEYCODE) togglePlay();
    if (e.keyCode === FULLSCREEN_KEYCODE) toggleFullscreen();
    if (e.keyCode === MUTE_KEYCODE) toggleMute();
    if (e.keyCode === VOLUME_UP_KEYCODE) volumeUp();
    if (e.keyCode === VOLUME_DOWN_KEYCODE) volumeDown();
    if (e.keyCode === THEATER_MODE_KEYCODE) toggleTheaterMode();
    if (e.keyCode === SEEK_FORWARD_KEYCODE) seekVideo(SEEK_STEP);
    if (e.keyCode === SEEK_BACKWARD_KEYCODE) seekVideo(-SEEK_STEP);
    if (e.keyCode === SEEK_FORWARD_KEYCODE_5) seekVideo(SEEK_STEP_5);
    if (e.keyCode === SEEK_BACKWARD_KEYCODE_5) seekVideo(-SEEK_STEP_5);
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
    if (!container) {
      return;
    }

    // This seems like a poor way to generate the DOM for video.js
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-vjs-player', 'true');
    const el = document.createElement(isAudio ? 'audio' : 'video');
    el.className = 'video-js';
    wrapper.appendChild(el);

    container.appendChild(wrapper);

    return el;
  }

  // Initialize video.js
  function initializeVideoPlayer(el) {
    if (!el) {
      return;
    }

    const vjs = videojs(el, videoJsOptions, () => {
      const player = playerRef.current;

      // this seems like a weird thing to have to check for here
      if (!player) {
        return;
      }

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

      // initialize mobile UI
      player.mobileUi(); // Inits mobile version. No-op if Desktop.

      // I think this is a callback function
      onPlayerReady(player);
    });

    // fixes #3498 (https://github.com/lbryio/lbry-desktop/issues/3498)
    // summary: on firefox the focus would stick to the fullscreen button which caused buggy behavior with spacebar
    vjs.on('fullscreenchange', () => document.activeElement && document.activeElement.blur());

    return vjs;
  }

  // This lifecycle hook is only called once (on mount), or when `isAudio` changes.
  useEffect(() => {
    const vjsElement = createVideoPlayerDOM(containerRef.current);
    const vjsPlayer = initializeVideoPlayer(vjsElement);

    // Add reference to player to global scope
    window.player = vjsPlayer;

    // Set reference in component state
    playerRef.current = vjsPlayer;

    // Add event listener for keyboard shortcuts
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);

      const player = playerRef.current;
      if (player) {
        window.player = undefined;
        player.dispose();
      }
    };
  }, [isAudio]);

  // Update video player and reload when source URL changes
  useEffect(() => {
    const fetchStartedAt = performance.now();
    // For some reason the video player is responsible for detecting content type this way
    fetch(source, { method: 'HEAD', cache: 'no-store' }).then((response) => {
      const deltaFetch = performance.now() - fetchStartedAt;
      // console.log(`Prefetch took: ${deltaFetch.toFixed(3)}ms`);

      // Send fetch duration analytic event (in ms)
      analytics.videoFetchDuration(source, deltaFetch);

      const player = playerRef.current;

      if (!player) {
        return;
      }

      let type = sourceType;

      // override type if we receive an .m3u8 (transcoded mp4)
      if (response && response.redirected && response.url && response.url.endsWith('m3u8')) {
        type = 'application/x-mpegURL';
      }

      // Update player poster
      // note: the poster prop seems to return null usually.
      if (poster) player.poster(poster);

      // Update player source
      player.src({
        src: source,
        type: type,
      });

      // Add quality selector to player
      player.hlsQualitySelector({
        displayCurrentQuality: true,
      });

      // Update player source
      player.src({
        src: source,
        type: type,
      });

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
