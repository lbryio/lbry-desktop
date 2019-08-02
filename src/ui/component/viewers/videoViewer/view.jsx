// @flow
import React, { createRef, useEffect } from 'react';
import { stopContextMenu } from 'util/context-menu';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import isUserTyping from 'util/detect-typing';

const SPACE_BAR_KEYCODE = 32;
const VIDEO_JS_OPTIONS = {
  autoplay: true,
  controls: true,
  preload: 'auto',
  playbackRates: [0.5, 1, 1.25, 1.5, 2],
  fluid: true,
};

type Props = {
  source: string,
  contentType: string,
};

function VideoViewer(props: Props) {
  const { contentType, source } = props;
  const videoRef = createRef();

  // Handle any other effects separately to avoid re-mounting the video player when props change
  useEffect(() => {
    if (videoRef && source && contentType) {
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

      const player = videojs(videoNode, videoJsOptions);
      return () => player.dispose();
    }
  }, [videoRef, source, contentType]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const videoNode = videoRef && videoRef.current;
      if (!videoNode) return;

      // This should be done in a reusable way
      // maybe a custom useKeyboardListener hook?
      if (!isUserTyping() && e.keyCode === SPACE_BAR_KEYCODE) {
        e.preventDefault();

        const isPaused = videoNode.paused;
        if (isPaused) {
          videoNode.play();
          return;
        }

        videoNode.pause();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [videoRef]);

  return (
    <div className="file-render__viewer" onContextMenu={stopContextMenu}>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js" />
      </div>
    </div>
  );
}

export default VideoViewer;
