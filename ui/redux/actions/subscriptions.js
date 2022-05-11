// @flow
import * as ACTIONS from 'constants/action_types';
import REWARDS from 'rewards';
import { Lbryio } from 'lbryinc';
import { doClaimRewardType } from 'redux/actions/rewards';
import { parseURI } from 'util/lbryURI';
import { doAlertWaitingForSync } from 'redux/actions/app';
import { doLocalAddNotification, doToast } from 'redux/actions/notifications';
import { setUnion } from 'util/set-operations';
import { getNotificationFromClaim } from 'util/notifications';

import {
  makeSelectNotificationsDisabled,
  selectDownloadEnabledUrls,
  makeSelectLastReleaseForUri,
  selectSubscriptionUris,
} from 'redux/selectors/subscriptions';
import Lbry from '../../lbry';

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
    return dispatch(doAddUrisToDownloadQueue([uri]));
  };
}

export function doAddUrisToDownloadQueue(uris: Array<string>) {
  return (dispatch: Dispatch) => {
    return dispatch({
      type: ACTIONS.SUBSCRIPTION_DOWNLOAD_ADD,
      data: uris,
    });
  };
}

export function doRemoveUriFromDownloadQueue(uri: string) {
  return (dispatch: Dispatch) => {
    return dispatch({
      type: ACTIONS.SUBSCRIPTION_DOWNLOAD_REMOVE,
      data: uri,
    });
  };
}

export function doUpdateLastReleasesForUri(entries: { [string]: number }) {
  return (dispatch: Dispatch) => {
    return dispatch({
      type: ACTIONS.SUBSCRIPTION_RELEASE_UPDATE,
      // data: entries = { [uri]: timestamp } >
      data: entries,
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

export function doCheckChannelPublishes() {
  // finish this
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    // for sub in subs, if notify+ or download+, getnewpublishes()
    const subs = new Set(selectSubscriptionUris(state));
    const dls = new Set(selectDownloadEnabledUrls(state));
    const channels = Array.from(setUnion(subs, dls));

    for (const channelUri of channels) {
      // $FlowFixMe
      const hasNotify = !makeSelectNotificationsDisabled(channelUri)(state); // eslint-disable-line
      const hasDownload = dls.has(channelUri);
      const lastRelease = makeSelectLastReleaseForUri(channelUri)(state);
      if (hasNotify || hasDownload) {
        // getNewPublishes since ???
        let lastTime = Math.floor(Date.now() / 1000);
        const results = await Lbry.claim_search({
          channel: channelUri,
          release_time: `>${lastRelease}`,
          order_by: ['release_time'],
        });
        const latest = results.items;
        if (latest.length && latest[0].value && latest[0].value.release_time) {
          lastTime = latest[0].value.release_time;
        }
        // dispatch release time update()
        const notifications = [];
        const downloads = [];
        const releaseEntries = {}; // refactor to {} maybe
        for (const claim of latest) {
          if (hasNotify) {
            const notification = getNotificationFromClaim(claim);
            notifications.push(notification);
          }
          if (hasDownload) {
            downloads.push(claim.permanent_url);
          }
          releaseEntries[channelUri] = lastTime;
        }
        dispatch(doLocalAddNotification(notifications));
        dispatch(doAddUrisToDownloadQueue(downloads));
        // dispatch last check for channelUri
        dispatch(doUpdateLastReleasesForUri(releaseEntries));
      }
    }
    // do download
  };
}

export function doCheckChannelsSubscribe() {
  return (dispatch: Dispatch) => {
    dispatch(doCheckChannelPublishes());
    setInterval(() => dispatch(doCheckChannelPublishes()), 10000);
  };
}

export function doDownloadQueue() {
  return (dispatch: Dispatch) => {
    // for each download, trigger download,
    // if downloading, back off
  };
}
