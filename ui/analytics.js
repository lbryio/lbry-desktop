// @flow
import { Lbryio } from 'lbryinc';
import * as Sentry from '@sentry/browser';
import { events } from 'analytics/events';
import { watchman } from 'analytics/watchman';
import type { Events } from 'analytics/events';
import type { Watchman } from 'analytics/watchman';

const isProduction = process.env.NODE_ENV === 'production';
let gAnalyticsEnabled = false;
const devInternalApis = process.env.LBRY_API_URL && process.env.LBRY_API_URL.includes('dev');

type Analytics = {
  setState: (enable: boolean) => void,
  event: Events,
  video: Watchman,
  error: (string) => Promise<any>,
  sentryError: ({} | string, {}) => Promise<any>,
  setUser: (Object) => void,
  apiLogView: (string, string, string, ?number, ?() => void) => Promise<any>,
  apiLogPublish: (ChannelClaim | StreamClaim) => void,
};

type LogPublishParams = {
  uri: string,
  claim_id: string,
  outpoint: string,
  channel_claim_id?: string,
};

const analytics: Analytics = {
  setState: (enable: boolean) => {
    gAnalyticsEnabled = enable;
    analytics.event.setState(gAnalyticsEnabled);
    analytics.video.setState(gAnalyticsEnabled);
  },
  event: events,
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
    analytics.event.setUser(userId);
    // Pass on to other submodules as needed...
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
};

analytics.setState(IS_WEB);
export default analytics;
