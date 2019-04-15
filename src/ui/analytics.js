// @flow
import { Lbryio } from 'lbryinc';
import ReactGA from 'react-ga';
import { history } from './store';

type Analytics = {
  pageView: string => void,
  setUser: Object => void,
  toggle: (boolean, ?boolean) => void,
  apiLogView: (string, string, string, ?number, ?() => void) => void,
  apiLogPublish: () => void,
};

let analyticsEnabled: boolean = true;
const analytics: Analytics = {
  pageView: path => {
    if (analyticsEnabled) {
      ReactGA.pageview(path, IS_WEB ? ['web'] : ['desktop']);
    }
  },
  setUser: user => {
    // Commented out because currently there is some delay before we know the user
    // We should retrieve this server side so we have it immediately
    // if (analyticsEnabled && user.id) {
    //   ReactGA.set('userId', user.id);
    // }
  },
  toggle: (enabled: boolean): void => {
    // Always collect analytics on lbry.tv
    // @if TARGET='app'
    analyticsEnabled = enabled;
    // @endif
  },
  apiLogView: (uri, outpoint, claimId, timeToStart, onSuccessCb) => {
    if (analyticsEnabled) {
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

      Lbryio.call('file', 'view', params)
        .then(() => {
          if (onSuccessCb) {
            onSuccessCb();
          }
        })
        .catch(() => {});
    }
  },
  apiLogSearch: () => {
    if (analyticsEnabled) {
      Lbryio.call('event', 'search');
    }
  },
  apiLogPublish: () => {
    if (analyticsEnabled) {
      Lbryio.call('event', 'publish');
    }
  },
  apiSearchFeedback: (query, vote) => {
    // We don't need to worry about analytics enabled here because users manually click on the button to provide feedback
    Lbryio.call('feedback', 'search', { query, vote });
  },
};

// Initialize google analytics
// Set `debug: true` for debug info
// Will change once we have separate ids for desktop/web
const UA_ID = IS_WEB ? 'UA-60403362-12' : 'UA-60403362-12';

ReactGA.initialize(UA_ID, {
  gaOptions: { name: IS_WEB ? 'web' : 'desktop' },
  testMode: process.env.NODE_ENV !== 'production',
  // debug: true,
});

// Manually call the first page view
// React Router doesn't include this on `history.listen`
analytics.pageView(window.location.pathname + window.location.search);

// Listen for url changes and report
// This will include search queries
history.listen(location => {
  const { pathname, search } = location;

  const page = `${pathname}${search}`;
  analytics.pageView(page);
});

export default analytics;
