// @flow
import * as ACTIONS from 'constants/action_types';
import * as NOTIFICATION_TYPES from 'constants/notification_types';
import { handleActions } from 'util/redux-utils';
import type { Subscription } from 'types/subscription';

export type NotificationType =
  | NOTIFICATION_TYPES.DOWNLOADING
  | NOTIFICATION_TYPES.DOWNLOADED
  | NOTIFICATION_TYPES.NOTIFY_ONLY;

export type SubscriptionNotifications = {
  [string]: {
    subscription: Subscription,
    type: NotificationType,
  },
};

// Subscription redux types
export type SubscriptionState = {
  subscriptions: Array<Subscription>,
  notifications: SubscriptionNotifications,
  loading: boolean,
};

// Subscription action types
type doChannelSubscribe = {
  type: ACTIONS.CHANNEL_SUBSCRIBE,
  data: Subscription,
};

type doChannelUnsubscribe = {
  type: ACTIONS.CHANNEL_UNSUBSCRIBE,
  data: Subscription,
};

type setSubscriptionLatest = {
  type: ACTIONS.SET_SUBSCRIPTION_LATEST,
  data: {
    subscription: Subscription,
    uri: string,
  },
};

type setSubscriptionNotification = {
  type: ACTIONS.SET_SUBSCRIPTION_NOTIFICATION,
  data: {
    subscription: Subscription,
    uri: string,
    type: NotificationType,
  },
};

type setSubscriptionNotifications = {
  type: ACTIONS.SET_SUBSCRIPTION_NOTIFICATIONS,
  data: {
    notifications: SubscriptionNotifications,
  },
};

type CheckSubscriptionStarted = {
  type: ACTIONS.CHECK_SUBSCRIPTION_STARTED,
};

type CheckSubscriptionCompleted = {
  type: ACTIONS.CHECK_SUBSCRIPTION_COMPLETED,
};

type fetchedSubscriptionsSucess = {
  type: ACTIONS.FETCH_SUBSCRIPTIONS_SUCCESS,
  data: Array<Subscription>,
};

export type Action =
  | doChannelSubscribe
  | doChannelUnsubscribe
  | setSubscriptionLatest
  | setSubscriptionNotification
  | CheckSubscriptionStarted
  | CheckSubscriptionCompleted
  | Function;
export type Dispatch = (action: Action) => any;

const defaultState = {
  subscriptions: [],
  notifications: {},
  loading: false,
};

export default handleActions(
  {
    [ACTIONS.CHANNEL_SUBSCRIBE]: (
      state: SubscriptionState,
      action: doChannelSubscribe
    ): SubscriptionState => {
      const newSubscription: Subscription = action.data;
      const newSubscriptions: Array<Subscription> = state.subscriptions.slice();
      newSubscriptions.unshift(newSubscription);

      return {
        ...state,
        subscriptions: newSubscriptions,
      };
    },
    [ACTIONS.CHANNEL_UNSUBSCRIBE]: (
      state: SubscriptionState,
      action: doChannelUnsubscribe
    ): SubscriptionState => {
      const subscriptionToRemove: Subscription = action.data;

      const newSubscriptions = state.subscriptions
        .slice()
        .filter(subscription => subscription.channelName !== subscriptionToRemove.channelName);

      return {
        ...state,
        subscriptions: newSubscriptions,
      };
    },
    [ACTIONS.SET_SUBSCRIPTION_LATEST]: (
      state: SubscriptionState,
      action: setSubscriptionLatest
    ): SubscriptionState => ({
      ...state,
      subscriptions: state.subscriptions.map(
        subscription =>
          subscription.channelName === action.data.subscription.channelName
            ? { ...subscription, latest: action.data.uri }
            : subscription
      ),
    }),
    [ACTIONS.SET_SUBSCRIPTION_NOTIFICATION]: (
      state: SubscriptionState,
      action: setSubscriptionNotification
    ): SubscriptionState => ({
      ...state,
      notifications: {
        ...state.notifications,
        [action.data.uri]: { subscription: action.data.subscription, type: action.data.type },
      },
    }),
    [ACTIONS.SET_SUBSCRIPTION_NOTIFICATIONS]: (
      state: SubscriptionState,
      action: setSubscriptionNotifications
    ): SubscriptionState => ({
      ...state,
      notifications: action.data.notifications,
    }),
    [ACTIONS.FETCH_SUBSCRIPTIONS_START]: (state: SubscriptionState): SubscriptionState => ({
      ...state,
      loading: true,
    }),
    [ACTIONS.FETCH_SUBSCRIPTIONS_FAIL]: (state: SubscriptionState): SubscriptionState => ({
      ...state,
      loading: false,
    }),
    [ACTIONS.FETCH_SUBSCRIPTIONS_SUCCESS]: (
      state: SubscriptionState,
      action: fetchedSubscriptionsSucess
    ): SubscriptionState => ({
      ...state,
      loading: false,
      subscriptions: action.data,
    }),
  },
  defaultState
);
