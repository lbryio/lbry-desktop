/*
  Removed Watchman (internal view tracking) code.
  This file may eventually implement cantina
  Refer to 0cc0e213a5c5bf9e2a76316df5d9da4b250a13c3 for initial integration commit
  refer to ___ for removal commit.
 */

import {Lbryio} from 'lbryinc';
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
  error: (arg1: string) => Promise<any>,
  sentryError: (arg1: Record<any, any> | string, arg2: Record<any, any>) => Promise<any>,
  pageView: (arg1: string, arg2?: string | null | undefined) => void,
  setUser: (arg1: any) => void,
  toggleInternal: (arg1: boolean, arg2?: boolean | null | undefined) => void,
  apiLogView: (
    arg1: string,
    arg2: string,
    arg3: string,
    arg4?: number | null | undefined,
    arg5?: () => void | null | undefined,
  ) => Promise<any>,
  apiLogPublish: (arg1: ChannelClaim | StreamClaim) => void,
  apiSyncTags: (arg1: Record<any, any>) => void,
  tagFollowEvent: (arg1: string, arg2: boolean, arg3?: string | null | undefined) => void,
  playerLoadedEvent: (arg1?: boolean | null | undefined) => void,
  playerStartedEvent: (arg1?: boolean | null | undefined) => void,
  videoStartEvent: (
    arg1: string,
    arg2: number,
    arg3: string,
    arg4: number,
    arg5: string,
    arg6: any,
    arg7: number,
  ) => void,
  videoIsPlaying: (arg1: boolean, arg2?: any) => void,
  videoBufferEvent: (
    arg1: StreamClaim,
    arg2: {
      timeAtBuffer: number,
      bufferDuration: number,
      bitRate: number,
      duration: number,
      userId: string,
      playerPoweredBy: string,
      readyState: number
    },
  ) => Promise<any>,
  emailProvidedEvent: () => void,
  emailVerifiedEvent: () => void,
  rewardEligibleEvent: () => void,
  startupEvent: () => void,
  purchaseEvent: (arg1: number) => void,
  readyEvent: (arg1: number) => void,
  openUrlEvent: (arg1: string) => void
};

type LogPublishParams = {
  uri: string,
  claim_id: string,
  outpoint: string,
  channel_claim_id?: string
};

// Tracking is impossible without a configured Matomo endpoint — treat an
// unset MATOMO_URL as analytics disabled, regardless of the user setting.
let internalAnalyticsEnabled: boolean = Boolean(MATOMO_URL);
if (window.localStorage.getItem(SHARE_INTERNAL) !== 'true') internalAnalyticsEnabled = false;

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
    return new Promise<any>((resolve) => {
      if (internalAnalyticsEnabled && isProduction) {
        // @ts-expect-error - TS2339 (ts-migration)
        return Lbryio.call('event', 'desktop_error', { error_message: message }).then(() => {
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
  },
  sentryError: (error, errorInfo) => {
    return new Promise<any>((resolve) => {
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
      const params: {
        href: string,
        customDimensions?: Array<{
          id: number,
          value: string | null | undefined
        }>
      } = { href: `${path}` };
      const dimensions: unknown = [];
      const searchParams = search && new URLSearchParams(search);

      if (searchParams && searchParams.get('src')) {
// @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
        dimensions.push({ id: 1, value: searchParams.get('src') });
      }
// @ts-expect-error - TS2339 - Property 'length' does not exist on type 'unknown'.
      if (dimensions.length) {
// @ts-expect-error - TS2740 - Type '{}' is missing the following properties from type '{ id: number; value: string; }[]': length, pop, push, concat, and 28 more.
        params['customDimensions'] = dimensions;
      }
      if (MatomoInstance) MatomoInstance.trackPageView(params);
    }
  },
  setUser: (userId) => {
    if (internalAnalyticsEnabled && userId) {
      window._paq.push(['setUserId', String(userId)]);
      Native.getAppVersionInfo().then(({ localVersion }) => {
// @ts-expect-error - TS2554 - Expected 4 arguments, but got 3.
        sendMatomoEvent('Version', 'Desktop-Version', localVersion);
      });
    }
  },
  toggleInternal: (enabled: boolean): void => {
    internalAnalyticsEnabled = Boolean(MATOMO_URL) && enabled;
// @ts-expect-error - TS2345 - Argument of type 'boolean' is not assignable to parameter of type 'string'.
    window.localStorage.setItem(SHARE_INTERNAL, enabled);
  },

// @ts-expect-error - TS2322 - Type '{ videoBufferEvent: (claim: StreamClaim, data: { timeAtBuffer: number; bufferDuration: number; bitRate: number; duration: number; userId: string; playerPoweredBy: string; readyState: number; }) => Promise<...>; ... 26 more ...; purchaseEvent: (purchaseInt: number) => void; }' is not assignable to type 'Analytics'.
  toggleThirdParty: (enabled: boolean): void => {
// @ts-expect-error - TS2345 - Argument of type 'boolean' is not assignable to parameter of type 'string'.
    window.localStorage.setItem(SHARE_THIRD_PARTY, enabled);
  },

  apiLogView: (uri, outpoint, claimId, timeToStart) => {
    return new Promise<any>((resolve, reject) => {
      if (internalAnalyticsEnabled && (isProduction || devInternalApis)) {
        const params: {
          uri: string,
          outpoint: string,
          claim_id: string,
          time_to_start?: number
        } = {
          uri,
          outpoint,
          claim_id: claimId,
        };

        if (timeToStart) {
          params.time_to_start = timeToStart;
        }

        // @ts-expect-error - TS2339 (ts-migration)
        resolve(Lbryio.call('file', 'view', params));
      } else {
// @ts-expect-error - TS2794 - Expected 1 arguments, but got 0. Did you forget to include 'void' in your type argument to 'Promise'?
        resolve();
      }
    });
  },
  apiLogSearch: () => {
    if (internalAnalyticsEnabled && isProduction) {
      // @ts-expect-error - TS2339 (ts-migration)
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

      // @ts-expect-error - TS2339 (ts-migration)
      Lbryio.call('event', 'publish', params);
    }
  },

  apiSyncTags: (params) => {
    if (internalAnalyticsEnabled && isProduction) {
      // @ts-expect-error - TS2339 (ts-migration)
      Lbryio.call('content_tags', 'sync', params);
    }
  },
  adsFetchedEvent: () => {
// @ts-expect-error - TS2554 - Expected 4 arguments, but got 2.
    sendMatomoEvent('Media', 'AdsFetched');
  },
  adsReceivedEvent: (response) => {
// @ts-expect-error - TS2554 - Expected 4 arguments, but got 3.
    sendMatomoEvent('Media', 'AdsReceived', JSON.stringify(response));
  },
  adsErrorEvent: (response) => {
// @ts-expect-error - TS2554 - Expected 4 arguments, but got 3.
    sendMatomoEvent('Media', 'AdsError', JSON.stringify(response));
  },
  playerLoadedEvent: (embedded) => {
// @ts-expect-error - TS2554 - Expected 4 arguments, but got 3.
    sendMatomoEvent('Player', 'Loaded', embedded ? 'embedded' : 'onsite');
  },
  playerStartedEvent: (embedded) => {
// @ts-expect-error - TS2554 - Expected 4 arguments, but got 3.
    sendMatomoEvent('Player', 'Started', embedded ? 'embedded' : 'onsite');
  },
  tagFollowEvent: (tag, following) => {
// @ts-expect-error - TS2554 - Expected 4 arguments, but got 3.
    sendMatomoEvent('Tag', following ? 'Tag-Follow' : 'Tag-Unfollow', tag);
  },
  channelBlockEvent: (uri, blocked, location) => {
// @ts-expect-error - TS2554 - Expected 4 arguments, but got 2.
    sendMatomoEvent(blocked ? 'Channel-Hidden' : 'Channel-Unhidden', uri);
  },
  emailProvidedEvent: () => {
// @ts-expect-error - TS2554 - Expected 4 arguments, but got 2.
    sendMatomoEvent('Engagement', 'Email-Provided');
  },
  emailVerifiedEvent: () => {
// @ts-expect-error - TS2554 - Expected 4 arguments, but got 2.
    sendMatomoEvent('Engagement', 'Email-Verified');
  },
  rewardEligibleEvent: () => {
// @ts-expect-error - TS2554 - Expected 4 arguments, but got 2.
    sendMatomoEvent('Engagement', 'Reward-Eligible');
  },
  openUrlEvent: (url: string) => {
// @ts-expect-error - TS2554 - Expected 4 arguments, but got 3.
    sendMatomoEvent('Engagement', 'Open-Url', url);
  },
  trendingAlgorithmEvent: (trendingAlgorithm: string) => {
// @ts-expect-error - TS2554 - Expected 4 arguments, but got 3.
    sendMatomoEvent('Engagement', 'Trending-Algorithm', trendingAlgorithm);
  },
  startupEvent: () => {
// @ts-expect-error - TS2554 - Expected 4 arguments, but got 2.
    sendMatomoEvent('Startup', 'Startup');
  },
  readyEvent: (timeToReady: number) => {
    sendMatomoEvent('Startup', 'App-Ready', 'Time', timeToReady);
  },
  purchaseEvent: (purchaseInt: number) => {
    sendMatomoEvent('Purchase', 'Purchase-Complete', 'someLabel', purchaseInt);
  },
};

function sendMatomoEvent(category: unknown, action: unknown, name: unknown, value: unknown) {
  if (internalAnalyticsEnabled) {
    const event = { category, action, name, value } as const;
    // @ts-expect-error - TS2345 (ts-migration)
    if (MatomoInstance) MatomoInstance.trackEvent(event);
  }
}

// Constructing the tracker without a URL would throw at import time.
const MatomoInstance = MATOMO_URL
  ? new MatomoTracker({
      urlBase: MATOMO_URL,
      // @ts-expect-error - TS2322 (ts-migration)
      siteId: MATOMO_ID, // optional, default value: `1`
    })
  : null;

analytics.pageView(generateInitialUrl(window.location.hash));

// Listen for url changes and report
// This will include search queries
history.listen((location) => {
  const { pathname, search } = location;

  const page = `${pathname}${search}`;
  analytics.pageView(page, search);
});

export default analytics;
