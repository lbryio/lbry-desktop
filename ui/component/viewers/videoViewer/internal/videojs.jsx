// @flow
import React, { useEffect, useRef } from 'react';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import classnames from 'classnames';
import videojs from 'video.js/dist/alt/video.core.novtt.min.js';
import 'video.js/dist/alt/video-js-cdn.min.css';
import eventTracking from 'videojs-event-tracking';
import isUserTyping from 'util/detect-typing';

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
};

type Props = {
  source: string,
  sourceType: string,
  poster: ?string,
  onPlayerReady: Player => void,
  isAudio: boolean,
  startMuted: boolean,
};

type VideoJSOptions = {
  controls: boolean,
  preload: string,
  playbackRates: Array<number>,
  responsive: boolean,
  poster?: string,
  muted?: boolean,
};

const IS_IOS =
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window.MSStream;

const VIDEO_JS_OPTIONS: VideoJSOptions = {
  preload: 'auto',
  playbackRates: [0.25, 0.5, 0.75, 1, 1.1, 1.25, 1.5, 1.75, 2],
  responsive: true,
  controls: true,
  html5: { nativeControlsForTouch: IS_IOS },
};

const F11_KEYCODE = 122;
const SPACE_BAR_KEYCODE = 32;
const SMALL_F_KEYCODE = 70;
const SMALL_M_KEYCODE = 77;
const ARROW_LEFT_KEYCODE = 37;
const ARROW_RIGHT_KEYCODE = 39;

const FULLSCREEN_KEYCODE = SMALL_F_KEYCODE;
const MUTE_KEYCODE = SMALL_M_KEYCODE;

const SEEK_FORWARD_KEYCODE = ARROW_RIGHT_KEYCODE;
const SEEK_BACKWARD_KEYCODE = ARROW_LEFT_KEYCODE;

const SEEK_STEP = 10; // time to seek in seconds

if (!Object.keys(videojs.getPlugins()).includes('eventTracking')) {
  videojs.registerPlugin('eventTracking', eventTracking);
}

/*
properties for this component should be kept to ONLY those that if changed should REQUIRE an entirely new videojs element
 */
export default React.memo<Props>(function VideoJs(props: Props) {
  const { startMuted, source, sourceType, poster, isAudio, onPlayerReady } = props;
  let player: ?Player;
  const containerRef = useRef();
  const videoJsOptions = {
    ...VIDEO_JS_OPTIONS,
    sources: [
      {
        src: source,
        type: sourceType,
      },
    ],
    autoplay: false,
    poster: poster, // thumb looks bad in app, and if autoplay, flashing poster is annoying
    plugins: { eventTracking: true },
  };

  videoJsOptions.muted = startMuted;

  const tapToUnmuteRef = useRef();

  function showTapToUnmute(newState: boolean) {
    // Use the DOM to control the state of the button to prevent re-renders.
    // The button only needs to appear once per session.
    if (tapToUnmuteRef.current) {
      const curState = tapToUnmuteRef.current.style.visibility === 'visible';
      if (newState !== curState) {
        tapToUnmuteRef.current.style.visibility = newState ? 'visible' : 'hidden';
      }
    } else if (process.env.NODE_ENV === 'development') {
      throw new Error('[videojs.jsx] Empty video ref should not happen');
    }
  }

  function unmuteAndHideHint() {
    if (player) {
      player.muted(false);
      if (player.volume() === 0) {
        player.volume(1.0);
      }
    }
    showTapToUnmute(false);
  }

  function onInitialPlay() {
    if (player && (player.muted() || player.volume() === 0)) {
      // The css starts as "hidden". We make it visible here without
      // re-rendering the whole thing.
      showTapToUnmute(true);
    }
  }

  function onVolumeChange() {
    if (player && !player.muted()) {
      showTapToUnmute(false);
    }
  }

  function onError() {
    showTapToUnmute(false);
  }

  function onEnded() {
    showTapToUnmute(false);
  }

  function handleKeyDown(e: KeyboardEvent) {
    const videoNode: ?HTMLVideoElement = containerRef.current && containerRef.current.querySelector('video, audio');

    if (!videoNode || isUserTyping()) {
      return;
    }

    if (e.keyCode === SPACE_BAR_KEYCODE) {
      videoNode.paused ? videoNode.play() : videoNode.pause();
    }

    // Fullscreen toggle shortcuts
    if (player && (e.keyCode === FULLSCREEN_KEYCODE || e.keyCode === F11_KEYCODE)) {
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
    const duration = videoNode.duration;
    const currentTime = videoNode.currentTime;
    if (e.keyCode === SEEK_FORWARD_KEYCODE) {
      const newDuration = currentTime + SEEK_STEP;
      videoNode.currentTime = newDuration > duration ? duration : newDuration;
    }
    if (e.keyCode === SEEK_BACKWARD_KEYCODE) {
      const newDuration = currentTime - SEEK_STEP;
      videoNode.currentTime = newDuration < 0 ? 0 : newDuration;
    }
  }

  // Create the video element. Note that a new videojs instantiation will happen on *every* render, so do not add props to this component!
  useEffect(() => {
    if (containerRef.current) {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-vjs-player', 'true');
      const el = document.createElement(isAudio ? 'audio' : 'video');
      el.className = 'video-js';
      wrapper.appendChild(el);

      // $FlowFixMe
      containerRef.current.appendChild(wrapper);

      player = videojs(el, videoJsOptions, () => {
        if (player) {
          player.one('play', onInitialPlay);
          player.on('volumechange', onVolumeChange);
          player.on('error', onError);
          player.on('ended', onEnded);

          onPlayerReady(player);
        }
      });

      // fixes #3498 (https://github.com/lbryio/lbry-desktop/issues/3498)
      // summary: on firefox the focus would stick to the fullscreen button which caused buggy behavior with spacebar
      // $FlowFixMe
      player.on('fullscreenchange', () => document.activeElement && document.activeElement.blur());

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);

        if (player) {
          player.dispose();
        }
      };
    }
  });

  return (
    // $FlowFixMe
    <div className={classnames('video-js-parent', { 'video-js-parent--ios': IS_IOS })} ref={containerRef}>
      {
        <Button
          label={__('Tap to unmute')}
          button="link"
          icon={ICONS.VOLUME_MUTED}
          className="video-js--tap-to-unmute"
          onClick={unmuteAndHideHint}
          ref={tapToUnmuteRef}
        />
      }
    </div>
  );
});
