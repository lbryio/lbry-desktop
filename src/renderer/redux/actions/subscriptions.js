// @flow
import * as actions from "constants/action_types";
import type { Subscription, Action, Dispatch } from "redux/reducers/subscriptions";
import lbry from "lbry";

export const channelSubscribe = (subscription: Subscription) => (
  dispatch: Dispatch
) => {
  return dispatch({
    type: actions.CHANNEL_SUBSCRIBE,
    data: subscription,
  });
};

export const channelUnsubscribe = (subscription: Subscription) => (
  dispatch: Dispatch
) => {
  return dispatch({
    type: actions.CHANNEL_UNSUBSCRIBE,
    data: subscription,
  });
};

export const setHasFetchedSubscriptions = () => (dispatch: Dispatch) => {
  return dispatch({ type: actions.HAS_FETCHED_SUBSCRIPTIONS })
}
