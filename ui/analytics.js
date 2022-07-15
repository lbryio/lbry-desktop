// @flow
import { Lbryio } from 'lbryinc';
import * as Sentry from '@sentry/browser';
import * as RENDER_MODES from 'constants/file_render_modes';
import { SDK_API_PATH } from 'config';

// --- GA ---
// - Events: 500 max (cannot be deleted).
// - Dimensions: 25 max (cannot be deleted, but can be "archived"). Usually
//               tied to an event parameter for reporting purposes.
//
// Given the limitations above, we need to plan ahead before adding new Events
// and Parameters.
//
// Events:
// - Find a Recommended Event that is closest to what you need.
//   https://support.google.com/analytics/answer/9267735?hl=en
// - If doesn't exist, use a Custom Event.
//
// Parameters:
// - Custom parameters don't appear in automated reports until they are tied to
//   a Dimension.
// - Add your entry to GA_DIMENSIONS below -- tt allows us to keep track so that
//   we don't exceed the limit. Re-use existing parameters if possible.
// - Register the Dimension in GA Console to make it visible in reports.

export const GA_DIMENSIONS = {
  TYPE: 'type',
  ACTION: 'action',
  VALUE: 'value',
  START_TIME_MS: 'start_time_ms',
  DURATION_MS: 'duration_ms',
  END_TIME_MS: 'end_time_ms',
};

// import getConnectionSpeed from 'util/detect-user-bandwidth';

// let userDownloadBandwidthInBitsPerSecond;
// async function getUserBandwidth() {
//   userDownloadBandwidthInBitsPerSecond = await getConnectionSpeed();
// }

// get user bandwidth every minute, starting after an initial one minute wait
// setInterval(getUserBandwidth, 1000 * 60);

const isProduction = process.env.NODE_ENV === 'production';
const devInternalApis = process.env.LBRY_API_URL && process.env.LBRY_API_URL.includes('dev');

const WATCHMAN_BACKEND_ENDPOINT = 'https://watchman.na-backend.odysee.com/reports/playback';
const SEND_DATA_TO_WATCHMAN_INTERVAL = 10; // in seconds

type Analytics = {
  appStartTime: number,
  eventStartTime: any,
  error: (string) => Promise<any>,
  sentryError: ({} | string, {}) => Promise<any>,
  setUser: (Object) => void,
  toggleInternal: (boolean, ?boolean) => void,
  apiLogView: (string, string, string, ?number, ?() => void) => Promise<any>,
  apiLogPublish: (ChannelClaim | StreamClaim) => void,
  tagFollowEvent: (string, boolean, ?string) => void,
  playerLoadedEvent: (string, ?boolean) => void,
  playerVideoStartedEvent: (?boolean) => void,
  videoStartEvent: (?string, number, string, ?number, string, any, ?number, boolean) => void,
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
      isLivestream: boolean,
    }
  ) => Promise<any>,
  adsFetchedEvent: () => void,
  emailProvidedEvent: () => void,
  emailVerifiedEvent: () => void,
  rewardEligibleEvent: () => void,
  initAppStartTime: (startTime: number) => void,
  startupEvent: (time: number) => void,
  eventStarted: (name: string, time: number, id?: string) => void,
  eventCompleted: (name: string, time: number, id?: string) => void,
  purchaseEvent: (number) => void,
  openUrlEvent: (string) => void,
  reportEvent: (string, any) => void,
};

type LogPublishParams = {
  uri: string,
  claim_id: string,
  outpoint: string,
  channel_claim_id?: string,
};

let internalAnalyticsEnabled: boolean = IS_WEB || false;
// let thirdPartyAnalyticsEnabled: boolean = IS_WEB || false;

const isGaAllowed = internalAnalyticsEnabled && isProduction;

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
let videoType, userId, claimUrl, playerPoweredBy, videoPlayer, bitrateAsBitsPerSecond, isLivestream;
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
  if (videoType === 'application/x-mpegURL' && !isLivestream) {
    protocol = 'hls';
    // get bandwidth if it exists from the texttrack (so it's accurate if user changes quality)
    // $FlowFixMe
    bitrateAsBitsPerSecond = videoPlayer.tech(true).vhs?.playlists?.media?.().attributes?.BANDWIDTH;
  } else if (isLivestream) {
    protocol = 'lvs';
    // $FlowFixMe
    bitrateAsBitsPerSecond = videoPlayer.tech(true).vhs?.playlists?.media?.().attributes?.BANDWIDTH;
  } else {
    protocol = 'stb';
  }

  // current position in video in MS
  const positionInVideo = isLivestream ? 0 : videoPlayer && Math.round(videoPlayer.currentTime()) * 1000;

  // get the duration marking the time in the video for relative position calculation
  const totalDurationInSeconds = isLivestream ? 0 : videoPlayer && Math.round(videoPlayer.duration());

  // temp: if buffering over the interval, the duration doesn't reset since we don't get an event
  if (amountOfBufferTimeInMS > timeSinceLastIntervalSend) amountOfBufferTimeInMS = timeSinceLastIntervalSend;

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
    position: isLivestream ? 0 : Math.round(positionInVideo),
    rel_position: isLivestream ? 0 : Math.round((positionInVideo / (totalDurationInSeconds * 1000)) * 100),
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
  } catch (err) {}
}

const analytics: Analytics = {
  appStartTime: 0,
  eventStartTime: {},

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
  videoStartEvent: (
    claimId,
    timeToStartVideo,
    poweredBy,
    passedUserId,
    canonicalUrl,
    passedPlayer,
    videoBitrate,
    isLivestreamClaim
  ) => {
    // populate values for watchman when video starts
    userId = passedUserId;
    claimUrl = canonicalUrl;
    playerPoweredBy = poweredBy;
    isLivestream = isLivestreamClaim;

    videoType = passedPlayer.currentSource().type;
    videoPlayer = passedPlayer;
    bitrateAsBitsPerSecond = videoBitrate;
    !isLivestreamClaim && sendPromMetric('time_to_start', timeToStartVideo, playerPoweredBy);
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
  setUser: (userId) => {
    if (isGaAllowed && userId && window.gtag) {
      window.gtag('set', { user_id: userId });
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
  adsFetchedEvent: () => {
    sendGaEvent('ad_fetched');
  },
  playerLoadedEvent: (renderMode, embedded) => {
    const RENDER_MODE_TO_EVENT = (renderMode) => {
      switch (renderMode) {
        case RENDER_MODES.VIDEO:
          return 'loaded_video';
        case RENDER_MODES.AUDIO:
          return 'loaded_audio';
        case RENDER_MODES.MARKDOWN:
          return 'loaded_markdown';
        case RENDER_MODES.IMAGE:
          return 'loaded_image';
        case 'livestream':
          return 'loaded_livestream';
        default:
          return 'loaded_misc';
      }
    };

    sendGaEvent('player', {
      [GA_DIMENSIONS.ACTION]: RENDER_MODE_TO_EVENT(renderMode),
      [GA_DIMENSIONS.TYPE]: embedded ? 'embedded' : 'onsite',
    });
  },
  playerVideoStartedEvent: (embedded) => {
    sendGaEvent('player', {
      [GA_DIMENSIONS.ACTION]: 'started_video',
      [GA_DIMENSIONS.TYPE]: embedded ? 'embedded' : 'onsite',
    });
  },
  tagFollowEvent: (tag, following) => {
    sendGaEvent('tags', {
      [GA_DIMENSIONS.ACTION]: following ? 'follow' : 'unfollow',
      [GA_DIMENSIONS.VALUE]: tag,
    });
  },
  emailProvidedEvent: () => {
    sendGaEvent('engagement', {
      [GA_DIMENSIONS.TYPE]: 'email_provided',
    });
  },
  emailVerifiedEvent: () => {
    sendGaEvent('engagement', {
      [GA_DIMENSIONS.TYPE]: 'email_verified',
    });
  },
  rewardEligibleEvent: () => {
    sendGaEvent('engagement', {
      [GA_DIMENSIONS.TYPE]: 'reward_eligible',
    });
  },
  openUrlEvent: (url: string) => {
    sendGaEvent('engagement', {
      [GA_DIMENSIONS.TYPE]: 'open_url',
      url,
    });
  },
  trendingAlgorithmEvent: (trendingAlgorithm: string) => {
    sendGaEvent('engagement', {
      [GA_DIMENSIONS.TYPE]: 'trending_algorithm',
      trending_algorithm: trendingAlgorithm,
    });
  },
  initAppStartTime: (startTime: number) => {
    analytics.appStartTime = startTime;
  },
  startupEvent: (time: number) => {
    if (analytics.appStartTime !== 0) {
      sendGaEvent('diag_app_ready', {
        [GA_DIMENSIONS.DURATION_MS]: time - analytics.appStartTime,
      });
    }
  },
  eventStarted: (name: string, time: number, id?: string) => {
    const key = id || name;
    analytics.eventStartTime[key] = time;
  },
  eventCompleted: (name: string, time: number, id?: string) => {
    const key = id || name;
    if (analytics.eventStartTime[key]) {
      sendGaEvent(name, {
        [GA_DIMENSIONS.START_TIME_MS]: analytics.eventStartTime[key] - analytics.appStartTime,
        [GA_DIMENSIONS.DURATION_MS]: time - analytics.eventStartTime[key],
        [GA_DIMENSIONS.END_TIME_MS]: time - analytics.appStartTime,
      });

      delete analytics.eventStartTime[key];
    }
  },
  purchaseEvent: (purchaseInt: number) => {
    sendGaEvent('purchase', {
      // https://developers.google.com/analytics/devguides/collection/ga4/reference/events#purchase
      [GA_DIMENSIONS.VALUE]: purchaseInt,
    });
  },
  reportEvent: (event: string, params?: { [string]: string | number }) => {
    sendGaEvent(event, params);
  },
};

function sendGaEvent(event: string, params?: { [string]: string | number }) {
  if (isGaAllowed && window.gtag) {
    window.gtag('event', event, params);
  }
}

function sendPromMetric(name: string, value?: number, player: string) {
  if (IS_WEB) {
    let url = new URL(SDK_API_PATH + '/metric/ui');
    const params = { name: name, value: value ? value.toString() : '', player: player };
    url.search = new URLSearchParams(params).toString();
    return fetch(url, { method: 'post' }).catch(function (error) {});
  }
}

// Activate
if (isGaAllowed && window.gtag) {
  window.gtag('consent', 'update', {
    ad_storage: 'granted',
    analytics_storage: 'granted',
  });
}

export default analytics;
