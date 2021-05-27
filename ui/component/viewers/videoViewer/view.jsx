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
import { useGetAds } from 'effects/use-get-ads';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';
import { useHistory } from 'react-router';

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
  autoplaySetting: boolean,
  autoplayIfEmbedded: boolean,
  desktopPlayStartTime?: number,
  doAnalyticsView: (string, number) => Promise<any>,
  doAnalyticsBuffer: (string, any) => void,
  claimRewards: () => void,
  savePosition: (string, number) => void,
  clearPosition: (string) => void,
  toggleVideoTheaterMode: () => void,
  setVideoPlaybackRate: (number) => void,
  authenticated: boolean,
  homepageData: {
    PRIMARY_CONTENT_CHANNEL_IDS?: Array<string>,
    ENLIGHTENMENT_CHANNEL_IDS?: Array<string>,
    GAMING_CHANNEL_IDS?: Array<string>,
    SCIENCE_CHANNEL_IDS?: Array<string>,
    TECHNOLOGY_CHANNEL_IDS?: Array<string>,
    COMMUNITY_CHANNEL_IDS?: Array<string>,
    FINCANCE_CHANNEL_IDS?: Array<string>,
  },
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
    autoplaySetting,
    autoplayIfEmbedded,
    doAnalyticsView,
    doAnalyticsBuffer,
    claimRewards,
    savePosition,
    clearPosition,
    desktopPlayStartTime,
    toggleVideoTheaterMode,
    setVideoPlaybackRate,
    homepageData,
    authenticated,
  } = props;
  const {
    PRIMARY_CONTENT_CHANNEL_IDS = [],
    ENLIGHTENMENT_CHANNEL_IDS = [],
    GAMING_CHANNEL_IDS = [],
    SCIENCE_CHANNEL_IDS = [],
    TECHNOLOGY_CHANNEL_IDS = [],
    COMMUNITY_CHANNEL_IDS = [],
    FINCANCE_CHANNEL_IDS = [],
  } = homepageData;
  const adApprovedChannelIds = [
    ...PRIMARY_CONTENT_CHANNEL_IDS,
    ...ENLIGHTENMENT_CHANNEL_IDS,
    ...GAMING_CHANNEL_IDS,
    ...SCIENCE_CHANNEL_IDS,
    ...TECHNOLOGY_CHANNEL_IDS,
    ...COMMUNITY_CHANNEL_IDS,
    ...FINCANCE_CHANNEL_IDS,
  ];
  const claimId = claim && claim.claim_id;
  const channelClaimId = claim && claim.signing_channel && claim.signing_channel.claim_id;
  const isAudio = contentType.includes('audio');
  const forcePlayer = FORCE_CONTENT_TYPE_PLAYER.includes(contentType);
  const {
    location: { pathname },
  } = useHistory();
  const previousUri = usePrevious(uri);
  const embedded = useContext(EmbedContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAutoplayCountdown, setShowAutoplayCountdown] = useState(false);
  const [isEndededEmbed, setIsEndededEmbed] = useState(false);
  const vjsCallbackDataRef: any = React.useRef();
  const approvedVideo = Boolean(channelClaimId) && adApprovedChannelIds.includes(channelClaimId);
  const adsEnabled = ENABLE_PREROLL_ADS && !authenticated && !embedded && approvedVideo;
  const [adUrl, setAdUrl, isFetchingAd] = useGetAds(approvedVideo, adsEnabled);
  /* isLoading was designed to show loading screen on first play press, rather than completely black screen, but
  breaks because some browsers (e.g. Firefox) block autoplay but leave the player.play Promise pending */
  const [isLoading, setIsLoading] = useState(false);

  // force everything to recent when URI changes, can cause weird corner cases otherwise (e.g. navigate while autoplay is true)
  useEffect(() => {
    if (uri && previousUri && uri !== previousUri) {
      setShowAutoplayCountdown(false);
      setIsEndededEmbed(false);
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
    fetch(source, { method: 'HEAD' }).then((response) => {
      data.playerPoweredBy = response.headers.get('x-powered-by');
      doAnalyticsBuffer(uri, data);
    });
  }

  function doTrackingFirstPlay(e: Event, data: any) {
    let timeToStartInMs = data.secondsToLoad * 1000;

    if (desktopPlayStartTime !== undefined) {
      const differenceToAdd = Date.now() - desktopPlayStartTime;
      timeToStartInMs += differenceToAdd;
    }
    analytics.playerStartedEvent(embedded);
    analytics.videoStartEvent(claimId, timeToStartInMs);
    doAnalyticsView(uri, timeToStartInMs).then(() => {
      claimRewards();
    });
  }

  const onEnded = React.useCallback(() => {
    if (adUrl) {
      setAdUrl(null);
      return;
    }

    if (embedded) {
      setIsEndededEmbed(true);
    } else if (autoplaySetting) {
      setShowAutoplayCountdown(true);
    }
  }, [embedded, setIsEndededEmbed, autoplaySetting, setShowAutoplayCountdown, adUrl, setAdUrl]);

  function onPlay() {
    setIsLoading(false);
    setIsPlaying(true);
    setShowAutoplayCountdown(false);
    setIsEndededEmbed(false);
  }

  function handlePosition(player) {
    if (player.ended()) {
      clearPosition(uri);
    } else {
      savePosition(uri, player.currentTime());
    }
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

  const onPlayerReady = useCallback((player: Player) => {
    if (!embedded) {
      player.muted(muted);
      player.volume(volume);
      player.playbackRate(videoPlaybackRate);
      addTheaterModeButton(player, toggleVideoTheaterMode);
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
            player.muted(true);
          }
        }

        if (PLAY_TIMEOUT_ERROR) {
          const retryPlayPromise = player.play();
          Promise.race([retryPlayPromise, timeoutPromise]).catch((error) => {
            setIsLoading(false);
            setIsPlaying(false);
          });
        } else {
          setIsLoading(false);
          setIsPlaying(false);
        }
      });
    }

    setIsLoading(shouldPlay); // if we are here outside of an embed, we're playing

    // PR: #5535
    // Move the restoration to a later `loadedmetadata` phase to counter the
    // delay from the header-fetch. This is a temp change until the next
    // re-factoring.
    player.on('loadedmetadata', () => restorePlaybackRate(player));

    player.on('tracking:buffered', doTrackingBuffered);
    player.on('tracking:firstplay', doTrackingFirstPlay);
    player.on('ended', onEnded);
    player.on('play', onPlay);
    player.on('pause', () => {
      setIsPlaying(false);
      handlePosition(player);
    });
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
    player.on('dispose', () => {
      handlePosition(player);
    });
  }, playerReadyDependencyList);

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
        />
      )}
    </div>
  );
}

export default VideoViewer;
