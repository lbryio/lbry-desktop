// @flow
import * as ACTIONS from 'constants/action_types';
import { parseURI, normalizeURI, isURIEqual } from 'util/lbryURI';
import { handleActions } from 'util/redux-utils';

const defaultState: SubscriptionState = {
  subscriptions: [], // Deprecated
  lastActiveSubscriptions: undefined, // undefined = un-fetched, null = no results;
  following: [],
  loading: false,
  firstRunCompleted: false,
};

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

      const newSubscriptions = state.subscriptions.filter(
        (subscription) => !isURIEqual(subscription.uri, subscriptionToRemove.uri)
      );

      const newFollowing = state.following.filter(
        (subscription) => !isURIEqual(subscription.uri, subscriptionToRemove.uri)
      );

      return {
        ...state,
        subscriptions: newSubscriptions,
        following: newFollowing,
      };
    },
    [ACTIONS.FETCH_SUBSCRIPTIONS_START]: (state: SubscriptionState): SubscriptionState => ({
      ...state,
      loading: true,
    }),
    [ACTIONS.FETCH_SUBSCRIPTIONS_FAIL]: (state: SubscriptionState): SubscriptionState => ({
      ...state,
      loading: false,
    }),
    [ACTIONS.FETCH_SUBSCRIPTIONS_SUCCESS]: (state: SubscriptionState, action): SubscriptionState => ({
      ...state,
      loading: false,
      subscriptions: action.data,
    }),
    [ACTIONS.FETCH_LAST_ACTIVE_SUBS_DONE]: (state: SubscriptionState, action): SubscriptionState => {
      const activeChannelClaims = action.data;
      if (activeChannelClaims && activeChannelClaims.length > 0) {
        const subs = [];
        activeChannelClaims.forEach((claim) => {
          const index = state.subscriptions.findIndex((sub) => isURIEqual(sub.uri, claim?.permanent_url));
          if (index !== -1) {
            subs.push(state.subscriptions[index]);
          }
        });

        return { ...state, lastActiveSubscriptions: subs };
      }
      return { ...state, lastActiveSubscriptions: null };
    },
    [ACTIONS.FETCH_LAST_ACTIVE_SUBS_FAIL]: (state: SubscriptionState, action): SubscriptionState => ({
      ...state,
      lastActiveSubscriptions: null,
    }),
    [ACTIONS.SET_VIEW_MODE]: (state: SubscriptionState, action): SubscriptionState => ({
      ...state,
      viewMode: action.data,
    }),
    [ACTIONS.USER_STATE_POPULATE]: (
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
