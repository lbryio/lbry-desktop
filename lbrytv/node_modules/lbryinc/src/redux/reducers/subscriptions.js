// @flow
import * as ACTIONS from 'constants/action_types';
import { parseURI, ACTIONS as LBRY_REDUX_ACTIONS } from 'lbry-redux';
import { VIEW_ALL } from 'constants/subscriptions';
import { handleActions } from 'util/redux-utils';

const defaultState: SubscriptionState = {
  enabledChannelNotifications: [],
  subscriptions: [],
  latest: {},
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
    [ACTIONS.CHANNEL_SUBSCRIBE]: (
      state: SubscriptionState,
      action: DoChannelSubscribe
    ): SubscriptionState => {
      const newSubscription: Subscription = action.data;
      const newSubscriptions: Array<Subscription> = state.subscriptions.slice();
      if (!newSubscriptions.some(sub => sub.uri === newSubscription.uri)) {
        newSubscriptions.unshift(newSubscription);
      }

      return {
        ...state,
        subscriptions: newSubscriptions,
      };
    },
    [ACTIONS.CHANNEL_UNSUBSCRIBE]: (
      state: SubscriptionState,
      action: DoChannelUnsubscribe
    ): SubscriptionState => {
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
    ): SubscriptionState => {
      const { subscription, uri } = action.data;
      const newLatest = Object.assign({}, state.latest);
      newLatest[subscription.uri] = uri;

      return {
        ...state,
        latest: newLatest,
      };
    },
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
    [ACTIONS.CHANNEL_SUBSCRIPTION_ENABLE_NOTIFICATIONS]: (
      state: SubscriptionState,
      action: DoChannelSubscriptionEnableNotifications
    ): SubscriptionState => {
      const channelName = action.data;

      const newEnabledChannelNotifications: Array<
        string
      > = state.enabledChannelNotifications.slice();
      if (
        channelName &&
        channelName.trim().length > 0 &&
        newEnabledChannelNotifications.indexOf(channelName) === -1
      ) {
        newEnabledChannelNotifications.push(channelName);
      }

      return {
        ...state,
        enabledChannelNotifications: newEnabledChannelNotifications,
      };
    },
    [ACTIONS.CHANNEL_SUBSCRIPTION_DISABLE_NOTIFICATIONS]: (
      state: SubscriptionState,
      action: DoChannelSubscriptionDisableNotifications
    ): SubscriptionState => {
      const channelName = action.data;

      const newEnabledChannelNotifications: Array<
        string
      > = state.enabledChannelNotifications.slice();
      const index = newEnabledChannelNotifications.indexOf(channelName);
      if (index > -1) {
        newEnabledChannelNotifications.splice(index, 1);
      }

      return {
        ...state,
        enabledChannelNotifications: newEnabledChannelNotifications,
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
    [ACTIONS.SET_VIEW_MODE]: (
      state: SubscriptionState,
      action: SetViewMode
    ): SubscriptionState => ({
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
    [ACTIONS.SUBSCRIPTION_FIRST_RUN_COMPLETED]: (state: SubscriptionState): SubscriptionState => ({
      ...state,
      firstRunCompleted: true,
    }),
    [ACTIONS.VIEW_SUGGESTED_SUBSCRIPTIONS]: (state: SubscriptionState): SubscriptionState => ({
      ...state,
      showSuggestedSubs: true,
    }),
    [LBRY_REDUX_ACTIONS.USER_STATE_POPULATE]: (
      state: SubscriptionState,
      action: { data: { subscriptions: ?Array<string> } }
    ) => {
      const { subscriptions } = action.data;
      let newSubscriptions;

      if (!subscriptions) {
        newSubscriptions = state.subscriptions;
      } else {
        const parsedSubscriptions = subscriptions.map(uri => {
          const { channelName } = parseURI(uri);

          return {
            uri,
            channelName: `@${channelName}`,
          };
        });
        if (!state.subscriptions || !state.subscriptions.length) {
          newSubscriptions = parsedSubscriptions;
        } else {
          const map = {};
          newSubscriptions = parsedSubscriptions.concat(state.subscriptions).filter(sub => {
            return map[sub.uri] ? false : (map[sub.uri] = true);
          }, {});
        }
      }

      return {
        ...state,
        subscriptions: newSubscriptions,
      };
    },
  },
  defaultState
);
