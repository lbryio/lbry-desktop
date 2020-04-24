// @flow
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js/dist/alt/video.core.novtt.min.js';
import 'video.js/dist/alt/video-js-cdn.min.css';
import eventTracking from 'videojs-event-tracking';
import isUserTyping from 'util/detect-typing';

type Props = {
  source: string,
  sourceType: string,
  poster: boolean,
  autoplay: boolean,
  onPlayerReady: () => null,
  onVolumeChange: () => null,
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
  poster?: string,
};

const VIDEO_JS_OPTIONS: VideoJSOptions = {
  controls: true,
  preload: 'auto',
  playbackRates: [0.25, 0.5, 0.75, 1, 1.1, 1.25, 1.5, 1.75, 2],
  responsive: true,
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
export default React.memo(function VideoJs(props: Props) {
  const { startMuted, source, sourceType, poster, isAudio, onPlayerReady } = props;
  const containerRef = useRef();
  const videoJsOptions = {
    ...VIDEO_JS_OPTIONS,
    sources: [
      {
        src: source,
        type: sourceType,
      },
    ],
    poster: poster, // thumb looks bad in app, and if autoplay, flashing poster is annoying
    plugins: { eventTracking: true },
  };

  videoJsOptions.muted = startMuted;

  function handleKeyDown(e: KeyboardEvent) {
    const videoNode = containerRef.current && containerRef.current.querySelector('video, audio');

    if (!videoNode || isUserTyping()) {
      return;
    }

    if (e.keyCode === SPACE_BAR_KEYCODE) {
      videoNode.paused ? videoNode.play() : videoNode.pause();
    }

    // Fullscreen toggle shortcuts
    if (e.keyCode === FULLSCREEN_KEYCODE || e.keyCode === F11_KEYCODE) {
      if (player && !player.isFullscreen()) {
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

  let player;

  // Create the video element. Note that a new videojs instantiation will happen on *every* render, so do not add props to this component!
  useEffect(() => {
    if (containerRef.current) {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-vjs-player', true);
      const el = document.createElement(isAudio ? 'audio' : 'video');
      el.className = 'video-js';
      wrapper.appendChild(el);
      containerRef.current.appendChild(wrapper);

      player = videojs(el, videoJsOptions, () => {
        onPlayerReady(player);
      });

      // fixes #3498 (https://github.com/lbryio/lbry-desktop/issues/3498)
      // summary: on firefox the focus would stick to the fullscreen button which caused buggy behavior with spacebar
      // $FlowFixMe
      player.on('fullscreenchange', () => document.activeElement && document.activeElement.blur());

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        player.dispose();
      };
    }
  });

  return <div className="video-js-parent" ref={containerRef} />;
});
