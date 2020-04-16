// @flow
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { stopContextMenu } from 'util/context-menu';
import VideoJs from './internal/videojs';

import analytics from 'analytics';
import { EmbedContext } from 'page/embedWrapper/view';
import classnames from 'classnames';
import { FORCE_CONTENT_TYPE_PLAYER } from 'constants/claim';
import AutoplayCountdown from 'component/autoplayCountdown';
import usePrevious from 'effects/use-previous';
import FileViewerEmbeddedEnded from 'lbrytv/component/fileViewerEmbeddedEnded';
import FileViewerEmbeddedTitle from 'lbrytv/component/fileViewerEmbeddedTitle';
import LoadingScreen from 'component/common/loading-screen';

type Props = {
  position: number,
  changeVolume: number => void,
  changeMute: boolean => void,
  source: string,
  contentType: string,
  thumbnail: string,
  claim: Claim,
  muted: boolean,
  volume: number,
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
    muted,
    volume,
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
  const [isLoading, setIsLoading] = useState(false);

  const previousUri = usePrevious(uri);
  const embedded = useContext(EmbedContext);

  // force everything to recent when URI changes, can cause weird corner cases otherwise (e.g. navigate while autoplay is true)
  useEffect(() => {
    if (uri && previousUri && uri !== previousUri) {
      setShowAutoplayCountdown(false);
      setIsEndededEmbed(false);
      setIsLoading(false);
    }
  }, [uri, previousUri]);

  function doTrackingBuffered(e: Event, data: any) {
    analytics.videoBufferEvent(claimId, data.currentTime);
  }

  function doTrackingFirstPlay(e: Event, data: any) {
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

  function onPlay() {
    setIsLoading(false);
    setIsPlaying(true);
    setShowAutoplayCountdown(false);
    setIsEndededEmbed(false);
  }

  function onPause() {
    setIsPlaying(false);
  }

  const onPlayerReady = useCallback(player => {
    setIsLoading(!embedded); // if we are here outside of an embed, we're playing

    player.on('tracking:buffered', doTrackingBuffered);
    player.on('tracking:firstplay', doTrackingFirstPlay);
    player.on('ended', onEnded);
    player.on('play', onPlay);
    player.on('pause', onPause);
    player.on('volumechange', () => {
      if (player && player.volume() !== volume) {
        changeVolume(player.volume());
      }
      if (player && player.muted() !== muted) {
        changeMute(player.muted());
      }
    });

    if (position) {
      player.currentTime(position);
    }

    // FIXME: below breaks rendering?!
    /* if (!embedded) {
      if (muted) {
        player.muted(muted);
      }
      if (volume) {
        player.volume(volume);
      }
    } */
  }, []);

  return (
    <div
      className={classnames('file-viewer', {
        'file-viewer--is-playing': isPlaying,
        'file-viewer--ended-embed': isEndededEmbed,
      })}
      onContextMenu={stopContextMenu}
    >
      {showAutoplayCountdown && <AutoplayCountdown uri={uri} />}
      {isEndededEmbed && <FileViewerEmbeddedEnded uri={uri} />}
      {embedded && !isEndededEmbed && <FileViewerEmbeddedTitle uri={uri} />}
      {/* change message at any time */}
      {isLoading && <LoadingScreen status={__('Loading')} />}
      <VideoJs
        source={source}
        isAudio={isAudio}
        poster={isAudio || (embedded && !autoplayIfEmbedded) ? thumbnail : null}
        sourceType={forcePlayer ? 'video/mp4' : contentType}
        autoplay={embedded ? autoplayIfEmbedded : true}
        onPlayerReady={onPlayerReady}
      />
    </div>
  );
}

export default VideoViewer;
