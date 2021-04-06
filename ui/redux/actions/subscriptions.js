import * as ACTIONS from 'constants/action_types';
import REWARDS from 'rewards';
import { Lbryio } from 'lbryinc';
import { doClaimRewardType } from 'redux/actions/rewards';
import { parseURI } from 'lbry-redux';
import { doAlertWaitingForSync } from 'redux/actions/app';

export const doChannelSubscribe = subscription => (dispatch, getState) => {
  const {
    settings: { daemonSettings },
    sync: { prefsReady: ready },
  } = getState();

  if (!ready) {
    return dispatch(doAlertWaitingForSync());
  }

  const { share_usage_data: shareSetting } = daemonSettings;
  const isSharingData = shareSetting || IS_WEB;

  const subscriptionUri = subscription.uri;
  if (!subscriptionUri.startsWith('lbry://')) {
    throw Error(`Subscription uris must include the "lbry://" prefix.\nTried to subscribe to ${subscriptionUri}`);
  }

  dispatch({
    type: ACTIONS.CHANNEL_SUBSCRIBE,
    data: subscription,
  });

  // if the user isn't sharing data, keep the subscriptions entirely in the app
  if (isSharingData || IS_WEB) {
    const { channelClaimId } = parseURI(subscription.uri);
    // They are sharing data, we can store their subscriptions in our internal database
    Lbryio.call('subscription', 'new', {
      channel_name: subscription.channelName,
      claim_id: channelClaimId,
      notifications_disabled: subscription.notificationsDisabled,
    });

    dispatch(doClaimRewardType(REWARDS.TYPE_SUBSCRIPTION, { failSilently: true }));
  }
};

export const doChannelUnsubscribe = subscription => (dispatch, getState) => {
  const {
    settings: { daemonSettings },
    sync: { prefsReady: ready },
  } = getState();

  if (!ready) {
    return dispatch(doAlertWaitingForSync());
  }

  const { share_usage_data: shareSetting } = daemonSettings;
  const isSharingData = shareSetting || IS_WEB;

  dispatch({
    type: ACTIONS.CHANNEL_UNSUBSCRIBE,
    data: subscription,
  });

  if (isSharingData) {
    const { channelClaimId } = parseURI(subscription.uri);
    Lbryio.call('subscription', 'delete', {
      claim_id: channelClaimId,
    });
  }
};
