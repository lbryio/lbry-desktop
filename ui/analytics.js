// @flow
import { Lbryio } from 'lbryinc';
import ReactGA from 'react-ga';
import { history } from './store';
// @if TARGET='app'
import Native from 'native';
import ElectronCookies from '@exponent/electron-cookies';
// @endif

const isProduction = process.env.NODE_ENV === 'production';
const devInternalApis = process.env.LBRY_API_URL;
const LBRY_TV_MINUS_PIRATE_BAY_UA_ID = 'UA-60403362-16';
const LBRY_TV_UA_ID = 'UA-60403362-12';
const DESKTOP_UA_ID = 'UA-60403362-13';
const SECOND_TRACKER_NAME = 'tracker2';

// @if TARGET='app'
ElectronCookies.enable({
  origin: 'https://lbry.tv',
});
// @endif

type Analytics = {
  error: string => void,
  pageView: string => void,
  setUser: Object => void,
  toggle: (boolean, ?boolean) => void,
  apiLogView: (string, string, string, ?number, ?() => void) => Promise<any>,
  apiLogPublish: (ChannelClaim | StreamClaim) => void,
  tagFollowEvent: (string, boolean, string) => void,
  emailProvidedEvent: () => void,
  emailVerifiedEvent: () => void,
  rewardEligibleEvent: () => void,
  startupEvent: () => void,
  readyEvent: number => void,
  openUrlEvent: string => void,
};

type LogPublishParams = {
  uri: string,
  claim_id: string,
  outpoint: string,
  channel_claim_id?: string,
};

let analyticsEnabled: boolean = isProduction;

const analytics: Analytics = {
  error: message => {
    if (analyticsEnabled && isProduction) {
      Lbryio.call('event', 'desktop_error', { error_message: message });
    }
  },
  pageView: path => {
    if (analyticsEnabled) {
      ReactGA.pageview(path, [SECOND_TRACKER_NAME]);
    }
  },
  setUser: userId => {
    if (analyticsEnabled && userId) {
      ReactGA.set({
        userId,
      });

      // @if TARGET='app'
      Native.getAppVersionInfo().then(({ localVersion }) => {
        sendGaEvent('Desktop-Version', localVersion);
      });
      // @endif
    }
  },
  toggle: (enabled: boolean): void => {
    // Always collect analytics on lbry.tv
    // @if TARGET='app'
    analyticsEnabled = enabled;
    // @endif
  },
  apiLogView: (uri, outpoint, claimId, timeToStart) => {
    return new Promise((resolve, reject) => {
      if (analyticsEnabled && (isProduction || devInternalApis)) {
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
    if (analyticsEnabled && isProduction) {
      Lbryio.call('event', 'search');
    }
  },
  apiLogPublish: (claimResult: ChannelClaim | StreamClaim) => {
    if (analyticsEnabled && isProduction) {
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

  apiSearchFeedback: (query, vote) => {
    if (isProduction) {
      // We don't need to worry about analytics enabled here because users manually click on the button to provide feedback
      Lbryio.call('feedback', 'search', { query, vote });
    }
  },
  tagFollowEvent: (tag, following, location) => {
    sendGaEvent(following ? 'Tag-Follow' : 'Tag-Unfollow', tag);
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
  startupEvent: () => {
    sendGaEvent('Startup', 'Startup');
  },
  readyEvent: (timeToReady: number) => {
    sendGaEvent('Startup', 'App-Ready');
    sendGaTimingEvent('Startup', 'App-Ready', timeToReady);
  },
};

function sendGaEvent(category, action, label) {
  if (analyticsEnabled && isProduction) {
    ReactGA.event(
      {
        category,
        action,
        ...(label ? { label } : {}),
      },
      [SECOND_TRACKER_NAME]
    );
  }
}

function sendGaTimingEvent(category: string, action: string, timeInMs: number) {
  if (analyticsEnabled && isProduction) {
    ReactGA.timing(
      {
        category,
        variable: action,
        value: timeInMs,
      },
      [SECOND_TRACKER_NAME]
    );
  }
}

let gaTrackers = [];

if (!IS_WEB) {
  gaTrackers.push({
    trackingId: DESKTOP_UA_ID,
  });
} else {
  gaTrackers.push({
    trackingId: LBRY_TV_UA_ID,
  });

  const { search } = window.location;
  const urlParams = new URLSearchParams(search);
  const isPirateBayUser = urlParams.get('utm_source') === 'PB';

  if (!isPirateBayUser) {
    gaTrackers.push({
      trackingId: LBRY_TV_MINUS_PIRATE_BAY_UA_ID,
      gaOptions: {
        name: SECOND_TRACKER_NAME,
      },
    });
  }
}

ReactGA.initialize(gaTrackers, {
  testMode: process.env.NODE_ENV !== 'production',
  cookieDomain: 'auto',
  siteSpeedSampleRate: 100,
  // un-comment to see events as they are sent to google
  // debug: true,
});

// Manually call the first page view
// React Router doesn't include this on `history.listen`
// @if TARGET='web'
analytics.pageView(window.location.pathname + window.location.search);
// @endif

// @if TARGET='app'
ReactGA.set({ checkProtocolTask: null });
ReactGA.set({ location: 'https://lbry.tv' });
analytics.pageView(window.location.pathname.split('.html')[1] + window.location.search || '/');
// @endif;

// Listen for url changes and report
// This will include search queries
history.listen(location => {
  const { pathname, search } = location;

  const page = `${pathname}${search}`;
  analytics.pageView(page);
});

export default analytics;
