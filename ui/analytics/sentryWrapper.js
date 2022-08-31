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
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

let gSentryInitialized = false;
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
    if (IS_PRODUCTION || LocalStorage.getItem('sentry_install')) {
      // https://docs.sentry.io/platforms/javascript/configuration/options/
      Sentry.init({
        dsn: TEST_DSN || SENTRY_DSN,
        beforeBreadcrumb: handleBeforeBreadcrumb,
        beforeSend: handleBeforeSend,
        debug: LocalStorage.getItem('sentry_debug') === 'true',
        denyUrls: [/extensions\//i, /^chrome:\/\//i],
        integrations: [new BrowserTracing()],
        maxBreadcrumbs: 50,
        release: process.env.BUILD_REV,
        tracesSampleRate: 0.0,
        whitelistUrls: [/https:\/\/((.*)\.)?odysee\.(com|tv)/, 'http://localhost:9090'],
      });

      gSentryInitialized = true;
    }
  },

  setState: (enable: boolean) => {
    gSentryEnabled = enable;
  },

  log: (error: Error | string, options?: SentryEventOptions, transactionName?: string) => {
    return new Promise((resolve) => {
      if (gSentryInitialized && gSentryEnabled) {
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
  if (event.message === 'ResizeObserver loop limit exceeded') {
    // This is coming from the ads, but unfortunately there's no data linking
    // to ads for us to filter exactly. It's apparently an ignorable browser
    // message, and usually there should be an accompanying exception (we'll
    // capture that instead).
    return null;
  }

  try {
    const ev = event.exception?.values || [];
    const frames = ev[0]?.stacktrace?.frames || [];
    const lastFrame = frames[frames.length - 1];

    if (frames.some((fr) => fr.filename && fr.filename.includes('/api/adserver/spt'))) {
      return null;
    }

    if (lastFrame?.filename && lastFrame.filename.match(/([a-z]*)-extension:\/\//)) {
      return null;
    }
  } catch {}

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
