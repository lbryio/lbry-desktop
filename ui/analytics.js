// @flow
import { Lbryio } from 'lbryinc';
import * as Sentry from '@sentry/browser';
import MatomoTracker from '@datapunt/matomo-tracker-js';
import { history } from './store';
import { SDK_API_PATH } from './index';
// @if TARGET='app'
import Native from 'native';
import ElectronCookies from '@exponent/electron-cookies';
import { generateInitialUrl } from 'util/url';
// @endif
import { MATOMO_ID, MATOMO_URL } from 'config';

const isProduction = process.env.NODE_ENV === 'production';
const devInternalApis = process.env.LBRY_API_URL && process.env.LBRY_API_URL.includes('dev');

export const SHARE_INTERNAL = 'shareInternal';
const SHARE_THIRD_PARTY = 'shareThirdParty';

// @if TARGET='app'
if (isProduction) {
  ElectronCookies.enable({
    origin: 'https://lbry.tv',
  });
}
// @endif

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
  videoStartEvent: (string, number) => void,
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
  ) => void,
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
// @if TARGET='app'
if (window.localStorage.getItem(SHARE_INTERNAL) === 'true') internalAnalyticsEnabled = true;
// if (window.localStorage.getItem(SHARE_THIRD_PARTY) === 'true') thirdPartyAnalyticsEnabled = true;
// @endif

/**
 * Determine the mobile device type viewing the data
 * This function returns one of 'and' (Android), 'ios', or 'web'.
 *
 * @returns {String}
 */
function getDeviceType() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(userAgent)) {
    return 'and';
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios';
  }

  // default as web, this can be optimized
  return 'web';
}

var durationInSeconds = 10;
var amountOfBufferEvents = 0;
var amountOfBufferTimeInMS = 0;
var videoType, userId, claimUrl, playerPoweredBy, timeAtBuffer, videoPlayer;

async function sendAndResetWatchmanData() {
  var protocol;
  if (videoType === 'application/x-mpegURL') {
    protocol = 'hls';
  } else {
    protocol = 'stb';
  }

  console.log(claimUrl);

  timeAtBuffer = Math.round(videoPlayer.currentTime()) * 1000;

  var totalDurationInSeconds = Math.round(videoPlayer.duration());

  const objectToSend = {
    rebuf_count: amountOfBufferEvents,
    rebuf_duration: amountOfBufferTimeInMS,
    url: claimUrl.replace('lbry://', ''),
    device: getDeviceType(),
    duration: Math.round(durationInSeconds) * 1000,
    protocol,
    player: playerPoweredBy,
    user_id: userId.toString(),
    position: Math.round(timeAtBuffer),
    rel_position: Math.round((timeAtBuffer / (totalDurationInSeconds * 1000)) * 100),
  };

  await sendWatchmanData(objectToSend);

  amountOfBufferEvents = 0;
  amountOfBufferTimeInMS = 0;
  timeAtBuffer = null;
}

var watchmanInterval;
function stopWatchmanInterval() {
  console.log('turning off watchman interval');
  clearInterval(watchmanInterval);
  watchmanInterval = null;
}
function startWatchmanIntervalIfNotRunning() {
  console.log('turning on watchman interval');
  if (!watchmanInterval) {
    console.log('watchman interval turned back on');
    watchmanInterval = setInterval(sendAndResetWatchmanData, 1000 * durationInSeconds);
  }
}

async function sendWatchmanData(body) {
  try {
    const response = await fetch('https://watchman.na-backend.odysee.com/reports/playback', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return response;
  } catch (err) {
    console.log(err);
  }
}

const analytics: Analytics = {
  videoBufferEvent: async (claim, data) => {
    console.log('BUFFERING!');

    amountOfBufferEvents = amountOfBufferEvents + 1;
    amountOfBufferTimeInMS = amountOfBufferTimeInMS + data.bufferDuration;

    timeAtBuffer = data.timeAtBuffer;
  },
  onDispose: () => {
    stopWatchmanInterval();
    // TODO: clear data here
  },
  videoIsPlaying: (isPlaying, passedPlayer) => {
    // have to use this because videojs pauses/unpauses during seek
    // sometimes the seeking function isn't populated yet so check for it as well
    if (passedPlayer && passedPlayer.seeking) {
      var playerIsSeeking = passedPlayer.seeking();
    }

    // if player isn't seeking it's not a seeking caused start or pause
    if (!playerIsSeeking) {
      // if it's a play signal, start tracking
      if (isPlaying) {
        startWatchmanIntervalIfNotRunning();
        // if it's a stop signal, stop tracking
      } else {
        stopWatchmanInterval();
      }
    }
  },
  videoStartEvent: (claimId, duration, poweredBy, passedUserId, canonicalUrl, passedPlayer) => {
    console.log('Video start');
    userId = passedUserId;
    claimUrl = canonicalUrl;
    playerPoweredBy = poweredBy;

    videoType = passedPlayer.currentSource().type;
    videoPlayer = passedPlayer;

    console.log(userId, canonicalUrl, playerPoweredBy);

    // TODO: add claim url , userId
    sendPromMetric('time_to_start', duration);
    sendMatomoEvent('Media', 'TimeToStart', claimId, duration);
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
      const params: { href: string, customDimensions?: Array<{ id: number, value: ?string }> } = { href: `${path}` };
      const dimensions = [];
      const searchParams = search && new URLSearchParams(search);

      if (searchParams && searchParams.get('src')) {
        dimensions.push({ id: 1, value: searchParams.get('src') });
      }
      if (dimensions.length) {
        params['customDimensions'] = dimensions;
      }
      MatomoInstance.trackPageView(params);
    }
  },
  setUser: (userId) => {
    if (internalAnalyticsEnabled && userId) {
      window._paq.push(['setUserId', String(userId)]);
      // @if TARGET='app'
      Native.getAppVersionInfo().then(({ localVersion }) => {
        sendMatomoEvent('Version', 'Desktop-Version', localVersion);
      });
      // @endif
    }
  },
  toggleInternal: (enabled: boolean): void => {
    // Always collect analytics on lbry.tv
    // @if TARGET='app'
    internalAnalyticsEnabled = enabled;
    window.localStorage.setItem(SHARE_INTERNAL, enabled);
    // @endif
  },

  toggleThirdParty: (enabled: boolean): void => {
    // Always collect analytics on lbry.tv
    // @if TARGET='app'
    // thirdPartyAnalyticsEnabled = enabled;
    window.localStorage.setItem(SHARE_THIRD_PARTY, enabled);
    // @endif
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
    sendMatomoEvent('Media', 'AdsFetched');
  },
  adsReceivedEvent: (response) => {
    sendMatomoEvent('Media', 'AdsReceived', JSON.stringify(response));
  },
  adsErrorEvent: (response) => {
    sendMatomoEvent('Media', 'AdsError', JSON.stringify(response));
  },
  playerLoadedEvent: (embedded) => {
    sendMatomoEvent('Player', 'Loaded', embedded ? 'embedded' : 'onsite');
  },
  playerStartedEvent: (embedded) => {
    sendMatomoEvent('Player', 'Started', embedded ? 'embedded' : 'onsite');
  },
  tagFollowEvent: (tag, following) => {
    sendMatomoEvent('Tag', following ? 'Tag-Follow' : 'Tag-Unfollow', tag);
  },
  channelBlockEvent: (uri, blocked, location) => {
    sendMatomoEvent(blocked ? 'Channel-Hidden' : 'Channel-Unhidden', uri);
  },
  emailProvidedEvent: () => {
    sendMatomoEvent('Engagement', 'Email-Provided');
  },
  emailVerifiedEvent: () => {
    sendMatomoEvent('Engagement', 'Email-Verified');
  },
  rewardEligibleEvent: () => {
    sendMatomoEvent('Engagement', 'Reward-Eligible');
  },
  openUrlEvent: (url: string) => {
    sendMatomoEvent('Engagement', 'Open-Url', url);
  },
  trendingAlgorithmEvent: (trendingAlgorithm: string) => {
    sendMatomoEvent('Engagement', 'Trending-Algorithm', trendingAlgorithm);
  },
  startupEvent: () => {
    sendMatomoEvent('Startup', 'Startup');
  },
  readyEvent: (timeToReady: number) => {
    sendMatomoEvent('Startup', 'App-Ready', 'Time', timeToReady);
  },
  purchaseEvent: (purchaseInt: number) => {
    sendMatomoEvent('Purchase', 'Purchase-Complete', 'someLabel', purchaseInt);
  },
};

function sendMatomoEvent(category, action, name, value) {
  if (internalAnalyticsEnabled) {
    const event = { category, action, name, value };
    MatomoInstance.trackEvent(event);
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

const MatomoInstance = new MatomoTracker({
  urlBase: MATOMO_URL,
  siteId: MATOMO_ID, // optional, default value: `1`
  // heartBeat: { // optional, enabled by default
  //   active: true, // optional, default value: true
  //   seconds: 10 // optional, default value: `15
  // },
  // linkTracking: false // optional, default value: true
});

// Manually call the first page view
// React Router doesn't include this on `history.listen`
// @if TARGET='web'
analytics.pageView(window.location.pathname + window.location.search, window.location.search);
// @endif

// @if TARGET='app'
analytics.pageView(
  window.location.pathname.split('.html')[1] + window.location.search || generateInitialUrl(window.location.hash)
);
// @endif;

// Listen for url changes and report
// This will include search queries
history.listen((location) => {
  const { pathname, search } = location;

  const page = `${pathname}${search}`;
  analytics.pageView(page, search);
});

export default analytics;
