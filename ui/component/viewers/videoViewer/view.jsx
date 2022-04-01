// @flow
import { ENABLE_PREROLL_ADS } from 'config';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { stopContextMenu } from 'util/context-menu';
import type { Player } from './internal/videojs';
import VideoJs from './internal/videojs';
import analytics from 'analytics';
import { EmbedContext } from 'page/embedWrapper/view';
import classnames from 'classnames';
import { FORCE_CONTENT_TYPE_PLAYER } from 'constants/claim';
import AutoplayCountdown from 'component/autoplayCountdown';
import usePrevious from 'effects/use-previous';
import FileViewerEmbeddedEnded from 'web/component/fileViewerEmbeddedEnded';
import FileViewerEmbeddedTitle from 'component/fileViewerEmbeddedTitle';
import { addTheaterModeButton } from './internal/theater-mode';
import { addAutoplayNextButton } from './internal/autoplay-next';
import { addPlayNextButton } from './internal/play-next';
import { addPlayPreviousButton } from './internal/play-previous';
import { useGetAds } from 'effects/use-get-ads';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';
import { useHistory } from 'react-router';
import { getAllIds } from 'util/buildHomepage';
import type { HomepageCat } from 'util/buildHomepage';
import debounce from 'util/debounce';
import { formatLbryUrlForWeb, generateListSearchUrlParams } from 'util/url';
import useInterval from 'effects/use-interval';

// const PLAY_TIMEOUT_ERROR = 'play_timeout_error';
// const PLAY_TIMEOUT_LIMIT = 2000;
const PLAY_POSITION_SAVE_INTERVAL_MS = 15000;

type Props = {
  position: number,
  changeVolume: (number) => void,
  changeMute: (boolean) => void,
  source: string,
  contentType: string,
  thumbnail: string,
  claim: StreamClaim,
  muted: boolean,
  videoPlaybackRate: number,
  volume: number,
  uri: string,
  autoplayNext: boolean,
  autoplayIfEmbedded: boolean,
  doAnalyticsBuffer: (string, any) => void,
  savePosition: (string, number) => void,
  clearPosition: (string) => void,
  toggleVideoTheaterMode: () => void,
  toggleAutoplayNext: () => void,
  setVideoPlaybackRate: (number) => void,
  authenticated: boolean,
  userId: number,
  internalFeature: boolean,
  homepageData?: { [string]: HomepageCat },
  shareTelemetry: boolean,
  isFloating: boolean,
  doPlayUri: (string, string) => void,
  collectionId: string,
  nextRecommendedUri: string,
  previousListUri: string,
  videoTheaterMode: boolean,
  isMarkdownOrComment: boolean,
  doAnalyticsView: (string, number) => void,
  claimRewards: () => void,
  isLivestreamClaim: boolean,
  activeLivestreamForChannel: any,
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
    videoPlaybackRate,
    thumbnail,
    position,
    claim,
    uri,
    muted,
    volume,
    autoplayNext,
    autoplayIfEmbedded,
    doAnalyticsBuffer,
    doAnalyticsView,
    claimRewards,
    savePosition,
    clearPosition,
    toggleVideoTheaterMode,
    toggleAutoplayNext,
    setVideoPlaybackRate,
    homepageData,
    authenticated,
    userId,
    internalFeature,
    shareTelemetry,
    isFloating,
    doPlayUri,
    collectionId,
    nextRecommendedUri,
    previousListUri,
    videoTheaterMode,
    isMarkdownOrComment,
    isLivestreamClaim,
    activeLivestreamForChannel,
  } = props;

  const permanentUrl = claim && claim.permanent_url;
  const adApprovedChannelIds = homepageData ? getAllIds(homepageData) : [];
  const claimId = claim && claim.claim_id;
  const channelClaimId = claim && claim.signing_channel && claim.signing_channel.claim_id;
  const channelName = claim && claim.signing_channel && claim.signing_channel.name;
  const isAudio = contentType.includes('audio');
  const forcePlayer = FORCE_CONTENT_TYPE_PLAYER.includes(contentType);
  const {
    push,
    location: { pathname },
  } = useHistory();
  const [doNavigate, setDoNavigate] = useState(false);
  const [playNextUrl, setPlayNextUrl] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [showAutoplayCountdown, setShowAutoplayCountdown] = useState(false);
  const [isEndedEmbed, setIsEndedEmbed] = useState(false);
  const vjsCallbackDataRef: any = React.useRef();
  const previousUri = usePrevious(uri);
  const embedded = useContext(EmbedContext);
  const approvedVideo = Boolean(channelClaimId) && adApprovedChannelIds.includes(channelClaimId);
  const adsEnabled = ENABLE_PREROLL_ADS && !authenticated && !embedded && approvedVideo;
  const [adUrl, setAdUrl, isFetchingAd] = useGetAds(approvedVideo, adsEnabled);
  /* isLoading was designed to show loading screen on first play press, rather than completely black screen, but
  breaks because some browsers (e.g. Firefox) block autoplay but leave the player.play Promise pending */
  const [replay, setReplay] = useState(false);
  const [videoNode, setVideoNode] = useState();
  const [localAutoplayNext, setLocalAutoplayNext] = useState(autoplayNext);
  const isFirstRender = React.useRef(true);
  const playerRef = React.useRef(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    toggleAutoplayNext();
  }, [localAutoplayNext]);

  useInterval(
    () => {
      if (playerRef.current && isPlaying && !isLivestreamClaim) {
        handlePosition(playerRef.current);
      }
    },
    !isLivestreamClaim ? PLAY_POSITION_SAVE_INTERVAL_MS : null
  );

  const updateVolumeState = React.useCallback(
    debounce((volume, muted) => {
      changeVolume(volume);
      changeMute(muted);
    }, 500),
    []
  );

  // force everything to recent when URI changes, can cause weird corner cases otherwise (e.g. navigate while autoplay is true)
  useEffect(() => {
    if (uri && previousUri && uri !== previousUri) {
      setShowAutoplayCountdown(false);
      setIsEndedEmbed(false);
    }
  }, [uri, previousUri]);

  // Update vjsCallbackDataRef (ensures videojs callbacks are not using stale values):
  useEffect(() => {
    vjsCallbackDataRef.current = {
      embedded: embedded,
      videoPlaybackRate: videoPlaybackRate,
    };
  }, [embedded, videoPlaybackRate]);

  // TODO: analytics functionality
  function doTrackingBuffered(e: Event, data: any) {
    if (!isLivestreamClaim) {
      fetch(source, { method: 'HEAD', cache: 'no-store' }).then((response) => {
        data.playerPoweredBy = response.headers.get('x-powered-by');
        doAnalyticsBuffer(uri, data);
      });
    }
  }

  const doPlay = useCallback(
    (playUri) => {
      setDoNavigate(false);
      if (!isFloating) {
        const navigateUrl = formatLbryUrlForWeb(playUri);
        push({
          pathname: navigateUrl,
          search: collectionId && generateListSearchUrlParams(collectionId),
          state: { collectionId, forceAutoplay: true, hideFloatingPlayer: true },
        });
      } else {
        doPlayUri(playUri, collectionId);
      }
    },
    [collectionId, doPlayUri, isFloating, push]
  );

  useEffect(() => {
    if (!doNavigate) return;

    if (playNextUrl) {
      if (permanentUrl !== nextRecommendedUri) {
        if (nextRecommendedUri) {
          if (collectionId) clearPosition(permanentUrl);
          doPlay(nextRecommendedUri);
        }
      } else {
        setReplay(true);
      }
    } else {
      if (videoNode) {
        const currentTime = videoNode.currentTime;

        if (currentTime <= 5) {
          if (previousListUri && permanentUrl !== previousListUri) doPlay(previousListUri);
        } else {
          videoNode.currentTime = 0;
        }
        setDoNavigate(false);
      }
    }
    if (!ended) setDoNavigate(false);
    setEnded(false);
    setPlayNextUrl(true);
  }, [
    clearPosition,
    collectionId,
    doNavigate,
    doPlay,
    ended,
    nextRecommendedUri,
    permanentUrl,
    playNextUrl,
    previousListUri,
    videoNode,
  ]);

  React.useEffect(() => {
    if (!ended) return;

    analytics.videoIsPlaying(false);

    if (adUrl) {
      setAdUrl(null);
      return;
    }

    if (embedded) {
      setIsEndedEmbed(true);
    } else if (!collectionId && autoplayNext) {
      setShowAutoplayCountdown(true);
    } else if (collectionId) {
      setDoNavigate(true);
    }

    clearPosition(uri);
  }, [adUrl, autoplayNext, clearPosition, collectionId, embedded, ended, setAdUrl, uri]);

  // MORE ON PLAY STUFF
  function onPlay(player) {
    setEnded(false);
    setIsPlaying(true);
    setShowAutoplayCountdown(false);
    setIsEndedEmbed(false);
    setReplay(false);
    setDoNavigate(false);
    analytics.videoIsPlaying(true, player);
  }

  function onPause(event, player) {
    setIsPlaying(false);
    handlePosition(player);
    analytics.videoIsPlaying(false, player);
  }

  function onDispose(event, player) {
    handlePosition(player);
    analytics.videoIsPlaying(false, player);
  }

  function handlePosition(player) {
    if (!isLivestreamClaim) savePosition(uri, player.currentTime());
  }

  function restorePlaybackRate(player) {
    if (!vjsCallbackDataRef.current.embedded) {
      player.playbackRate(vjsCallbackDataRef.current.videoPlaybackRate);
    }
  }

  const playerReadyDependencyList = [uri, adUrl, embedded, autoplayIfEmbedded];

  const doPlayNext = () => {
    setPlayNextUrl(true);
    setEnded(true);
  };

  const doPlayPrevious = () => {
    setPlayNextUrl(false);
    setEnded(true);
  };

  const onPlayerReady = useCallback((player: Player, videoNode: any) => {
    if (!embedded) {
      setVideoNode(videoNode);
      player.muted(muted);
      player.volume(volume);
      player.playbackRate(videoPlaybackRate);
      if (!isMarkdownOrComment) {
        addTheaterModeButton(player, toggleVideoTheaterMode);
        if (collectionId) {
          addPlayNextButton(player, doPlayNext);
          addPlayPreviousButton(player, doPlayPrevious);
        } else {
          addAutoplayNextButton(
            player,
            () => {
              setLocalAutoplayNext((e) => !e);
            },
            autoplayNext
          );
        }
      }
    }

    // currently not being used, but leaving for time being
    // const shouldPlay = !embedded || autoplayIfEmbedded;
    // // https://blog.videojs.com/autoplay-best-practices-with-video-js/#Programmatic-Autoplay-and-Success-Failure-Detection
    // if (shouldPlay) {
    //   const playPromise = player.play();
    //
    //   const timeoutPromise = new Promise((resolve, reject) =>
    //     setTimeout(() => reject(PLAY_TIMEOUT_ERROR), PLAY_TIMEOUT_LIMIT)
    //   );
    //
    //   // if user hasn't interacted with document, mute video and play it
    //   Promise.race([playPromise, timeoutPromise]).catch((error) => {
    //     console.log(error);
    //     console.log(playPromise);
    //
    //     const noPermissionError = typeof error === 'object' && error.name && error.name === 'NotAllowedError';
    //     const isATimeoutError = error === PLAY_TIMEOUT_ERROR;
    //
    //     if (noPermissionError) {
    //       // if (player.paused()) {
    //       //   document.querySelector('.vjs-big-play-button').style.setProperty('display', 'block', 'important');
    //       // }
    //
    //       centerPlayButton();
    //
    //       // to turn muted autoplay on
    //       // if (player.autoplay() && !player.muted()) {
    //         // player.muted(true);
    //         // player.play();
    //       // }
    //     }
    //     setIsPlaying(false);
    //   });
    // }

    // PR: #5535
    // Move the restoration to a later `loadedmetadata` phase to counter the
    // delay from the header-fetch. This is a temp change until the next
    // re-factoring.
    player.on('loadedmetadata', () => restorePlaybackRate(player));

    // used for tracking buffering for watchman
    player.on('tracking:buffered', doTrackingBuffered);

    player.on('ended', () => setEnded(true));
    player.on('play', onPlay);
    player.on('pause', (event) => onPause(event, player));
    player.on('dispose', (event) => onDispose(event, player));

    player.on('error', () => {
      const error = player.error();
      if (error) {
        analytics.sentryError('Video.js error', error);
      }
    });
    player.on('volumechange', () => {
      if (player) {
        updateVolumeState(player.volume(), player.muted());
      }
    });
    player.on('ratechange', () => {
      const HAVE_NOTHING = 0; // https://docs.videojs.com/player#readyState
      if (player && player.readyState() !== HAVE_NOTHING) {
        // The playbackRate occasionally resets to 1, typically when loading a fresh video or when 'src' changes.
        // Videojs says it's a browser quirk (https://github.com/videojs/video.js/issues/2516).
        // [x] Don't update 'videoPlaybackRate' in this scenario.
        // [ ] Ideally, the controlBar should be hidden to prevent users from changing the rate while loading.
        setVideoPlaybackRate(player.playbackRate());
      }
    });

    if (position && !isLivestreamClaim) {
      player.currentTime(position);
    }

    playerRef.current = player;
  }, playerReadyDependencyList); // eslint-disable-line

  return (
    <div
      className={classnames('file-viewer', {
        'file-viewer--is-playing': isPlaying,
        'file-viewer--ended-embed': isEndedEmbed,
      })}
      onContextMenu={stopContextMenu}
    >
      {showAutoplayCountdown && (
        <AutoplayCountdown
          nextRecommendedUri={nextRecommendedUri}
          doNavigate={() => setDoNavigate(true)}
          doReplay={() => setReplay(true)}
        />
      )}
      {isEndedEmbed && <FileViewerEmbeddedEnded uri={uri} />}
      {embedded && !isEndedEmbed && <FileViewerEmbeddedTitle uri={uri} />}

      {!isFetchingAd && adUrl && (
        <>
          <span className="ads__video-notify">
            {__('Advertisement')}{' '}
            <Button
              className="ads__video-close"
              icon={ICONS.REMOVE}
              title={__('Close')}
              onClick={() => setAdUrl(null)}
            />
          </span>
          <span className="ads__video-nudge">
            <I18nMessage
              tokens={{
                sign_up: (
                  <Button
                    button="secondary"
                    className="ads__video-link"
                    label={__('Sign Up')}
                    navigate={`/$/${PAGES.AUTH}?redirect=${pathname}&src=video-ad`}
                  />
                ),
              }}
            >
              %sign_up% to turn ads off.
            </I18nMessage>
          </span>
        </>
      )}

      <VideoJs
        adUrl={adUrl}
        source={adUrl || source}
        sourceType={forcePlayer || adUrl ? 'video/mp4' : contentType}
        isAudio={isAudio}
        poster={isAudio || (embedded && !autoplayIfEmbedded) ? thumbnail : ''}
        onPlayerReady={onPlayerReady}
        startMuted={autoplayIfEmbedded}
        toggleVideoTheaterMode={toggleVideoTheaterMode}
        autoplay={!embedded || autoplayIfEmbedded}
        autoplaySetting={localAutoplayNext}
        claimId={claimId}
        title={claim && ((claim.value && claim.value.title) || claim.name)}
        channelName={channelName}
        userId={userId}
        allowPreRoll={!authenticated} // TODO: pull this into ads functionality so it's self contained
        internalFeatureEnabled={internalFeature}
        shareTelemetry={shareTelemetry}
        replay={replay}
        videoTheaterMode={videoTheaterMode}
        playNext={doPlayNext}
        playPrevious={doPlayPrevious}
        embedded={embedded}
        claimValues={claim.value}
        doAnalyticsView={doAnalyticsView}
        claimRewards={claimRewards}
        uri={uri}
        clearPosition={clearPosition}
        userClaimId={claim && claim.signing_channel && claim.signing_channel.claim_id}
        isLivestreamClaim={isLivestreamClaim}
        activeLivestreamForChannel={activeLivestreamForChannel}
      />
    </div>
  );
}

export default VideoViewer;
