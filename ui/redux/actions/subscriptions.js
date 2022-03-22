// @flow
import * as ACTIONS from 'constants/action_types';
import { SIDEBAR_SUBS_DISPLAYED } from 'constants/subscriptions';
import REWARDS from 'rewards';
import { Lbryio } from 'lbryinc';
import { doClaimSearch } from 'redux/actions/claims';
import { doClaimRewardType } from 'redux/actions/rewards';
import { getChannelFromClaim } from 'util/claim';
import { parseURI } from 'util/lbryURI';
import { doAlertWaitingForSync } from 'redux/actions/app';
import { doToast } from 'redux/actions/notifications';
import { selectSubscriptions } from 'redux/selectors/subscriptions';

type SubscriptionArgs = {
  channelName: string,
  uri: string,
  notificationsDisabled?: boolean,
};

const FETCH_LAST_ACTIVE_SUBS_MIN_INTERVAL_MS = 5 * 60 * 1000;
let activeSubsLastFetchedTime = 0;

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
    const isSharingData = shareSetting || IS_WEB;

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
    if (isSharingData || IS_WEB) {
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

    // Reset last-fetch counter
    activeSubsLastFetchedTime = 0;
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

export function doFetchLastActiveSubs(forceFetch: boolean = false, count: number = SIDEBAR_SUBS_DISPLAYED) {
  function parseIdFromUri(uri) {
    try {
      const { channelClaimId } = parseURI(uri);
      return channelClaimId;
    } catch {
      return '';
    }
  }

  return (dispatch: Dispatch, getState: GetState) => {
    const now = Date.now();
    if (!forceFetch && now - activeSubsLastFetchedTime < FETCH_LAST_ACTIVE_SUBS_MIN_INTERVAL_MS) {
      dispatch({ type: ACTIONS.FETCH_LAST_ACTIVE_SUBS_SKIP });
      return;
    }

    const state = getState();
    const subscriptions = selectSubscriptions(state);
    const channelIds = subscriptions.map((sub) => parseIdFromUri(sub.uri));
    activeSubsLastFetchedTime = now;

    if (channelIds.length === 0) {
      dispatch({
        type: ACTIONS.FETCH_LAST_ACTIVE_SUBS_DONE,
        data: [],
      });
      return;
    }

    const searchOptions = {
      limit_claims_per_channel: 1,
      channel_ids: channelIds,
      claim_type: ['stream', 'repost'],
      page: 1,
      page_size: count,
      no_totals: true,
      order_by: ['release_time'],
    };

    dispatch(doClaimSearch(searchOptions))
      .then((results) => {
        const values = Object.values(results || {});
        dispatch({
          type: ACTIONS.FETCH_LAST_ACTIVE_SUBS_DONE,
          // $FlowFixMe https://github.com/facebook/flow/issues/2221
          data: values.map((v) => getChannelFromClaim(v.stream)),
        });
      })
      .catch(() => {
        dispatch({ type: ACTIONS.FETCH_LAST_ACTIVE_SUBS_FAIL });
      });
  };
}
