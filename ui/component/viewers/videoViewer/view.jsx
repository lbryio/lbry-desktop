// @flow
import React, { useRef, useEffect, useState, useContext } from 'react';
import { stopContextMenu } from 'util/context-menu';
import videojs from 'video.js/dist/alt/video.core.novtt.min.js';
import 'video.js/dist/alt/video-js-cdn.min.css';
import eventTracking from 'videojs-event-tracking';
import isUserTyping from 'util/detect-typing';
import analytics from 'analytics';
import { EmbedContext } from 'page/embedWrapper/view';
import { FORCE_CONTENT_TYPE_PLAYER } from 'constants/claim';

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
type VideoJSOptions = {
  controls: boolean,
  autoplay: boolean,
  preload: string,
  playbackRates: Array<number>,
  responsive: boolean,
  poster?: string,
  muted?: boolean,
  poseter?: string,
};
const VIDEO_JS_OPTIONS: VideoJSOptions = {
  controls: true,
  autoplay: true,
  preload: 'auto',
  playbackRates: [0.25, 0.5, 0.75, 1, 1.1, 1.25, 1.5, 1.75, 2],
  responsive: true,
};

type Props = {
  volume: number,
  position: number,
  muted: boolean,
  hasFileInfo: boolean,
  changeVolume: number => void,
  savePosition: (string, number) => void,
  changeMute: boolean => void,
  source: string,
  contentType: string,
  thumbnail: string,
  hasFileInfo: boolean,
  onEndedCB: any,
  claim: Claim,
  autoplayParam: ?boolean,
};

function VideoViewer(props: Props) {
  const {
    contentType,
    source,
    onEndedCB,
    changeVolume,
    changeMute,
    volume,
    muted,
    thumbnail,
    position,
    claim,
    autoplayParam,
  } = props;
  const claimId = claim && claim.claim_id;
  const videoRef = useRef();
  const isAudio = contentType.includes('audio');
  const embedded = useContext(EmbedContext);

  if (embedded && !autoplayParam) {
    VIDEO_JS_OPTIONS.autoplay = false;
  }

  if (autoplayParam) {
    VIDEO_JS_OPTIONS.muted = true;
  }

  const forcePlayer = FORCE_CONTENT_TYPE_PLAYER.includes(contentType);
  const [requireRedraw, setRequireRedraw] = useState(false);
  let player;

  useEffect(() => {
    const currentVideo: HTMLVideoElement | null = document.querySelector('video');

    if (!Object.keys(videojs.getPlugins()).includes('eventTracking')) {
      videojs.registerPlugin('eventTracking', eventTracking);
    }

    function doEnded() {
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
  }, [changeMute, changeVolume, onEndedCB]);

  useEffect(() => {
    const { current: videoNode } = videoRef;
    const videoJsOptions = {
      ...VIDEO_JS_OPTIONS,
      sources: [
        {
          src: source,
          type: forcePlayer ? 'video/mp4' : contentType,
        },
      ],
      plugins: { eventTracking: true },
    };

    // thumb looks bad in app, and if autoplay, flashing poster is annoying
    if (isAudio || (embedded && !autoplayParam)) {
      videoJsOptions.poster = thumbnail;
    }

    if (!requireRedraw) {
      player = videojs(videoNode, videoJsOptions, function() {
        if (!autoplayParam) player.volume(volume);
        player.muted(autoplayParam || muted);
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
      const { current: videoNode } = videoRef;

      if (!videoNode || isUserTyping()) {
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
  }, [videoRef, requireRedraw, player]);

  // player analytics
  useEffect(() => {
    function doTrackingBuffered(e: Event, data: any) {
      analytics.videoBufferEvent(claimId, data.currentTime);
    }
    function doTrackingFirstPlay(e: Event, data: any) {
      analytics.videoStartEvent(claimId, data.secondsToLoad);
    }
    if (player) {
      player.on('tracking:buffered', (e, d) => doTrackingBuffered(e, d));
      player.on('tracking:firstplay', (e, d) => doTrackingFirstPlay(e, d));

      // fixes #3498 (https://github.com/lbryio/lbry-desktop/issues/3498)
      // summary: on firefox the focus would stick to the fullscreen button which caused buggy behavior with spacebar
      // $FlowFixMe
      player.on('fullscreenchange', () => document.activeElement && document.activeElement.blur());
    }
    return () => {
      if (player) {
        player.off();
      }
    };
  }, [claimId, player]);

  useEffect(() => {
    if (player && position) {
      player.currentTime(position);
    }
  }, [player, position]);

  return (
    <div className="file-render__viewer" onContextMenu={stopContextMenu}>
      {!requireRedraw && (
        <div data-vjs-player>
          {isAudio ? <audio ref={videoRef} className="video-js" /> : <video ref={videoRef} className="video-js" />}
        </div>
      )}
    </div>
  );
}

export default VideoViewer;
