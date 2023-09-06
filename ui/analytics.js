// @flow
/*
  Removed Watchman (internal view tracking) code.
  This file may eventually implement cantina
  Refer to 0cc0e213a5c5bf9e2a76316df5d9da4b250a13c3 for initial integration commit
  refer to ___ for removal commit.
 */

import { Lbryio } from 'lbryinc';
import * as Sentry from '@sentry/browser';
import MatomoTracker from '@datapunt/matomo-tracker-js';
import { history } from './store';
import Native from 'native';
import ElectronCookies from '@meetfranz/electron-cookies';
import { generateInitialUrl } from 'util/url';
import { MATOMO_ID, MATOMO_URL } from 'config';

const isProduction = process.env.NODE_ENV === 'production';
const devInternalApis = process.env.LBRY_API_URL && process.env.LBRY_API_URL.includes('dev');

export const SHARE_INTERNAL = 'shareInternal';
const SHARE_THIRD_PARTY = 'shareThirdParty';

if (isProduction) {
  ElectronCookies.enable({
    origin: 'https://lbry.tv',
  });
}

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

let internalAnalyticsEnabled: boolean = false;
if (window.localStorage.getItem(SHARE_INTERNAL) === 'true') internalAnalyticsEnabled = true;

const analytics: Analytics = {
  // receive buffer events from tracking plugin and save buffer amounts and times for backend call
  videoBufferEvent: async (claim, data) => {
    // stub
  },
  /**
   * Is told whether video is being started or paused, and adjusts interval accordingly
   * @param {boolean} isPlaying - Whether video was started or paused
   * @param {object} passedPlayer - VideoJS Player object
   */
  videoIsPlaying: (isPlaying, passedPlayer) => {
    // stub
  },
  videoStartEvent: (claimId, timeToStartVideo, poweredBy, passedUserId, canonicalUrl, passedPlayer, videoBitrate) => {
    // sendPromMetric('time_to_start', duration);
    sendMatomoEvent('Media', 'TimeToStart', claimId, timeToStartVideo);
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
      Native.getAppVersionInfo().then(({ localVersion }) => {
        sendMatomoEvent('Version', 'Desktop-Version', localVersion);
      });
    }
  },
  toggleInternal: (enabled: boolean): void => {
    internalAnalyticsEnabled = enabled;
    window.localStorage.setItem(SHARE_INTERNAL, enabled);
  },

  toggleThirdParty: (enabled: boolean): void => {
    window.localStorage.setItem(SHARE_THIRD_PARTY, enabled);
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

        if (timeToStart) {
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

const MatomoInstance = new MatomoTracker({
  urlBase: MATOMO_URL,
  siteId: MATOMO_ID, // optional, default value: `1`
});

analytics.pageView(generateInitialUrl(window.location.hash));

// Listen for url changes and report
// This will include search queries
history.listen((location) => {
  const { pathname, search } = location;

  const page = `${pathname}${search}`;
  analytics.pageView(page, search);
});

export default analytics;
