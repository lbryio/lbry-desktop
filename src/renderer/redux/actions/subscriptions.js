// @flow
import * as ACTIONS from 'constants/action_types';
import type { Subscription, Dispatch } from 'redux/reducers/subscriptions';

export const doChannelSubscribe = (subscription: Subscription) => (dispatch: Dispatch) =>
  dispatch({
    type: ACTIONS.CHANNEL_SUBSCRIBE,
    data: subscription,
  });

export const doChannelUnsubscribe = (subscription: Subscription) => (dispatch: Dispatch) =>
  dispatch({
    type: ACTIONS.CHANNEL_UNSUBSCRIBE,
    data: subscription,
  });

export const setSubscriptionLatest = (subscription: Subscription, uri: string) => (dispatch: Dispatch) =>
{
  return dispatch({
    type: ACTIONS.SET_SUBSCRIPTION_LATEST,
    data: {
      subscription,
      uri
    }
  })
};

export const setHasFetchedSubscriptions = () => (dispatch: Dispatch) =>
  dispatch({ type: ACTIONS.HAS_FETCHED_SUBSCRIPTIONS });
