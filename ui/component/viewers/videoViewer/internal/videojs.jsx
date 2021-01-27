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
import qualitySelector from 'videojs-hls-quality-selector';
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
  getChild: string => any,
  playbackRate: (?number) => number,
  userActive: (?boolean) => boolean,
  overlay: any => void,
  mobileUi: any => void,
  controlBar: {
    addChild: (string, any) => void,
  },
};

type Props = {
  source: string,
  sourceType: string,
  poster: ?string,
  onPlayerReady: Player => void,
  isAudio: boolean,
  startMuted: boolean,
  autoplay: boolean,
  toggleVideoTheaterMode: () => void,
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

const F11_KEYCODE = 122;
const SPACE_BAR_KEYCODE = 32;
const SMALL_F_KEYCODE = 70;
const SMALL_M_KEYCODE = 77;
const SMALL_T_KEYCODE = 84;
const ARROW_LEFT_KEYCODE = 37;
const ARROW_RIGHT_KEYCODE = 39;
const COMMA_KEYCODE = 188;
const PERIOD_KEYCODE = 190;

const FULLSCREEN_KEYCODE = SMALL_F_KEYCODE;
const MUTE_KEYCODE = SMALL_M_KEYCODE;
const THEATER_MODE_KEYCODE = SMALL_T_KEYCODE;

const SEEK_FORWARD_KEYCODE = ARROW_RIGHT_KEYCODE;
const SEEK_BACKWARD_KEYCODE = ARROW_LEFT_KEYCODE;

const SEEK_STEP = 10; // time to seek in seconds

if (!Object.keys(videojs.getPlugins()).includes('eventTracking')) {
  videojs.registerPlugin('eventTracking', eventTracking);
}

if (!Object.keys(videojs.getPlugins()).includes('hlsQualitySelector')) {
  videojs.registerPlugin('hlsQualitySelector', qualitySelector);
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
  const { autoplay, startMuted, source, sourceType, poster, isAudio, onPlayerReady, toggleVideoTheaterMode } = props;
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

  function onEnded() {
    showTapButton(TAP.NONE);
  }

  function handleKeyDown(e: KeyboardEvent) {
    const player = playerRef.current;
    const videoNode: ?HTMLVideoElement = containerRef.current && containerRef.current.querySelector('video, audio');

    if (!videoNode || !player || isUserTyping()) {
      return;
    }

    if (e.keyCode === SPACE_BAR_KEYCODE) {
      videoNode.paused ? videoNode.play() : videoNode.pause();
    }

    // Fullscreen toggle shortcuts
    if (e.keyCode === FULLSCREEN_KEYCODE || e.keyCode === F11_KEYCODE) {
      if (!player.isFullscreen()) {
        player.requestFullscreen();
      } else {
        player.exitFullscreen();
      }
    }

    // Mute/Unmute Shortcuts
    if (e.keyCode === MUTE_KEYCODE) {
      videoNode.muted = !videoNode.muted;
    }

    // Seeking Shortcuts
    if (!e.altKey) {
      const duration = videoNode.duration;
      const currentTime = videoNode.currentTime;
      if (e.keyCode === SEEK_FORWARD_KEYCODE) {
        const newDuration = currentTime + SEEK_STEP;
        videoNode.currentTime = newDuration > duration ? duration : newDuration;
        OVERLAY.showSeekedOverlay(player, SEEK_STEP, true);
        player.userActive(true);
      } else if (e.keyCode === SEEK_BACKWARD_KEYCODE) {
        const newDuration = currentTime - SEEK_STEP;
        videoNode.currentTime = newDuration < 0 ? 0 : newDuration;
        OVERLAY.showSeekedOverlay(player, SEEK_STEP, false);
        player.userActive(true);
      }
    }

    // Playback-Rate Shortcuts ('>' = speed up, '<' = speed down)
    if (e.shiftKey && (e.keyCode === PERIOD_KEYCODE || e.keyCode === COMMA_KEYCODE)) {
      const isSpeedUp = e.keyCode === PERIOD_KEYCODE;
      const rate = player.playbackRate();
      let rateIndex = videoPlaybackRates.findIndex(x => x === rate);
      if (rateIndex >= 0) {
        rateIndex = isSpeedUp ? Math.min(rateIndex + 1, videoPlaybackRates.length - 1) : Math.max(rateIndex - 1, 0);
        const nextRate = videoPlaybackRates[rateIndex];

        OVERLAY.showPlaybackRateOverlay(player, nextRate, isSpeedUp);
        player.userActive(true);
        player.playbackRate(nextRate);
      }
    }

    // Theater Mode shortcut
    if (e.keyCode === THEATER_MODE_KEYCODE) {
      toggleVideoTheaterMode();
    }
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
      player.on('volumechange', onVolumeChange);
      player.on('error', onError);
      player.on('ended', onEnded);

      // Replace volume bar with custom LBRY volume bar
      LbryVolumeBarClass.replaceExisting(player);

      // initialize mobile UI
      player.mobileUi(); // Inits mobile version. No-op if Desktop.

      // Add quality selector to player
      player.hlsQualitySelector({
        displayCurrentQuality: true,
      });

      // I think this is a callback function
      onPlayerReady(player);
    });

    // fixes #3498 (https://github.com/lbryio/lbry-desktop/issues/3498)
    // summary: on firefox the focus would stick to the fullscreen button which caused buggy behavior with spacebar
    vjs.on('fullscreenchange', () => document.activeElement && document.activeElement.blur());

    return vjs;
  }

  // This lifecycle hook is only called once (on mount)
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
  }, []);

  // Update video player and reload when source URL changes
  useEffect(() => {
    // For some reason the video player is responsible for detecting content type this way
    fetch(source, { method: 'HEAD', cache: 'no-store' }).then(response => {
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
