// @flow
import * as ACTIONS from 'constants/action_types';
import { parseURI, normalizeURI, isURIEqual } from 'util/lbryURI';
import { handleActions } from 'util/redux-utils';

const defaultState: SubscriptionState = {
  subscriptions: [], // Deprecated
  following: [],
  loading: false,
  firstRunCompleted: false,
  downloadEnabledByUrl: {},
  downloadQueue: [],
  lastReleaseBySubUrl: {},
};

/*
For each channel, track number to keep downloaded (number), downloads (Array<{id, releaseTime}>)
  AutoDownloadById
  { channel_id: { count: n, downloads: [ { claimId: xyz, releaseTime: 123 ], ... } }
 */

export default handleActions(
  {
    [ACTIONS.CHANNEL_SUBSCRIBE]: (state: SubscriptionState, action): SubscriptionState => {
      const newSubscription: { uri: string, channelName: string, notificationsDisabled: boolean } = action.data;
      const newSubscriptions: Array<Subscription> = state.subscriptions.slice();
      let newFollowing: Array<Following> = state.following.slice();
      // prevent duplicates in the sidebar
      if (!newSubscriptions.some((sub) => isURIEqual(sub.uri, newSubscription.uri))) {
        //   $FlowFixMe
        newSubscriptions.unshift(newSubscription);
      }

      if (!newFollowing.some((sub) => isURIEqual(sub.uri, newSubscription.uri))) {
        newFollowing.unshift({
          uri: newSubscription.uri,
          notificationsDisabled: newSubscription.notificationsDisabled,
        });
      } else {
        newFollowing = newFollowing.map((following) => {
          if (isURIEqual(following.uri, newSubscription.uri)) {
            return {
              uri: normalizeURI(newSubscription.uri),
              notificationsDisabled: newSubscription.notificationsDisabled,
            };
          } else {
            return following;
          }
        });
      }

      return {
        ...state,
        subscriptions: newSubscriptions,
        following: newFollowing,
      };
    },
    [ACTIONS.CHANNEL_UNSUBSCRIBE]: (state: SubscriptionState, action): SubscriptionState => {
      const subscriptionToRemove: Subscription = action.data;
      const newSubscriptions = state.subscriptions
        .slice()
        .filter((subscription) => !isURIEqual(subscription.uri, subscriptionToRemove.uri));
      const newFollowing = state.following
        .slice()
        .filter((subscription) => !isURIEqual(subscription.uri, subscriptionToRemove.uri));

      return {
        ...state,
        subscriptions: newSubscriptions,
        following: newFollowing,
      };
    },
    [ACTIONS.SET_VIEW_MODE]: (state: SubscriptionState, action): SubscriptionState => ({
      ...state,
      viewMode: action.data,
    }),
    [ACTIONS.SUBSCRIPTION_DOWNLOAD_ADD]: (state: SubscriptionState, action): SubscriptionState => {
      const { downloadQueue } = state;
      const uri = action.data;
      const newDownloadQueue = downloadQueue.concat(uri);
      return {
        ...state,
        downloadUrisQueued: newDownloadQueue,
      };
    },
    [ACTIONS.SUBSCRIPTION_DOWNLOAD_REMOVE]: (state: SubscriptionState, action): SubscriptionState => {
      const { downloadQueue } = state;
      const uri = action.data;
      const newDownloadQueue = downloadQueue.filter((f) => f !== uri);
      return {
        ...state,
        downloadUrisQueued: newDownloadQueue,
      };
    },
    [ACTIONS.SUBSCRIPTION_RELEASE_UPDATE]: (state: SubscriptionState, action): SubscriptionState => {
      const { lastReleaseBySubUrl } = state;
      const entries = action.data;

      Object.entries(entries).forEach(([uri, timestamp]) => {
        lastReleaseBySubUrl[uri] = timestamp;
      });
      return {
        ...state,
        lastReleaseBySubUrl,
      };
    },
    [ACTIONS.SUBSCRIPTION_DOWNLOAD_TOGGLE]: (state: SubscriptionState, action): SubscriptionState => {
      const { downloadEnabledByUrl } = state;
      const { uri, enable } = action.data;

      downloadEnabledByUrl[uri] = enable;
      return Object.assign({}, state, { downloadEnabledByUrl });
    },
    [ACTIONS.SYNC_STATE_POPULATE]: (
      state: SubscriptionState,
      action: { data: { subscriptions: ?Array<string>, following: ?Array<Subscription> } }
    ) => {
      const { subscriptions, following } = action.data;
      const incomingSubscriptions = Array.isArray(subscriptions) && subscriptions.length;
      if (!incomingSubscriptions) {
        return {
          ...state,
        };
      }
      let newSubscriptions;
      let newFollowing;

      if (!subscriptions) {
        newSubscriptions = state.subscriptions;
      } else {
        const parsedSubscriptions = subscriptions.map((uri) => {
          const { channelName } = parseURI(uri);
          return {
            uri,
            channelName: channelName ? `@${channelName}` : '',
          };
        });
        newSubscriptions = parsedSubscriptions;
      }

      if (!following) {
        newFollowing = newSubscriptions.slice().map(({ uri }) => {
          return {
            uri,
            // Default first time movers to notifications on
            // This value is for email notifications too so we can't default off
            // New subscriptions after population will default off
            notificationsDisabled: false,
          };
        });
      } else {
        newFollowing = following;
      }

      return {
        ...state,
        subscriptions: newSubscriptions,
        following: newFollowing,
      };
    },
  },
  defaultState
);
