// @flow
import mixpanel from 'mixpanel-browser';

mixpanel.init('691723e855cabb9d27a7a79002216967');

type Analytics = {
  track: (string, ?Object) => void,
  setUser: Object => void,
  toggle: (boolean, ?boolean) => void,
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
};

export default analytics;
