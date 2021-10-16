// @flow
import { Lbryio } from 'lbryinc';
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';
import { history } from './store';
import { SDK_API_PATH } from './index';
// import getConnectionSpeed from 'util/detect-user-bandwidth';

// let userDownloadBandwidthInBitsPerSecond;
// async function getUserBandwidth() {
//   userDownloadBandwidthInBitsPerSecond = await getConnectionSpeed();
// }

// get user bandwidth every minute, starting after an initial one minute wait
// setInterval(getUserBandwidth, 1000 * 60);

const isProduction = process.env.NODE_ENV === 'production';
const devInternalApis = process.env.LBRY_API_URL && process.env.LBRY_API_URL.includes('dev');
const ODYSEE_UA_ID = 'UA-60403362-12';

export const SHARE_INTERNAL = 'shareInternal';

const WATCHMAN_BACKEND_ENDPOINT = 'https://watchman.na-backend.odysee.com/reports/playback';
const SEND_DATA_TO_WATCHMAN_INTERVAL = 10; // in seconds

type Analytics = {
  error: (string) => Promise<any>,
  sentryError: ({} | string, {}) => Promise<any>,
  pageView: (string, ?string) => void,
  setUser: (Object) => void,
  toggleInternal: (boolean, ?boolean) => void,
  apiLogView: (string, string, string, ?number, ?() => void) => Promise<any>,
  apiLogPublish: (ChannelClaim | StreamClaim) => void,
  apiSyncTags: ({}) => void,
  tagFollowEvent: (string, boolean, ?string) => void,
  playerLoadedEvent: (?boolean) => void,
  playerStartedEvent: (?boolean) => void,
  videoStartEvent: (string, number, string, number, string, any, number) => void,
  videoIsPlaying: (boolean, any) => void,
  videoBufferEvent: (
    StreamClaim,
    {
      timeAtBuffer: number,
      bufferDuration: number,
      bitRate: number,
      duration: number,
      userId: string,
      playerPoweredBy: string,
      readyState: number,
    }
  ) => Promise<any>,
  adsFetchedEvent: () => void,
  adsReceivedEvent: (any) => void,
  adsErrorEvent: (any) => void,
  emailProvidedEvent: () => void,
  emailVerifiedEvent: () => void,
  rewardEligibleEvent: () => void,
  startupEvent: () => void,
  purchaseEvent: (number) => void,
  readyEvent: (number) => void,
  openUrlEvent: (string) => void,
};

type LogPublishParams = {
  uri: string,
  claim_id: string,
  outpoint: string,
  channel_claim_id?: string,
};

let internalAnalyticsEnabled: boolean = IS_WEB || false;
// let thirdPartyAnalyticsEnabled: boolean = IS_WEB || false;

/**
 * Determine the mobile device type viewing the data
 * This function returns one of 'and' (Android), 'ios', or 'web'.
 *
 * @returns {String}
 */
function getDeviceType() {
  // We may not care what the device is if it's in a web browser. Commenting out for now.
  // if (!IS_WEB) {
  //   return 'elt';
  // }
  // const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  //
  // if (/android/i.test(userAgent)) {
  //   return 'adr';
  // }
  //
  // // iOS detection from: http://stackoverflow.com/a/9039885/177710
  // if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
  //   return 'ios';
  // }

  // default as web, this can be optimized
  if (!IS_WEB) {
    return 'dsk';
  }
  return 'web';
}
// variables initialized for watchman
let amountOfBufferEvents = 0;
let amountOfBufferTimeInMS = 0;
let videoType, userId, claimUrl, playerPoweredBy, videoPlayer, bitrateAsBitsPerSecond;
let lastSentTime;

// calculate data for backend, send them, and reset buffer data for next interval
async function sendAndResetWatchmanData() {
  if (!userId) {
    return 'Can only be used with a user id';
  }

  if (!videoPlayer) {
    return 'Video player not initialized';
  }

  let timeSinceLastIntervalSend = new Date() - lastSentTime;
  lastSentTime = new Date();

  let protocol;
  if (videoType === 'application/x-mpegURL') {
    protocol = 'hls';
    // get bandwidth if it exists from the texttrack (so it's accurate if user changes quality)
    // $FlowFixMe
    bitrateAsBitsPerSecond = videoPlayer.textTracks?.().tracks_[0]?.activeCues[0]?.value?.bandwidth;
  } else {
    protocol = 'stb';
  }

  // current position in video in MS
  const positionInVideo = Math.round(videoPlayer.currentTime()) * 1000;

  // get the duration marking the time in the video for relative position calculation
  const totalDurationInSeconds = Math.round(videoPlayer.duration());

  // build object for watchman backend
  const objectToSend = {
    rebuf_count: amountOfBufferEvents,
    rebuf_duration: amountOfBufferTimeInMS,
    url: claimUrl.replace('lbry://', ''),
    device: getDeviceType(),
    duration: timeSinceLastIntervalSend,
    protocol,
    player: playerPoweredBy,
    user_id: userId.toString(),
    position: Math.round(positionInVideo),
    rel_position: Math.round((positionInVideo / (totalDurationInSeconds * 1000)) * 100),
    bitrate: bitrateAsBitsPerSecond,
    bandwidth: undefined,
    // ...(userDownloadBandwidthInBitsPerSecond && {bandwidth: userDownloadBandwidthInBitsPerSecond}), // add bandwidth if populated
  };

  // post to watchman
  await sendWatchmanData(objectToSend);

  // reset buffer data
  amountOfBufferEvents = 0;
  amountOfBufferTimeInMS = 0;
}

let watchmanInterval;
// clear watchman interval and mark it as null (when video paused)
function stopWatchmanInterval() {
  clearInterval(watchmanInterval);
  watchmanInterval = null;
}

// creates the setInterval that will run send to watchman on recurring basis
function startWatchmanIntervalIfNotRunning() {
  if (!watchmanInterval) {
    // instantiate the first time to calculate duration from
    lastSentTime = new Date();

    // only set an interval if analytics are enabled and is prod
    if (isProduction && IS_WEB) {
      watchmanInterval = setInterval(sendAndResetWatchmanData, 1000 * SEND_DATA_TO_WATCHMAN_INTERVAL);
    }
  }
}

// post data to the backend
async function sendWatchmanData(body) {
  try {
    const response = await fetch(WATCHMAN_BACKEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return response;
  } catch (err) {
    console.log('ERROR FROM WATCHMAN BACKEND');
    console.log(err);
  }
}

const analytics: Analytics = {
  // receive buffer events from tracking plugin and save buffer amounts and times for backend call
  videoBufferEvent: async (claim, data) => {
    amountOfBufferEvents = amountOfBufferEvents + 1;
    amountOfBufferTimeInMS = amountOfBufferTimeInMS + data.bufferDuration;
  },
  onDispose: () => {
    stopWatchmanInterval();
  },
  /**
   * Is told whether video is being started or paused, and adjusts interval accordingly
   * @param {boolean} isPlaying - Whether video was started or paused
   * @param {object} passedPlayer - VideoJS Player object
   */
  videoIsPlaying: (isPlaying, passedPlayer) => {
    let playerIsSeeking = false;
    // have to use this because videojs pauses/unpauses during seek
    // sometimes the seeking function isn't populated yet so check for it as well
    if (passedPlayer && passedPlayer.seeking) {
      playerIsSeeking = passedPlayer.seeking();
    }

    // if being paused, and not seeking, send existing data and stop interval
    if (!isPlaying && !playerIsSeeking) {
      sendAndResetWatchmanData();
      stopWatchmanInterval();
      // if being told to pause, and seeking, send and restart interval
    } else if (!isPlaying && playerIsSeeking) {
      sendAndResetWatchmanData();
      stopWatchmanInterval();
      startWatchmanIntervalIfNotRunning();
      // is being told to play, and seeking, don't do anything,
      // assume it's been started already from pause
    } else if (isPlaying && playerIsSeeking) {
      // start but not a seek, assuming a start from paused content
    } else if (isPlaying && !playerIsSeeking) {
      startWatchmanIntervalIfNotRunning();
    }
  },
  videoStartEvent: (claimId, timeToStartVideo, poweredBy, passedUserId, canonicalUrl, passedPlayer, videoBitrate) => {
    // populate values for watchman when video starts
    userId = passedUserId;
    claimUrl = canonicalUrl;
    playerPoweredBy = poweredBy;

    videoType = passedPlayer.currentSource().type;
    videoPlayer = passedPlayer;
    bitrateAsBitsPerSecond = videoBitrate;

    sendPromMetric('time_to_start', timeToStartVideo);
    sendGaEvent('Media', 'TimeToStart', claimId, timeToStartVideo);
  },
  error: (message) => {
    return new Promise((resolve) => {
      if (internalAnalyticsEnabled && isProduction) {
        return Lbryio.call('event', 'desktop_error', { error_message: message }).then(() => {
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
  },
  sentryError: (error, errorInfo) => {
    return new Promise((resolve) => {
      if (internalAnalyticsEnabled && isProduction) {
        Sentry.withScope((scope) => {
          scope.setExtras(errorInfo);
          const eventId = Sentry.captureException(error);
          resolve(eventId);
        });
      } else {
        resolve(null);
      }
    });
  },
  pageView: (path, search) => {
    if (internalAnalyticsEnabled) {
      ReactGA.pageview(path);
    }
  },
  setUser: (userId) => {
    if (internalAnalyticsEnabled && userId) {
      ReactGA.set({
        userId,
      });
    }
  },
  toggleInternal: (enabled: boolean): void => {
    // Always collect analytics on Odysee for now.
  },

  toggleThirdParty: (enabled: boolean): void => {
    // Always collect analytics on Odysee for now.
  },

  apiLogView: (uri, outpoint, claimId, timeToStart) => {
    return new Promise((resolve, reject) => {
      if (internalAnalyticsEnabled && (isProduction || devInternalApis)) {
        const params: {
          uri: string,
          outpoint: string,
          claim_id: string,
          time_to_start?: number,
        } = {
          uri,
          outpoint,
          claim_id: claimId,
        };

        // lbry.tv streams from AWS so we don't care about the time to start
        if (timeToStart && !IS_WEB) {
          params.time_to_start = timeToStart;
        }

        resolve(Lbryio.call('file', 'view', params));
      } else {
        resolve();
      }
    });
  },
  apiLogSearch: () => {
    if (internalAnalyticsEnabled && isProduction) {
      Lbryio.call('event', 'search');
    }
  },
  apiLogPublish: (claimResult: ChannelClaim | StreamClaim) => {
    // Don't check if this is production so channels created on localhost are still linked to user
    if (internalAnalyticsEnabled) {
      const { permanent_url: uri, claim_id: claimId, txid, nout, signing_channel: signingChannel } = claimResult;
      let channelClaimId;
      if (signingChannel) {
        channelClaimId = signingChannel.claim_id;
      }
      const outpoint = `${txid}:${nout}`;
      const params: LogPublishParams = { uri, claim_id: claimId, outpoint };
      if (channelClaimId) {
        params['channel_claim_id'] = channelClaimId;
      }

      Lbryio.call('event', 'publish', params);
    }
  },

  apiSyncTags: (params) => {
    if (internalAnalyticsEnabled && isProduction) {
      Lbryio.call('content_tags', 'sync', params);
    }
  },
  adsFetchedEvent: () => {
    sendGaEvent('Media', 'AdsFetched');
  },
  adsReceivedEvent: (response) => {
    sendGaEvent('Media', 'AdsReceived', JSON.stringify(response));
  },
  adsErrorEvent: (response) => {
    sendGaEvent('Media', 'AdsError', JSON.stringify(response));
  },
  playerLoadedEvent: (embedded) => {
    sendGaEvent('Player', 'Loaded', embedded ? 'embedded' : 'onsite');
  },
  playerStartedEvent: (embedded) => {
    sendGaEvent('Player', 'Started', embedded ? 'embedded' : 'onsite');
  },
  tagFollowEvent: (tag, following) => {
    sendGaEvent('Tag', following ? 'Tag-Follow' : 'Tag-Unfollow', tag);
  },
  channelBlockEvent: (uri, blocked, location) => {
    sendGaEvent(blocked ? 'Channel-Hidden' : 'Channel-Unhidden', uri);
  },
  emailProvidedEvent: () => {
    sendGaEvent('Engagement', 'Email-Provided');
  },
  emailVerifiedEvent: () => {
    sendGaEvent('Engagement', 'Email-Verified');
  },
  rewardEligibleEvent: () => {
    sendGaEvent('Engagement', 'Reward-Eligible');
  },
  openUrlEvent: (url: string) => {
    sendGaEvent('Engagement', 'Open-Url', url);
  },
  trendingAlgorithmEvent: (trendingAlgorithm: string) => {
    sendGaEvent('Engagement', 'Trending-Algorithm', trendingAlgorithm);
  },
  startupEvent: () => {
    sendGaEvent('Startup', 'Startup');
  },
  readyEvent: (timeToReady: number) => {
    sendGaEvent('Startup', 'App-Ready');
    sendGaTimingEvent('Startup', 'App-Ready', timeToReady);
  },
  purchaseEvent: (purchaseInt: number) => {
    sendGaEvent('Purchase', 'Purchase-Complete', undefined, purchaseInt);
  },
};

function sendGaEvent(category, action, label, value) {
  if (internalAnalyticsEnabled && isProduction) {
    ReactGA.event({
      category,
      action,
      ...(label ? { label } : {}),
      ...(value ? { value } : {}),
    });
  }
}

function sendGaTimingEvent(category: string, action: string, timeInMs: number, label?: string) {
  if (internalAnalyticsEnabled && isProduction) {
    ReactGA.timing({
      category,
      variable: action,
      value: timeInMs,
      ...(label ? { label } : {}),
    });
  }
}

function sendPromMetric(name: string, value?: number) {
  if (IS_WEB) {
    let url = new URL(SDK_API_PATH + '/metric/ui');
    const params = { name: name, value: value ? value.toString() : '' };
    url.search = new URLSearchParams(params).toString();
    return fetch(url, { method: 'post' });
  }
}

const gaTrackers = [{ trackingId: ODYSEE_UA_ID }];

ReactGA.initialize(gaTrackers, {
  testMode: process.env.NODE_ENV !== 'production',
  cookieDomain: 'auto',
  siteSpeedSampleRate: 100,
  // un-comment to see events as they are sent to google
  // debug: true,
});

// Manually call the first page view
// React Router doesn't include this on `history.listen`
analytics.pageView(window.location.pathname + window.location.search, window.location.search);

// Listen for url changes and report
// This will include search queries
history.listen((location) => {
  const { pathname, search } = location;

  const page = `${pathname}${search}`;
  analytics.pageView(page, search);
});

export default analytics;
