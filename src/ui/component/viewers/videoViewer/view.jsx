// @flow
import React, { useRef, useEffect, useState } from 'react';
import { stopContextMenu } from 'util/context-menu';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import isUserTyping from 'util/detect-typing';

const SPACE_BAR_KEYCODE = 32;
const VIDEO_JS_OPTIONS = {
  autoplay: true,
  controls: true,
  preload: 'auto',
  playbackRates: [0.25, 0.5, 0.75, 1, 1.1, 1.25, 1.5, 2],
};

type Props = {
  source: string,
  contentType: string,
  hasFileInfo: boolean,
};

function VideoViewer(props: Props) {
  const { contentType, source } = props;
  const videoRef = useRef();
  const [requireRedraw, setRequireRedraw] = useState(false);

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
      player = videojs(videoNode, videoJsOptions);
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

      if (videoNode && !isUserTyping() && e.keyCode === SPACE_BAR_KEYCODE) {
        e.preventDefault();

        videoNode.paused ? videoNode.play() : videoNode.pause();
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
