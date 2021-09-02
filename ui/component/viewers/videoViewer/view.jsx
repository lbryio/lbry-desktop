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
import { getAllIds } from 'util/buildHomepage';
import type { HomepageCat } from 'util/buildHomepage';

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
  userId: number,
  homepageData?: { [string]: HomepageCat },
  shareTelemetry: boolean,
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
    userId,
    shareTelemetry,
  } = props;

  const adApprovedChannelIds = homepageData ? getAllIds(homepageData) : [];
  const claimId = claim && claim.claim_id;
  const channelClaimId = claim && claim.signing_channel && claim.signing_channel.claim_id;
  const isAudio = contentType.includes('audio');
  const forcePlayer = FORCE_CONTENT_TYPE_PLAYER.includes(contentType);
  const {
    location: { pathname },
  } = useHistory();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAutoplayCountdown, setShowAutoplayCountdown] = useState(false);
  const [isEndededEmbed, setIsEndededEmbed] = useState(false);
  const vjsCallbackDataRef: any = React.useRef();
  const previousUri = usePrevious(uri);
  const embedded = useContext(EmbedContext);
  const approvedVideo = Boolean(channelClaimId) && adApprovedChannelIds.includes(channelClaimId);
  const adsEnabled = ENABLE_PREROLL_ADS && !authenticated && !embedded && approvedVideo;
  const [adUrl, setAdUrl, isFetchingAd] = useGetAds(approvedVideo, adsEnabled);
  /* isLoading was designed to show loading screen on first play press, rather than completely black screen, but
  breaks because some browsers (e.g. Firefox) block autoplay but leave the player.play Promise pending */
  const [isLoading, setIsLoading] = useState(false);

  const IS_IOS =
    (/iPad|iPhone|iPod/.test(navigator.platform) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !window.MSStream;

  console.log("RUNNING HERE PARENT VIEW.")

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

  const onEnded = React.useCallback(() => {
    analytics.videoIsPlaying(false);

    if (adUrl) {
      setAdUrl(null);
      return;
    }

    if (embedded) {
      setIsEndededEmbed(true);
    } else if (autoplaySetting) {
      setShowAutoplayCountdown(true);
    }

    clearPosition(uri);
  }, [embedded, setIsEndededEmbed, autoplaySetting, setShowAutoplayCountdown, adUrl, setAdUrl, clearPosition, uri]);

  function onPlay(player) {
    setIsLoading(false);
    setIsPlaying(true);
    setShowAutoplayCountdown(false);
    setIsEndededEmbed(false);
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

  let alreadyRunning = false;

  const onPlayerReady = useCallback((player: Player) => {
    console.log('already running');
    console.log(alreadyRunning)
    console.log(new Date())
    alreadyRunning = true;


    console.log("PLAYER READY CALLBACK")

    if (!embedded) {
      player.muted(muted);
      player.volume(volume);
      player.playbackRate(videoPlaybackRate);
      addTheaterModeButton(player, toggleVideoTheaterMode);
    }

    const shouldPlay = !embedded || autoplayIfEmbedded;

    // console.log('should play');
    // console.log(shouldPlay);

    // TODO: this is causing issues with videos starting randomly
    // https://blog.videojs.com/autoplay-best-practices-with-video-js/#Programmatic-Autoplay-and-Success-Failure-Detection
    if (shouldPlay) {
      console.log('starting video!');

      (async function() {
        try {
          console.log('is playing already');
          console.log(isPlaying);
          console.log('player');
          console.log(player);
          // console.log('is paused!');
          // console.log(player.paused());

          const isAlreadyPlaying = isPlaying;
          setIsPlaying(true);

          if (!isAlreadyPlaying) {
            console.log('STARTING PLAYER')
            const playerResponse = player.play();
            const isPaused = player.paused();
            // console.log(playerResponse)
            // await new Promise(resolve => setTimeout(resolve, 2000));
            // console.log(playerResponse);
            if (IS_IOS && isPaused) {
              document.getElementsByClassName('video-js--tap-to-unmute')[0].style.visibility = 'visible';
              player.muted(true);
              const iosResponse = player.play();

              await new Promise(resolve => setTimeout(resolve, 2000));
              console.log(iosResponse);
            }
          } else {
            console.log('ALREADY HAVE PLAYER, DISPOSING!!')
            player.dispose()
          }
          console.log('\n\n')

        } catch (err) {
          console.log(err);
        }
      })();
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
    player.on('ended', onEnded);
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
        'file-viewer--ended-embed': isEndededEmbed,
      })}
      onContextMenu={stopContextMenu}
    >
      {showAutoplayCountdown && <AutoplayCountdown uri={uri} />}
      {isEndededEmbed && <FileViewerEmbeddedEnded uri={uri} />}
      {embedded && !isEndededEmbed && <FileViewerEmbeddedTitle uri={uri} />}
      {/* disable this loading behavior because it breaks when player.play() promise hangs */}
      {/* {isLoading && <LoadingScreen status={__('Loading')} />} */}

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
          claimId={claimId}
          userId={userId}
          allowPreRoll={!embedded && !authenticated}
          shareTelemetry={shareTelemetry}
          showAutoplayCountdown={autoplaySetting}
        />
      )}
    </div>
  );
}

export default VideoViewer;
