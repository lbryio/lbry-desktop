/**
 * Sentry SDK wrapper.
 *
 * Not meant to be used directly by the rest of the system -- access
 * functionality through `ui/analytics.js` instead.
 *
 * The web-server logging will require SENTRY_AUTH_TOKEN.
 */

// @flow
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { LocalStorage } from 'util/storage';

const SENTRY_DSN = 'https://1f3c88e2e4b341328a638e138a60fb73@sentry.odysee.tv/2';
const TEST_DSN = LocalStorage.getItem('sentry_test_dsn') || '';

const isProduction = process.env.NODE_ENV === 'production';
let gSentryEnabled = false;

// ****************************************************************************
// sentryWrapper
// ****************************************************************************

declare type SentryWrapper = {
  init: () => void,
  setState: (enable: boolean) => void,
  log: (error: Error | string, options?: SentryEventOptions, transactionName?: string) => Promise<?LogId>,
};

export const sentryWrapper: SentryWrapper = {
  init: () => {
    // Call init() as early as possible in the app.
    // Note that we currently catch React errors in 'component/errorBoundary' and
    // manually relay it to Sentry. Those will not bubble up to this error reporter.
    if (isProduction) {
      // https://docs.sentry.io/platforms/javascript/configuration/options/
      Sentry.init({
        dsn: TEST_DSN || SENTRY_DSN,
        beforeBreadcrumb: handleBeforeBreadcrumb,
        beforeSend: handleBeforeSend,
        debug: !isProduction,
        integrations: [new BrowserTracing()],
        maxBreadcrumbs: 50,
        tracesSampleRate: isProduction ? 0.1 : 1.0,
        whitelistUrls: [/\/public\/ui.js/],
      });
    }
  },

  setState: (enable: boolean) => {
    gSentryEnabled = isProduction && enable;
  },

  log: (error: Error | string, options?: SentryEventOptions, transactionName?: string) => {
    return new Promise((resolve) => {
      if (gSentryEnabled) {
        Sentry.withScope((scope) => {
          if (transactionName) {
            // Using transactionName as the label is somewhat of a hack:
            // https://stackoverflow.com/questions/72133586/how-can-i-change-the-name-or-message-of-a-javascript-error-object-used-in-sentry
            scope.setTransactionName(transactionName);
          }

          const eventId =
            typeof error === 'string'
              ? Sentry.captureMessage(error, reformatTagKeys(options))
              : Sentry.captureException(error, reformatTagKeys(options));

          resolve(eventId);
        });
      } else {
        resolve(null);
      }
    });
  },
};

// ****************************************************************************
// Private
// ****************************************************************************

function handleBeforeSend(event) {
  return event;
}

function handleBeforeBreadcrumb(breadcrumb, hint) {
  // https://docs.sentry.io/platforms/javascript/configuration/filtering/
  return breadcrumb;
}

/**
 * Appends an underscore to all our custom keys so that they appear first before
 * the Sentry-generated ones in the dashboard.
 * - Doing it here so that developers don't need to.
 * - Changes is done in-place and object is returned for chaining convenience.
 *
 * @param options
 */
function reformatTagKeys(options?: SentryEventOptions) {
  if (options && options.tags) {
    const keys = Object.keys(options.tags);
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      if (!key.startsWith('_')) {
        // $FlowIgnore - key is from the same object.
        options.tags[`_${key}`] = options.tags[key];
        // $FlowIgnore - key is from the same object.
        delete options.tags[key];
      }
    }
  }
  return options;
}
