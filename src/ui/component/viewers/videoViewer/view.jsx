// @flow
import React, { useRef, useEffect, useState } from 'react';
import { stopContextMenu } from 'util/context-menu';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import isUserTyping from 'util/detect-typing';

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

const VIDEO_JS_OPTIONS = {
  autoplay: true,
  controls: true,
  preload: 'auto',
  playbackRates: [0.25, 0.5, 0.75, 1, 1.1, 1.25, 1.5, 2],
};

type Props = {
  volume: number,
  position: number,
  muted: boolean,
  hasFileInfo: boolean,
  changeVolume: number => void,
  savePosition: (string, number) => void,
  changeMute: boolean => void,
  setPlayingUri: (string | null) => void,
  source: string,
  contentType: string,
  hasFileInfo: boolean,
  onEndedCB: any,
};

function VideoViewer(props: Props) {
  const { contentType, source, setPlayingUri, onEndedCB, changeVolume, changeMute, volume, muted } = props;
  const videoRef = useRef();
  const [requireRedraw, setRequireRedraw] = useState(false);

  useEffect(() => {
    const currentVideo: HTMLVideoElement | null = document.querySelector('video');

    function doEnded() {
      // clear position
      setPlayingUri(null);
      onEndedCB();
    }
    function doPause(e: Event) {
      // store position e.target.currentTime
    }
    function doVolume(e: Event) {
      // $FlowFixMe volume is missing in EventTarget
      changeVolume(e.target.volume);
      // $FlowFixMe muted is missing in EventTarget
      changeMute(e.target.muted);
    }

    if (currentVideo) {
      currentVideo.addEventListener('ended', doEnded);
      currentVideo.addEventListener('pause', doPause);
      currentVideo.addEventListener('volumechange', doVolume);
    }
    // cleanup function:
    return () => {
      if (currentVideo) {
        currentVideo.removeEventListener('ended', doEnded);
        currentVideo.removeEventListener('pause', doPause);
        currentVideo.removeEventListener('volumechange', doVolume);
      }
    };
  }, []);

  useEffect(() => {
    const videoNode = videoRef.current;
    const videoJsOptions = {
      ...VIDEO_JS_OPTIONS,
      sources: [
        {
          src: source,
          type: contentType,
        },
      ],
    };

    let player;
    if (!requireRedraw) {
      player = videojs(videoNode, videoJsOptions, function() {
        const player = this;
        player.volume(volume);
        player.muted(muted);
      });
    }

    return () => {
      if (!player) {
        return;
      }

      // Video.js has a player.dispose() function that is meant to cleanup a previous video
      // We can't use this because it does some weird stuff to remove the video element from the page
      // This makes it really hard to use because the ref we keep still thinks it's on the page
      // requireRedraw just makes it so the video component is removed from the page _by react_
      // Then it's set to false immediately after so we can re-mount a new player
      setRequireRedraw(true);
    };
  }, [videoRef, source, contentType, setRequireRedraw, requireRedraw]);

  useEffect(() => {
    if (requireRedraw) {
      setRequireRedraw(false);
    }
  }, [requireRedraw]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const videoNode = videoRef.current;

      if (!videoNode || isUserTyping()) {
        return;
      }

      // If not needed to prevent the default,
      // add keycode handler above preventDefault & return after that
      e.preventDefault();

      if (e.keyCode === SPACE_BAR_KEYCODE) {
        videoNode.paused ? videoNode.play() : videoNode.pause();
      }

      // Fullscreen Shortcut
      if (e.keyCode === FULLSCREEN_KEYCODE) {
        videoNode.webkitEnterFullscreen && videoNode.webkitEnterFullscreen();
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

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };

    // include requireRedraw here so the event listener is re-added when we need to manually remove/add the video player
  }, [videoRef, requireRedraw]);

  return (
    <div className="file-render__viewer" onContextMenu={stopContextMenu}>
      {!requireRedraw && (
        <div data-vjs-player>
          <video ref={videoRef} className="video-js" />
        </div>
      )}
    </div>
  );
}

export default VideoViewer;
