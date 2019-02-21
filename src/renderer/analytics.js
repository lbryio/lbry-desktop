// @flow
import mixpanel from 'mixpanel-browser';
import { Lbryio } from 'lbryinc';
import isDev from 'electron-is-dev';

if (isDev) {
  mixpanel.init('691723e855cabb9d27a7a79002216967');
} else {
  mixpanel.init('af5c6b8110068fa4f5c4600c81f05e60');
}

type Analytics = {
  track: (string, ?Object) => void,
  setUser: Object => void,
  toggle: (boolean, ?boolean) => void,
  apiLogView: (string, string, string, ?number, ?() => void) => void,
};

let analyticsEnabled: boolean = false;

const analytics: Analytics = {
  track: (name, payload) => {
    if (analyticsEnabled) {
      if (payload) {
        mixpanel.track(name, payload);
      } else {
        mixpanel.track(name);
      }
    }
  },
  setUser: user => {
    if (user.id) {
      mixpanel.identify(user.id);
    }
    if (user.primary_email) {
      mixpanel.people.set({
        $email: user.primary_email,
      });
    }
  },
  toggle: (enabled: boolean, logDisabled: ?boolean): void => {
    if (!enabled && logDisabled) {
      mixpanel.track('DISABLED');
    }
    analyticsEnabled = enabled;
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

export default analytics;
