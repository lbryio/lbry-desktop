// @flow
import * as ACTIONS from 'constants/action_types';
import type { Subscription, Dispatch, SubscriptionState } from 'redux/reducers/subscriptions';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import Lbry from 'lbry';
import { doPurchaseUri } from 'redux/actions/content';
import { doNavigate } from 'redux/actions/navigation';
import { buildURI } from 'lbryURI';
import analytics from 'analytics';

const CHECK_SUBSCRIPTIONS_INTERVAL = 60 * 60 * 1000;

export const doChannelSubscribe = (subscription: Subscription) => (dispatch: Dispatch) => {
  dispatch({
    type: ACTIONS.CHANNEL_SUBSCRIBE,
    data: subscription,
  });

  analytics.apiLogSubscribe(subscription);

  dispatch(doCheckSubscription(subscription, true));
}

export const doChannelUnsubscribe = (subscription: Subscription) => (dispatch: Dispatch) => {
  dispatch({
    type: ACTIONS.CHANNEL_UNSUBSCRIBE,
    data: subscription,
  });

  analytics.apiLogUnsubscribe(subscription);
}

export const doCheckSubscriptions = () => (
  dispatch: Dispatch,
  getState: () => SubscriptionState
) => {
  const checkSubscriptionsTimer = setInterval(
    () =>
      selectSubscriptions(getState()).map((subscription: Subscription) =>
        dispatch(doCheckSubscription(subscription, true))
      ),
    CHECK_SUBSCRIPTIONS_INTERVAL
  );
  dispatch({
    type: ACTIONS.CHECK_SUBSCRIPTIONS_SUBSCRIBE,
    data: { checkSubscriptionsTimer },
  });
};

export const doCheckSubscription = (subscription: Subscription, notify?: boolean) => (
  dispatch: Dispatch
) => {
  dispatch({
    type: ACTIONS.CHECK_SUBSCRIPTION_STARTED,
    data: subscription,
  });

  Lbry.claim_list_by_channel({ uri: subscription.uri, page: 1 }).then(result => {
    const claimResult = result[subscription.uri] || {};
    const { claims_in_channel: claimsInChannel } = claimResult;

    const count = subscription.latest
      ? claimsInChannel.reduce(
          (prev, cur, index) =>
            buildURI({ contentName: cur.name, claimId: cur.claim_id }, false) ===
            subscription.latest
              ? index
              : prev,
          -1
        )
      : 1;

    if (count !== 0 && notify) {
      if (!claimsInChannel[0].value.stream.metadata.fee) {
        dispatch(
          doPurchaseUri(
            buildURI(
              { contentName: claimsInChannel[0].name, claimId: claimsInChannel[0].claim_id },
              false
            ),
            { cost: 0 }
          )
        );
      }

      const notif = new window.Notification(subscription.channelName, {
        body: `Posted ${claimsInChannel[0].value.stream.metadata.title}${
          count > 1 ? ` and ${count - 1} other new items` : ''
        }${count < 0 ? ' and 9+ other new items' : ''}`,
        silent: false,
      });
      notif.onclick = () => {
        dispatch(
          doNavigate('/show', {
            uri: buildURI(
              { contentName: claimsInChannel[0].name, claimId: claimsInChannel[0].claim_id },
              true
            ),
          })
        );
      };
    }

    dispatch(
      setSubscriptionLatest(
        {
          channelName: claimsInChannel[0].channel_name,
          uri: buildURI(
            { channelName: claimsInChannel[0].channel_name, claimId: claimsInChannel[0].claim_id },
            false
          ),
        },
        buildURI(
          { contentName: claimsInChannel[0].name, claimId: claimsInChannel[0].claim_id },
          false
        )
      )
    );

    dispatch({
      type: ACTIONS.CHECK_SUBSCRIPTION_COMPLETED,
      data: subscription,
    });
  });
};

export const setSubscriptionLatest = (subscription: Subscription, uri: string) => (
  dispatch: Dispatch
) =>
  dispatch({
    type: ACTIONS.SET_SUBSCRIPTION_LATEST,
    data: {
      subscription,
      uri,
    },
  });

export const setHasFetchedSubscriptions = () => (dispatch: Dispatch) =>
  dispatch({ type: ACTIONS.HAS_FETCHED_SUBSCRIPTIONS });
