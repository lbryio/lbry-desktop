// @flow
import { ENABLE_PREROLL_ADS } from 'config';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { stopContextMenu } from 'util/context-menu';
import * as Chapters from './internal/chapters';
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
import useAutoplayNext from './internal/effects/use-autoplay-next';
import useTheaterMode from './internal/effects/use-theater-mode';
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
import { lastBandwidthSelector } from './internal/plugins/videojs-http-streaming--override/playlist-selectors';
import { platform } from 'util/platform';

// const PLAY_TIMEOUT_ERROR = 'play_timeout_error';
// const PLAY_TIMEOUT_LIMIT = 2000;
const PLAY_POSITION_SAVE_INTERVAL_MS = 15000;

const IS_IOS = platform.isIOS();

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
  defaultQuality: ?string,
  doToast: ({ message: string, linkText: string, linkTarget: string }) => void,
  doSetContentHistoryItem: (uri: string) => void,
  doClearContentHistoryUri: (uri: string) => void,
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
    defaultQuality,
    doToast,
    doSetContentHistoryItem,
  } = props;

  const permanentUrl = claim && claim.permanent_url;
  const adApprovedChannelIds = homepageData ? getAllIds(homepageData) : [];
  const claimId = claim && claim.claim_id;
  const channelClaimId = claim && claim.signing_channel && claim.signing_channel.claim_id;
  const channelTitle =
    (claim && claim.signing_channel && claim.signing_channel.value && claim.signing_channel.value.title) || '';
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

  const addAutoplayNextButton = useAutoplayNext(playerRef, autoplayNext);
  const addTheaterModeButton = useTheaterMode(playerRef, videoTheaterMode);

  React.useEffect(() => {
    if (isPlaying) {
      // save the updated watch time
      doSetContentHistoryItem(claim.permanent_url);
    }
  }, [isPlaying]);

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

  const doPlay = useCallback(
    (playUri) => {
      if (!playUri) return;
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

  /** handle play next/play previous buttons **/
  useEffect(() => {
    if (!doNavigate) return;

    // playNextUrl is set (either true or false) when the Next/Previous buttons are clicked
    const shouldPlayNextUrl = playNextUrl && nextRecommendedUri && permanentUrl !== nextRecommendedUri;
    const shouldPlayPreviousUrl = !playNextUrl && previousListUri && permanentUrl !== previousListUri;

    // play next video if someone hits Next button
    if (shouldPlayNextUrl) {
      doPlay(nextRecommendedUri);
      // rewind if video is over 5 seconds and they hit the back button
    } else if (videoNode && videoNode.currentTime > 5) {
      videoNode.currentTime = 0;
      // move to previous video when they hit back button if behind 5 seconds
    } else if (shouldPlayPreviousUrl) {
      doPlay(previousListUri);
    } else {
      setReplay(true);
    }

    setDoNavigate(false);
    setEnded(false);
    setPlayNextUrl(true);
  }, [
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

  // functionality to run on video end
  React.useEffect(() => {
    if (!ended) return;

    analytics.videoIsPlaying(false);

    if (adUrl) {
      setAdUrl(null);
      return;
    }

    if (embedded) {
      setIsEndedEmbed(true);
      // show autoplay countdown div if not playlist
    } else if (!collectionId && autoplayNext) {
      setShowAutoplayCountdown(true);
      // if a playlist, navigate to next item
    } else if (collectionId) {
      setDoNavigate(true);
    }

    clearPosition(uri);

    if (IS_IOS && !autoplayNext) {
      // show play button on ios if video is paused with no autoplay on
      // $FlowFixMe
      document.querySelector('.vjs-touch-overlay')?.classList.add('show-play-toggle'); // eslint-disable-line no-unused-expressions
    }
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

  function onPlayerClosed(event, player) {
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
    // add buttons and initialize some settings for the player
    if (!embedded) {
      setVideoNode(videoNode);
      player.muted(muted);
      player.volume(volume);
      player.playbackRate(videoPlaybackRate);
      if (!isMarkdownOrComment) {
        addTheaterModeButton(player, toggleVideoTheaterMode);
        // if part of a playlist

        // remove old play next/previous buttons if they exist
        const controlBar = player.controlBar;
        if (controlBar) {
          const existingPlayNextButton = controlBar.getChild('PlayNextButton');
          if (existingPlayNextButton) controlBar.removeChild('PlayNextButton');

          const existingPlayPreviousButton = controlBar.getChild('PlayPreviousButton');
          if (existingPlayPreviousButton) controlBar.removeChild('PlayPreviousButton');

          const existingAutoplayButton = controlBar.getChild('AutoplayNextButton');
          if (existingAutoplayButton) controlBar.removeChild('AutoplayNextButton');
        }

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
    // PR: #5535
    // Move the restoration to a later `loadedmetadata` phase to counter the
    // delay from the header-fetch. This is a temp change until the next
    // re-factoring.
    const restorePlaybackRateEvent = () => restorePlaybackRate(player);

    // Override the "auto" algorithm to post-process the result
    const overrideAutoAlgorithm = () => {
      const vhs = player.tech(true).vhs;
      if (vhs) {
        // https://github.com/videojs/http-streaming/issues/749#issuecomment-606972884
        vhs.selectPlaylist = lastBandwidthSelector;
      }
    };

    const onPauseEvent = (event) => onPause(event, player);
    const onPlayerClosedEvent = (event) => onPlayerClosed(event, player);
    const onVolumeChange = () => {
      if (player) {
        updateVolumeState(player.volume(), player.muted());
      }
    };
    const onPlayerEnded = () => setEnded(true);
    const onError = () => {
      const error = player.error();
      if (error) {
        analytics.sentryError('Video.js error', error);
      }
    };
    const onRateChange = () => {
      const HAVE_NOTHING = 0; // https://docs.videojs.com/player#readyState
      if (player && player.readyState() !== HAVE_NOTHING) {
        // The playbackRate occasionally resets to 1, typically when loading a fresh video or when 'src' changes.
        // Videojs says it's a browser quirk (https://github.com/videojs/video.js/issues/2516).
        // [x] Don't update 'videoPlaybackRate' in this scenario.
        // [ ] Ideally, the controlBar should be hidden to prevent users from changing the rate while loading.
        setVideoPlaybackRate(player.playbackRate());
      }
    };

    const moveToPosition = () => {
      // update current time based on previous position
      if (position && !isLivestreamClaim) {
        player.currentTime(position);
      }
    };

    // load events onto player
    player.on('play', onPlay);
    player.on('pause', onPauseEvent);
    player.on('playerClosed', onPlayerClosedEvent);
    player.on('ended', onPlayerEnded);
    player.on('error', onError);
    player.on('volumechange', onVolumeChange);
    player.on('ratechange', onRateChange);
    player.on('loadedmetadata', overrideAutoAlgorithm);
    player.on('loadedmetadata', restorePlaybackRateEvent);
    player.one('loadedmetadata', moveToPosition);

    const cancelOldEvents = () => {
      player.off('play', onPlay);
      player.off('pause', onPauseEvent);
      player.off('playerClosed', onPlayerClosedEvent);
      player.off('ended', onPlayerEnded);
      player.off('error', onError);
      player.off('volumechange', onVolumeChange);
      player.off('ratechange', onRateChange);
      player.off('loadedmetadata', overrideAutoAlgorithm);
      player.off('loadedmetadata', restorePlaybackRateEvent);
      player.off('playerClosed', cancelOldEvents);
      player.off('loadedmetadata', moveToPosition);
    };

    // turn off old events to prevent duplicate runs
    player.on('playerClosed', cancelOldEvents);

    // add (or remove) chapters button and time tooltips when video is ready
    player.one('loadstart', () => Chapters.parseAndLoad(player, claim));

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
        claimId={claimId}
        title={claim && ((claim.value && claim.value.title) || claim.name)}
        channelTitle={channelTitle}
        userId={userId}
        allowPreRoll={!authenticated} // TODO: pull this into ads functionality so it's self contained
        internalFeatureEnabled={internalFeature}
        shareTelemetry={shareTelemetry}
        replay={replay}
        playNext={doPlayNext}
        playPrevious={doPlayPrevious}
        embedded={embedded}
        embeddedInternal={isMarkdownOrComment}
        claimValues={claim.value}
        doAnalyticsView={doAnalyticsView}
        doAnalyticsBuffer={doAnalyticsBuffer}
        claimRewards={claimRewards}
        uri={uri}
        userClaimId={claim && claim.signing_channel && claim.signing_channel.claim_id}
        isLivestreamClaim={isLivestreamClaim}
        activeLivestreamForChannel={activeLivestreamForChannel}
        defaultQuality={defaultQuality}
        doToast={doToast}
      />
    </div>
  );
}

export default VideoViewer;
