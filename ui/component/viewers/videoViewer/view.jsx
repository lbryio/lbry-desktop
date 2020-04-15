// @flow
import React, { useRef, useEffect, useState, useContext, useCallback } from 'react';
import { stopContextMenu } from 'util/context-menu';
import VideoJs from './internal/videojs';

import isUserTyping from 'util/detect-typing';
import analytics from 'analytics';
import { EmbedContext } from 'page/embedWrapper/view';
import classnames from 'classnames';
import { FORCE_CONTENT_TYPE_PLAYER } from 'constants/claim';
import AutoplayCountdown from 'component/autoplayCountdown';
import usePrevious from 'effects/use-previous';
import FileViewerEmbeddedEnded from 'lbrytv/component/fileViewerEmbeddedEnded';
import FileViewerEmbeddedTitle from 'lbrytv/component/fileViewerEmbeddedTitle';




type Props = {
  position: number,
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

/*
codesandbox of idealized/clean videojs and react 16+
https://codesandbox.io/s/71z2lm4ko6
 */

function VideoViewer(props: Props) {
  const {
    contentType,
    source,
    changeVolume,
    changeMute,
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
  const isAudio = contentType.includes('audio');

  const forcePlayer = FORCE_CONTENT_TYPE_PLAYER.includes(contentType);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAutoplayCountdown, setShowAutoplayCountdown] = useState(false);
  const [isEndededEmbed, setIsEndededEmbed] = useState(false);
  const [player, setPlayer] = useState(null);

  const previousUri = usePrevious(uri);
  const embedded = useContext(EmbedContext);

  function doTrackingBuffered(e: Event, data: any) {
    analytics.videoBufferEvent(claimId, data.currentTime);
  }

  function doTrackingFirstPlay(e: Event, data: any) {
    console.log('doTrackingFirstPlay: ' + data.secondsToLoad);

    analytics.videoStartEvent(claimId, data.secondsToLoad);

    doAnalyticsView(uri, data.secondsToLoad).then(() => {
      claimRewards();
    });
  }

  function onEnded() {
    if (embedded) {
      setIsEndededEmbed(true);
    } else if (autoplaySetting) {
      setShowAutoplayCountdown(true);
    }
  }

  function onVolumeChange(e: Event) {
    const isMuted = player.muted();
    const volume = player.volume();
    changeVolume(volume);
    changeMute(isMuted);
  }

  function onPlay() {
    setIsPlaying(true);
    setShowAutoplayCountdown(false);
    setIsEndededEmbed(false);
  }

  function onPause() {
    setIsPlaying(false);
  }

  const onPlayerReady = useCallback(
    (player) => {
      console.log('videoViewer.onPlayerReady attach effects');
      player.on('tracking:buffered', doTrackingBuffered);

      player.on('tracking:firstplay', doTrackingFirstPlay);

      player.on('ended', onEnded);
      player.on('volumechange', onVolumeChange);
      player.on('play', onPlay);
      player.on('pause', onPause);

      // fixes #3498 (https://github.com/lbryio/lbry-desktop/issues/3498)
      // summary: on firefox the focus would stick to the fullscreen button which caused buggy behavior with spacebar
      // $FlowFixMe
      player.on('fullscreenchange', () => document.activeElement && document.activeElement.blur());

      if (position) {
        player.currentTime(position);
      }
    });

  console.log('VideoViewer render');

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
      <VideoJs
        source={source}
        isAudio={isAudio}
        poster={isAudio || (embedded && !autoplayIfEmbedded) ? thumbnail : null}
        sourceType={forcePlayer ? 'video/mp4' : contentType}
        autoplay={embedded ? autoplayIfEmbedded : true}
        onPlayerReady={() => {}}
      />
    </div>
  );
}

export default VideoViewer;
