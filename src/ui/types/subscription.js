// @flow
import type { Dispatch as ReduxDispatch } from 'types/redux';
import * as ACTIONS from 'constants/action_types';
import {
  DOWNLOADED,
  DOWNLOADING,
  NOTIFY_ONLY,
  VIEW_ALL,
  VIEW_LATEST_FIRST,
  SUGGESTED_TOP_BID,
  SUGGESTED_TOP_SUBSCRIBED,
  SUGGESTED_FEATURED,
} from 'constants/subscriptions';

export type Subscription = {
  channelName: string, // @CryptoCandor,
  uri: string, // lbry://@CryptoCandor#9152f3b054f692076a6882d1b58a30e8781cc8e6
  latest?: string, // substratum#b0ab143243020e7831fd070d9f871e1fda948620
};

// Tracking for new content
// i.e. If a subscription has a DOWNLOADING type, we will trigger an OS notification
// to tell users there is new content from their subscriptions
export type SubscriptionNotificationType = DOWNLOADED | DOWNLOADING | NOTIFY_ONLY;

export type UnreadSubscription = {
  type: SubscriptionNotificationType,
  uris: Array<string>,
};

export type UnreadSubscriptions = {
  [string]: UnreadSubscription,
};

export type ViewMode = VIEW_LATEST_FIRST | VIEW_ALL;

export type SuggestedType = SUGGESTED_TOP_BID | SUGGESTED_TOP_SUBSCRIBED | SUGGESTED_FEATURED;

export type SuggestedSubscriptions = {
  [SuggestedType]: string,
};

export type SubscriptionState = {
  subscriptions: Array<Subscription>,
  unread: UnreadSubscriptions,
  loading: boolean,
  viewMode: ViewMode,
  suggested: SuggestedSubscriptions,
  loadingSuggested: boolean,
  firstRunCompleted: boolean,
  showSuggestedSubs: boolean,
};

//
// Action types
//
export type DoChannelSubscribe = {
  type: ACTIONS.CHANNEL_SUBSCRIBE,
  data: Subscription,
};

export type DoChannelUnsubscribe = {
  type: ACTIONS.CHANNEL_UNSUBSCRIBE,
  data: Subscription,
};

export type DoUpdateSubscriptionUnreads = {
  type: ACTIONS.UPDATE_SUBSCRIPTION_UNREADS,
  data: {
    channel: string,
    uris: Array<string>,
    type?: SubscriptionNotificationType,
  },
};

export type DoRemoveSubscriptionUnreads = {
  type: ACTIONS.REMOVE_SUBSCRIPTION_UNREADS,
  data: {
    channel: string,
    uris: Array<string>,
  },
};

export type SetSubscriptionLatest = {
  type: ACTIONS.SET_SUBSCRIPTION_LATEST,
  data: {
    subscription: Subscription,
    uri: string,
  },
};

export type CheckSubscriptionStarted = {
  type: ACTIONS.CHECK_SUBSCRIPTION_STARTED,
};

export type CheckSubscriptionCompleted = {
  type: ACTIONS.CHECK_SUBSCRIPTION_COMPLETED,
};

export type FetchedSubscriptionsSucess = {
  type: ACTIONS.FETCH_SUBSCRIPTIONS_SUCCESS,
  data: Array<Subscription>,
};

export type SetViewMode = {
  type: ACTIONS.SET_VIEW_MODE,
  data: ViewMode,
};

export type GetSuggestedSubscriptionsSuccess = {
  type: ACTIONS.GET_SUGGESTED_SUBSCRIPTIONS_START,
  data: SuggestedSubscriptions,
};
