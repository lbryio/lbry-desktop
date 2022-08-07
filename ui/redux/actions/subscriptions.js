// @flow
import * as ACTIONS from 'constants/action_types';
import { doAlertWaitingForSync } from 'redux/actions/app';
import { doToast } from 'redux/actions/notifications';

type SubscriptionArgs = {
  channelName: string,
  uri: string,
  notificationsDisabled?: boolean,
};

export function doToggleSubscription(
  subscription: SubscriptionArgs,
  followToast: boolean,
  isSubscribed: boolean = false
) {
  return async (dispatch: Dispatch, getState: GetState) => {
    const {
      sync: { prefsReady: ready },
    } = getState();

    if (!ready) {
      return dispatch(doAlertWaitingForSync());
    }

    if (!isSubscribed) {
      const subscriptionUri = subscription.uri;
      if (!subscriptionUri.startsWith('lbry://')) {
        throw Error(`Subscription uris must include the "lbry://" prefix.\nTried to subscribe to ${subscriptionUri}`);
      }
    }

    dispatch({
      type: !isSubscribed ? ACTIONS.CHANNEL_SUBSCRIBE : ACTIONS.CHANNEL_UNSUBSCRIBE,
      data: subscription,
    });

    if (followToast) {
      dispatch(
        doToast({
          message: __(!isSubscribed ? 'You followed %CHANNEL_NAME%!' : 'Unfollowed %CHANNEL_NAME%.', {
            CHANNEL_NAME: subscription.channelName,
          }),
        })
      );
    }
  };
}

export function doChannelSubscribe(subscription: SubscriptionArgs, followToast: boolean = true) {
  return (dispatch: Dispatch) => {
    return dispatch(doToggleSubscription(subscription, followToast));
  };
}

export function doChannelUnsubscribe(subscription: SubscriptionArgs, followToast: boolean = true) {
  return (dispatch: Dispatch) => {
    return dispatch(doToggleSubscription(subscription, followToast, true));
  };
}
