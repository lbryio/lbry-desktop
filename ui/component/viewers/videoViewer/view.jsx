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
import LoadingScreen from 'component/common/loading-screen';
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
import { formatLbryUrlForWeb, generateListSearchUrlParams } from 'util/url';

const PLAY_TIMEOUT_ERROR = 'play_timeout_error';
const PLAY_TIMEOUT_LIMIT = 2000;

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
  autoplayMedia: boolean,
  autoplayNext: boolean,
  autoplayIfEmbedded: boolean,
  desktopPlayStartTime?: number,
  doAnalyticsView: (string, number) => Promise<any>,
  doAnalyticsBuffer: (string, any) => void,
  claimRewards: () => void,
  savePosition: (string, number) => void,
  clearPosition: (string) => void,
  toggleVideoTheaterMode: () => void,
  toggleAutoplayNext: () => void,
  setVideoPlaybackRate: (number) => void,
  authenticated: boolean,
  userId: number,
  homepageData?: { [string]: HomepageCat },
  shareTelemetry: boolean,
  isFloating: boolean,
  doPlayUri: (string, string) => void,
  collectionId: string,
  nextRecommendedUri: string,
  previousListUri: string,
  videoTheaterMode: boolean,
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
    autoplayMedia,
    autoplayNext,
    autoplayIfEmbedded,
    doAnalyticsView,
    doAnalyticsBuffer,
    claimRewards,
    savePosition,
    clearPosition,
    desktopPlayStartTime,
    toggleVideoTheaterMode,
    toggleAutoplayNext,
    setVideoPlaybackRate,
    homepageData,
    authenticated,
    userId,
    shareTelemetry,
    isFloating,
    doPlayUri,
    collectionId,
    nextRecommendedUri,
    previousListUri,
    videoTheaterMode,
  } = props;
  const permanentUrl = claim && claim.permanent_url;
  const adApprovedChannelIds = homepageData ? getAllIds(homepageData) : [];
  const claimId = claim && claim.claim_id;
  const channelClaimId = claim && claim.signing_channel && claim.signing_channel.claim_id;
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
  const [isLoading, setIsLoading] = useState(false);
  const [replay, setReplay] = useState(false);
  const [videoNode, setVideoNode] = useState();

  // force everything to recent when URI changes, can cause weird corner cases otherwise (e.g. navigate while autoplay is true)
  useEffect(() => {
    if (uri && previousUri && uri !== previousUri) {
      setShowAutoplayCountdown(false);
      setIsEndedEmbed(false);
      setIsLoading(false);
    }
  }, [uri, previousUri]);

  // Update vjsCallbackDataRef (ensures videojs callbacks are not using stale values):
  useEffect(() => {
    vjsCallbackDataRef.current = {
      embedded: embedded,
      videoPlaybackRate: videoPlaybackRate,
    };
  }, [embedded, videoPlaybackRate]);

  function doTrackingBuffered(e: Event, data: any) {
    fetch(source, { method: 'HEAD', cache: 'no-store' }).then((response) => {
      data.playerPoweredBy = response.headers.get('x-powered-by');
      doAnalyticsBuffer(uri, data);
    });
  }

  function doTrackingFirstPlay(e: Event, data: any) {
    let timeToStart = data.secondsToLoad;

    if (desktopPlayStartTime !== undefined) {
      const differenceToAdd = Date.now() - desktopPlayStartTime;
      timeToStart += differenceToAdd;
    }
    analytics.playerStartedEvent(embedded);

    fetch(source, { method: 'HEAD', cache: 'no-store' }).then((response) => {
      let playerPoweredBy = response.headers.get('x-powered-by') || '';
      analytics.videoStartEvent(claimId, timeToStart, playerPoweredBy, userId, claim.canonical_url, this);
    });

    doAnalyticsView(uri, timeToStart).then(() => {
      claimRewards();
    });
  }

  const doPlay = useCallback(
    (playUri) => {
      setDoNavigate(false);
      const navigateUrl = formatLbryUrlForWeb(playUri);
      if (collectionId) clearPosition(playUri);
      if (!isFloating) {
        push({
          pathname: navigateUrl,
          search: collectionId && generateListSearchUrlParams(collectionId),
          state: { collectionId, forceAutoplay: true, hideFloatingPlayer: true },
        });
      } else {
        doPlayUri(playUri, collectionId);
      }
    },
    [clearPosition, collectionId, doPlayUri, isFloating, push]
  );

  useEffect(() => {
    if (doNavigate) {
      if (playNextUrl) {
        if (permanentUrl !== nextRecommendedUri) {
          if (nextRecommendedUri) doPlay(nextRecommendedUri);
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
    }
  }, [doNavigate, doPlay, ended, nextRecommendedUri, permanentUrl, playNextUrl, previousListUri, videoNode]);

  React.useEffect(() => {
    if (ended) {
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
    }
  }, [
    embedded,
    setIsEndedEmbed,
    autoplayMedia,
    setShowAutoplayCountdown,
    adUrl,
    setAdUrl,
    clearPosition,
    uri,
    ended,
    collectionId,
    autoplayNext,
  ]);

  function onPlay(player) {
    setEnded(false);
    setIsLoading(false);
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
    savePosition(uri, player.currentTime());
  }

  function restorePlaybackRate(player) {
    if (!vjsCallbackDataRef.current.embedded) {
      player.playbackRate(vjsCallbackDataRef.current.videoPlaybackRate);
    }
  }

  const playerReadyDependencyList = [uri, adUrl, embedded, autoplayIfEmbedded];
  if (!IS_WEB) {
    playerReadyDependencyList.push(desktopPlayStartTime);
  }

  const doPlayNext = () => {
    setPlayNextUrl(true);
    setDoNavigate(true);
  };

  const doPlayPrevious = () => {
    setPlayNextUrl(false);
    setDoNavigate(true);
  };

  const onPlayerReady = useCallback((player: Player, videoNode: any) => {
    if (!embedded) {
      setVideoNode(videoNode);
      player.muted(muted);
      player.volume(volume);
      player.playbackRate(videoPlaybackRate);
      addTheaterModeButton(player, toggleVideoTheaterMode);
      if (collectionId) {
        addPlayNextButton(player, doPlayNext);
        addPlayPreviousButton(player, doPlayPrevious);
      } else {
        addAutoplayNextButton(player, toggleAutoplayNext, autoplayNext);
      }
    }

    const shouldPlay = !embedded || autoplayIfEmbedded;
    // https://blog.videojs.com/autoplay-best-practices-with-video-js/#Programmatic-Autoplay-and-Success-Failure-Detection
    if (shouldPlay) {
      const playPromise = player.play();
      const timeoutPromise = new Promise((resolve, reject) =>
        setTimeout(() => reject(PLAY_TIMEOUT_ERROR), PLAY_TIMEOUT_LIMIT)
      );

      Promise.race([playPromise, timeoutPromise]).catch((error) => {
        if (typeof error === 'object' && error.name && error.name === 'NotAllowedError') {
          if (player.autoplay() && !player.muted()) {
            // player.muted(true);
            // another version had player.play()
          }
        }
        setIsLoading(false);
        setIsPlaying(false);
      });
    }

    setIsLoading(shouldPlay); // if we are here outside of an embed, we're playing

    // PR: #5535
    // Move the restoration to a later `loadedmetadata` phase to counter the
    // delay from the header-fetch. This is a temp change until the next
    // re-factoring.
    player.on('loadedmetadata', () => restorePlaybackRate(player));

    // used for tracking buffering for watchman
    player.on('tracking:buffered', doTrackingBuffered);

    // first play tracking, used for initializing the watchman api
    player.on('tracking:firstplay', doTrackingFirstPlay);
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
        changeVolume(player.volume());
        changeMute(player.muted());
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

    if (position) {
      player.currentTime(position);
    }
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
      {/* disable this loading behavior because it breaks when player.play() promise hangs */}
      {isLoading && <LoadingScreen status={__('Loading')} />}

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

      {!isFetchingAd && (
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
          autoplaySetting={autoplayNext}
          claimId={claimId}
          userId={userId}
          allowPreRoll={!embedded && !authenticated}
          shareTelemetry={shareTelemetry}
          replay={replay}
          videoTheaterMode={videoTheaterMode}
          playNext={doPlayNext}
          playPrevious={doPlayPrevious}
          embedded={embedded}
        />
      )}
    </div>
  );
}

export default VideoViewer;
