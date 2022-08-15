// @flow
import { Lbryio } from 'lbryinc';
import * as Sentry from '@sentry/browser';
import { apiLog } from 'analytics/apiLog';
import { events } from 'analytics/events';
import { watchman } from 'analytics/watchman';
import type { ApiLog } from 'analytics/apiLog';
import type { Events } from 'analytics/events';
import type { Watchman } from 'analytics/watchman';

const isProduction = process.env.NODE_ENV === 'production';
let gAnalyticsEnabled = false;

type Analytics = {
  setState: (enable: boolean) => void,
  apiLog: ApiLog,
  event: Events,
  video: Watchman,
  error: (string) => Promise<any>,
  sentryError: ({} | string, {}) => Promise<any>,
  setUser: (Object) => void,
};

const analytics: Analytics = {
  setState: (enable: boolean) => {
    gAnalyticsEnabled = enable;
    analytics.apiLog.setState(gAnalyticsEnabled);
    analytics.event.setState(gAnalyticsEnabled);
    analytics.video.setState(gAnalyticsEnabled);
  },
  apiLog: apiLog,
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
};

analytics.setState(IS_WEB);
export default analytics;
