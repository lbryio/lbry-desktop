// @flow
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
import { VASTClient } from 'vast-client';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';
import { useHistory } from 'react-router';

const PLAY_TIMEOUT_ERROR = 'play_timeout_error';

// Ignores any call made 1 minutes or less after the last successful ad
const ADS_CAP_LEVEL = 1 * 60 * 1000;
const vastClient = new VASTClient(0, ADS_CAP_LEVEL);

type Props = {
  position: number,
  changeVolume: number => void,
  changeMute: boolean => void,
  source: string,
  contentType: string,
  thumbnail: string,
  claim: StreamClaim,
  muted: boolean,
  volume: number,
  uri: string,
  autoplaySetting: boolean,
  autoplayIfEmbedded: boolean,
  desktopPlayStartTime?: number,
  doAnalyticsView: (string, number) => Promise<any>,
  doAnalyticsBuffer: (string, any) => void,
  claimRewards: () => void,
  savePosition: (string, number) => void,
  clearPosition: string => void,
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
  const [adUrl, setAdUrl] = useState();

  const approvedVideo = Boolean(channelClaimId) && adApprovedChannelIds.includes(channelClaimId);
  const adsEnabled = !authenticated && !embedded && approvedVideo;
  const [ready, setReady] = useState(!adsEnabled);

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

  function doTrackingBuffered(e: Event, data: any) {
    fetch(source, { method: 'HEAD' }).then(response => {
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

  const playerReadyDependencyList = [uri, adUrl, embedded, autoplayIfEmbedded];
  if (!IS_WEB) {
    playerReadyDependencyList.push(desktopPlayStartTime);
  }

  const onPlayerReady = useCallback((player: Player) => {
    if (!embedded) {
      player.muted(muted);
      player.volume(volume);
    }

    const shouldPlay = !embedded || autoplayIfEmbedded;
    // https://blog.videojs.com/autoplay-best-practices-with-video-js/#Programmatic-Autoplay-and-Success-Failure-Detection
    if (shouldPlay) {
      const playPromise = player.play();
      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => reject(PLAY_TIMEOUT_ERROR), 2000);
      });

      Promise.race([playPromise, timeoutPromise]).catch(error => {
        if (PLAY_TIMEOUT_ERROR) {
          const retryPlayPromise = player.play();
          Promise.race([retryPlayPromise, timeoutPromise]).catch(error => {
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
    player.on('tracking:buffered', doTrackingBuffered);
    player.on('tracking:firstplay', doTrackingFirstPlay);
    player.on('ended', onEnded);
    player.on('play', onPlay);
    player.on('pause', () => {
      setIsPlaying(false);
      handlePosition(player);
    });
    player.on('error', function() {
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

    if (position) {
      player.currentTime(position);
    }
    player.on('dispose', () => {
      handlePosition(player);
    });
  }, playerReadyDependencyList);

  // Fetch ads for everyone because unruly needs more traffic
  // Only show ads with `setAdUrl` when they are enabled
  React.useEffect(() => {
    if (approvedVideo) {
      analytics.adsFetchedEvent();
      const url = `https://tag.targeting.unrulymedia.com/rmp/216276/0/vast2?vastfw=vpaid&url=${encodeURI(
        window.location.href
      )}&w=300&h=500`;

      let adsReturned = false;
      vastClient
        .get(url)
        .then(res => {
          if (res.ads.length > 0) {
            analytics.adsReceivedEvent(res);
            adsReturned = true;
          }

          if (adsEnabled) {
            // Let this line error if res.ads is empty
            // I took this from an example response from Dailymotion
            // It will be caught below and sent to matomo to figure out if there if this needs to be something changed to deal with unrulys data
            const adUrl = res.ads[0].creatives[0].mediaFiles[0].fileURL;

            if (adUrl) {
              setAdUrl(adUrl);
            }

            setReady(true);
          }
        })
        .catch(e => {
          setReady(true);

          if (adsEnabled) {
            if (adsReturned) {
              analytics.adsErrorEvent(e);
            }
          }
        });
    }
  }, [uri, approvedVideo, adsEnabled, setAdUrl]);

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

      {ready && adUrl && (
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
              %sign_up% to turn ads off. This video will keep playing.
            </I18nMessage>
          </span>
        </>
      )}
      {ready && (
        <VideoJs
          adUrl={adUrl}
          source={source}
          isAudio={isAudio}
          poster={isAudio || (embedded && !autoplayIfEmbedded) ? thumbnail : null}
          sourceType={forcePlayer ? 'video/mp4' : contentType}
          onPlayerReady={onPlayerReady}
          startMuted={autoplayIfEmbedded}
        />
      )}
    </div>
  );
}

export default VideoViewer;
