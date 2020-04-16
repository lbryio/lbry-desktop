import React, { useContext, useEffect, useRef } from 'react';
import videojs from 'video.js/dist/alt/video.core.novtt.min.js';
import 'video.js/dist/alt/video-js-cdn.min.css';
import eventTracking from 'videojs-event-tracking';
import { EmbedContext } from '../../../../page/embedWrapper/view';
import isUserTyping from '../../../../util/detect-typing';

type Props = {
  source: string,
  sourceType: string,
  poster: boolean,
  autoplay: boolean,
  onPlayerReady: () => null,
  isAudio: boolean,
};

const VIDEO_JS_OPTIONS: VideoJSOptions = {
  controls: true,
  autoplay: true,
  preload: 'auto',
  playbackRates: [0.25, 0.5, 0.75, 1, 1.1, 1.25, 1.5, 1.75, 2],
  responsive: true,
};

type VideoJSOptions = {
  controls: boolean,
  autoplay: boolean,
  preload: string,
  playbackRates: Array<number>,
  responsive: boolean,
  poster?: string,
  muted?: boolean,
  poster?: string,
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
  const { autoplay, source, sourceType, poster, isAudio, onPlayerReady } = props;
  const videoRef = useRef();
  const embedded = useContext(EmbedContext);
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

  videoJsOptions.autoplay = autoplay;
  videoJsOptions.muted = autoplay && embedded;

  function handleKeyDown(e: KeyboardEvent) {
    const { current: videoNode } = videoRef;

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
  useEffect(() => {
    if (videoRef.current) {
      console.log('videojs effect to instatiate player');
      const { current: videoNode } = videoRef;

      player = videojs(videoNode, videoJsOptions);
      onPlayerReady(player);

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        console.log('videojs effect cleanup to dispose player');
        window.removeEventListener('keydown', handleKeyDown);
        player.dispose();
      };
    }
  });

  return (
    <div data-vjs-player>
      {isAudio ? <audio ref={videoRef} className="video-js" /> : <video ref={videoRef} className="video-js" />}
    </div>
  );
});
