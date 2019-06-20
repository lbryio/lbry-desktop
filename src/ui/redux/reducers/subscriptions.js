// @flow
import * as ACTIONS from 'constants/action_types';
import { VIEW_ALL } from 'constants/subscriptions';
import { handleActions } from 'util/redux-utils';

const defaultState: SubscriptionState = {
  subscriptions: [],
  unread: {},
  suggested: {},
  loading: false,
  viewMode: VIEW_ALL,
  loadingSuggested: false,
  firstRunCompleted: false,
  showSuggestedSubs: false,
};

export default handleActions(
  {
    [ACTIONS.CHANNEL_SUBSCRIBE]: (state: SubscriptionState, action: DoChannelSubscribe): SubscriptionState => {
      const newSubscription: Subscription = action.data;
      const newSubscriptions: Array<Subscription> = state.subscriptions.slice();
      newSubscriptions.unshift(newSubscription);

      return {
        ...state,
        subscriptions: newSubscriptions,
      };
    },
    [ACTIONS.CHANNEL_UNSUBSCRIBE]: (state: SubscriptionState, action: DoChannelUnsubscribe): SubscriptionState => {
      const subscriptionToRemove: Subscription = action.data;
      const newSubscriptions = state.subscriptions
        .slice()
        .filter(subscription => subscription.channelName !== subscriptionToRemove.channelName);

      // Check if we need to remove it from the 'unread' state
      const { unread } = state;
      if (unread[subscriptionToRemove.uri]) {
        delete unread[subscriptionToRemove.uri];
      }
      return {
        ...state,
        unread: { ...unread },
        subscriptions: newSubscriptions,
      };
    },
    [ACTIONS.SET_SUBSCRIPTION_LATEST]: (
      state: SubscriptionState,
      action: SetSubscriptionLatest
    ): SubscriptionState => ({
      ...state,
      subscriptions: state.subscriptions.map(subscription =>
        subscription.channelName === action.data.subscription.channelName
          ? { ...subscription, latest: action.data.uri }
          : subscription
      ),
    }),
    [ACTIONS.UPDATE_SUBSCRIPTION_UNREADS]: (
      state: SubscriptionState,
      action: DoUpdateSubscriptionUnreads
    ): SubscriptionState => {
      const { channel, uris, type } = action.data;

      return {
        ...state,
        unread: {
          ...state.unread,
          [channel]: {
            uris,
            type,
          },
        },
      };
    },
    [ACTIONS.REMOVE_SUBSCRIPTION_UNREADS]: (
      state: SubscriptionState,
      action: DoRemoveSubscriptionUnreads
    ): SubscriptionState => {
      const { channel, uris } = action.data;

      // If no channel is passed in, remove all unreads
      let newUnread;
      if (channel) {
        newUnread = { ...state.unread };

        if (!uris) {
          delete newUnread[channel];
        } else {
          newUnread[channel].uris = uris;
        }
      } else {
        newUnread = {};
      }

      return {
        ...state,
        unread: {
          ...newUnread,
        },
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
    [ACTIONS.FETCH_SUBSCRIPTIONS_SUCCESS]: (
      state: SubscriptionState,
      action: FetchedSubscriptionsSucess
    ): SubscriptionState => ({
      ...state,
      loading: false,
      subscriptions: action.data,
    }),
    [ACTIONS.SET_VIEW_MODE]: (state: SubscriptionState, action: SetViewMode): SubscriptionState => ({
      ...state,
      viewMode: action.data,
    }),
    [ACTIONS.GET_SUGGESTED_SUBSCRIPTIONS_START]: (state: SubscriptionState): SubscriptionState => ({
      ...state,
      loadingSuggested: true,
    }),
    [ACTIONS.GET_SUGGESTED_SUBSCRIPTIONS_SUCCESS]: (
      state: SubscriptionState,
      action: GetSuggestedSubscriptionsSuccess
    ): SubscriptionState => ({
      ...state,
      suggested: action.data,
      loadingSuggested: false,
    }),
    [ACTIONS.GET_SUGGESTED_SUBSCRIPTIONS_FAIL]: (state: SubscriptionState): SubscriptionState => ({
      ...state,
      loadingSuggested: false,
    }),
  },
  defaultState
);
