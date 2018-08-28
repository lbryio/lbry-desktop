// @flow
import mixpanel from 'mixpanel-browser';
import Lbryio from 'lbryio';
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
  apiLogView: (string, string, string) => void,
};

let analyticsEnabled: boolean = false;

const analytics: Analytics = {
  track: (name: string, payload: ?Object): void => {
    if (analyticsEnabled) {
      if (payload) {
        mixpanel.track(name, payload);
      } else {
        mixpanel.track(name);
      }
    }
  },
  setUser: (user: Object): void => {
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
  apiLogView: (
    uri: string,
    outpoint: string,
    claimId: string,
    timeToStart?: number,
    onSuccessCb: ?() => void
  ): void => {
    if (analyticsEnabled) {
      const params = {
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
};

export default analytics;
