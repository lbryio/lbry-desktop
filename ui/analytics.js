// @flow
import { Lbryio } from 'lbryinc';
import * as Sentry from '@sentry/browser';
import * as RENDER_MODES from 'constants/file_render_modes';
import { watchman } from 'analytics/watchman';
import type { Watchman } from 'analytics/watchman';

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

const isProduction = process.env.NODE_ENV === 'production';
let gAnalyticsEnabled = false;
const devInternalApis = process.env.LBRY_API_URL && process.env.LBRY_API_URL.includes('dev');

type Analytics = {
  setState: (enable: boolean) => void,
  appStartTime: number,
  eventStartTime: any,
  video: Watchman,
  error: (string) => Promise<any>,
  sentryError: ({} | string, {}) => Promise<any>,
  setUser: (Object) => void,
  apiLogView: (string, string, string, ?number, ?() => void) => Promise<any>,
  apiLogPublish: (ChannelClaim | StreamClaim) => void,
  tagFollowEvent: (string, boolean, ?string) => void,
  playerLoadedEvent: (string, ?boolean) => void,
  playerVideoStartedEvent: (?boolean) => void,
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

const isGaAllowed = false; // internalAnalyticsEnabled && isProduction; -- TODO: will be moved in upcoming commit

const analytics: Analytics = {
  setState: (enable: boolean) => {
    gAnalyticsEnabled = enable;
    analytics.video.setState(gAnalyticsEnabled);
  },
  appStartTime: 0,
  eventStartTime: {},
  video: watchman,
  error: (message) => {
    return new Promise((resolve) => {
      if (gAnalyticsEnabled && isProduction) {
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
      if (gAnalyticsEnabled && isProduction) {
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
  toggleThirdParty: (enabled: boolean): void => {
    // Retained to keep things compiling. We don't do third-party analytics,
    // so this can be removed, but together with the redux state.
  },
  apiLogView: (uri, outpoint, claimId, timeToStart) => {
    return new Promise((resolve, reject) => {
      if (gAnalyticsEnabled && (isProduction || devInternalApis)) {
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
    if (gAnalyticsEnabled && isProduction) {
      Lbryio.call('event', 'search');
    }
  },
  apiLogPublish: (claimResult: ChannelClaim | StreamClaim) => {
    // Don't check if this is production so channels created on localhost are still linked to user
    if (gAnalyticsEnabled) {
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

// Activate
if (isGaAllowed && window.gtag) {
  window.gtag('consent', 'update', {
    ad_storage: 'granted',
    analytics_storage: 'granted',
  });
}

analytics.setState(IS_WEB);
export default analytics;
