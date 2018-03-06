// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

export type Subscription = {
  channelName: string,
  uri: string,
  latest: ?string
};

// Subscription redux types
export type SubscriptionState = {
  subscriptions: Array<Subscription>,
  hasFetchedSubscriptions: boolean,
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

type HasFetchedSubscriptions = {
  type: ACTIONS.HAS_FETCHED_SUBSCRIPTIONS,
};

type setSubscriptionLatest = {
  type: ACTIONS.SET_SUBSCRIPTION_LATEST,
  data: {
    subscription: Subscription,
    uri: string
  }
}

export type Action = doChannelSubscribe | doChannelUnsubscribe | HasFetchedSubscriptions | setSubscriptionLatest;
export type Dispatch = (action: Action) => any;

const defaultState = {
  subscriptions: [],
  hasFetchedSubscriptions: false,
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
    [ACTIONS.HAS_FETCHED_SUBSCRIPTIONS]: (state: SubscriptionState): SubscriptionState => ({
      ...state,
      hasFetchedSubscriptions: true,
    }),
    [ACTIONS.SET_SUBSCRIPTION_LATEST]: (
      state: SubscriptionState,
      action: setSubscriptionLatest
    ): SubscriptionState => ({
      ...state,
      subscriptions: state.subscriptions.map(subscription => subscription.channelName === action.data.subscription.channelName ? {...subscription, latest: action.data.uri} : subscription)
    })
  },
  defaultState
);
