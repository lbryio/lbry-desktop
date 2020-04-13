// @flow
import React, { useRef, useEffect, useState, useContext } from 'react';
import { stopContextMenu } from 'util/context-menu';
import videojs from 'video.js/dist/alt/video.core.novtt.min.js';
import 'video.js/dist/alt/video-js-cdn.min.css';
import eventTracking from 'videojs-event-tracking';
import isUserTyping from 'util/detect-typing';
import analytics from 'analytics';
import { EmbedContext } from 'page/embedWrapper/view';
import classnames from 'classnames';
import { FORCE_CONTENT_TYPE_PLAYER } from 'constants/claim';
import AutoplayCountdown from 'component/autoplayCountdown';
import usePrevious from 'effects/use-previous';
import FileViewerEmbeddedEnded from 'lbrytv/component/fileViewerEmbeddedEnded';
import FileViewerEmbeddedTitle from 'lbrytv/component/fileViewerEmbeddedTitle';

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

if (!Object.keys(videojs.getPlugins()).includes('eventTracking')) {
  videojs.registerPlugin('eventTracking', eventTracking);
}

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
  claim: Claim,
  uri: string,
  autoplaySetting: boolean,
  autoplayIfEmbedded: boolean,
  doAnalyticsView: (string, number) => Promise<any>,
  claimRewards: () => void,
};

function VideoViewer(props: Props) {
  const {
    contentType,
    source,
    changeVolume,
    changeMute,
    volume,
    muted,
    thumbnail,
    position,
    claim,
    uri,
    autoplaySetting,
    autoplayIfEmbedded,
    doAnalyticsView,
    claimRewards,
  } = props;
  const claimId = claim && claim.claim_id;
  const videoRef = useRef();
  const isAudio = contentType.includes('audio');
  const embedded = useContext(EmbedContext);

  if (embedded) {
    VIDEO_JS_OPTIONS.autoplay = autoplayIfEmbedded;
    VIDEO_JS_OPTIONS.muted = autoplayIfEmbedded;
  } else if (autoplaySetting) {
    VIDEO_JS_OPTIONS.autoplay = autoplaySetting;
  }

  const forcePlayer = FORCE_CONTENT_TYPE_PLAYER.includes(contentType);
  const [requireRedraw, setRequireRedraw] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAutoplayCountdown, setShowAutoplayCountdown] = useState(false);
  const [isEndededEmbed, setIsEndededEmbed] = useState(false);
  const previousUri = usePrevious(uri);

  let player;

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
    if (isAudio || (embedded && !autoplayIfEmbedded)) {
      videoJsOptions.poster = thumbnail;
    }

    if (!requireRedraw) {
      player = videojs(videoNode, videoJsOptions, function() {
        if (!autoplayIfEmbedded) player.volume(volume);
        player.muted(autoplayIfEmbedded || muted);
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

      doAnalyticsView(uri, data.secondsToLoad).then(() => {
        claimRewards();
      });
    }

    function doEnded() {
      if (embedded) {
        setIsEndededEmbed(true);
      } else if (autoplaySetting) {
        setShowAutoplayCountdown(true);
      }
    }

    function doVolume(e: Event) {
      const isMuted = player.muted();
      const volume = player.volume();
      changeVolume(volume);
      changeMute(isMuted);
    }

    function doPlay() {
      setIsPlaying(true);
      setShowAutoplayCountdown(false);
      setIsEndededEmbed(false);
    }

    if (player) {
      player.on('tracking:buffered', doTrackingBuffered);

      player.on('tracking:firstplay', doTrackingFirstPlay);
      // FIXME: above is not firing on subsequent renders (though the effect fires), maybe below check can reset?
      if (uri && previousUri !== uri) {
        // do reset?
      }

      player.on('ended', doEnded);
      player.on('volumechange', doVolume);
      player.on('play', doPlay);
      player.on('pause', () => setIsPlaying(false));

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
  }, [claimId, player, changeVolume, changeMute]); // FIXME: more dependencies?

  useEffect(() => {
    if (player && position) {
      player.currentTime(position);
    }
  }, [player, position]);

  return (
    <div
      className={classnames('file-viewer', {
        'file-viewer--is-playing': isPlaying,
      })}
      onContextMenu={stopContextMenu}
    >
      {showAutoplayCountdown && <AutoplayCountdown uri={uri} />}
      {isEndededEmbed && <FileViewerEmbeddedEnded uri={uri} />}
      {embedded && !isEndededEmbed && <FileViewerEmbeddedTitle uri={uri} />}
      {!requireRedraw && (
        <div data-vjs-player>
          {isAudio ? <audio ref={videoRef} className="video-js" /> : <video ref={videoRef} className="video-js" />}
        </div>
      )}
    </div>
  );
}

export default VideoViewer;
