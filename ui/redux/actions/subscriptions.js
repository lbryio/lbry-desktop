// @flow
import * as ACTIONS from 'constants/action_types';
import REWARDS from 'rewards';
import { Lbryio } from 'lbryinc';
import { doClaimRewardType } from 'redux/actions/rewards';
import { parseURI } from 'util/lbryURI';
import { doAlertWaitingForSync } from 'redux/actions/app';
import { doToast } from 'redux/actions/notifications';
import { makeSelectNotificationsDisabled, selectSubscriptionUris } from '../selectors/subscriptions';

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
      settings: { daemonSettings },
      sync: { prefsReady: ready },
    } = getState();

    if (!ready) {
      return dispatch(doAlertWaitingForSync());
    }

    const { share_usage_data: shareSetting } = daemonSettings;
    const isSharingData = shareSetting;

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

    // if the user isn't sharing data, keep the subscriptions entirely in the app
    if (isSharingData) {
      const { channelClaimId } = parseURI(subscription.uri);

      if (!isSubscribed) {
        // They are sharing data, we can store their subscriptions in our internal database
        Lbryio.call('subscription', 'new', {
          channel_name: subscription.channelName,
          claim_id: channelClaimId,
          notifications_disabled: subscription.notificationsDisabled,
        });

        dispatch(doClaimRewardType(REWARDS.TYPE_SUBSCRIPTION, { failSilently: true }));
      } else {
        Lbryio.call('subscription', 'delete', {
          claim_id: channelClaimId,
        });
      }
    }
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

export function doAddUriToDownloadQueue(uri: string) {
  return (dispatch: Dispatch) => {
    return {
      type: ACTIONS.SUBSCRIPTION_DOWNLOAD_ADD,
      data: uri,
    };
  };
}

export function doRemoveUriFromDownloadQueue(uri: string) {
  return (dispatch: Dispatch) => {
    return {
      type: ACTIONS.SUBSCRIPTION_DOWNLOAD_REMOVE,
      data: uri,
    };
  };
}

export function doUpdateLastReleaseForUri(uri: string, timestamp: number) {
  return (dispatch: Dispatch) => {
    return dispatch({
      type: ACTIONS.SUBSCRIPTION_RELEASE_UPDATE,
      data: { uri, timestamp },
    });
  };
}

export function doSubscriptionDownloadEnableForUri(uri: string, enable: boolean) {
  return (dispatch: Dispatch) => {
    return dispatch({
      type: ACTIONS.SUBSCRIPTION_DOWNLOAD_TOGGLE,
      data: { uri, enable },
    });
  };
}

export function doCheckSubscribedPublishes() {
  // finish this
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    // for sub in subs, if notify+ or download+, getnewpublishes()
    const subs = selectSubscriptionUris(state);
    for (const sub in subs) {
      // $FlowFixMe
      const hasNotify = makeSelectNotificationsDisabled(sub.uri)(state); // eslint-disable-line
      // const shouldDownload =
      // doFileGet(uri)
    }

    // ./lbrynet claim search --channel_id="9d4c31875f534dc1f989db6c13b92ab1aab85ecf" --release_time=">1647101965" --order_by="release_time"
    // add most recent release time
    // add to downloads,
    // add notifications,
  };
}
