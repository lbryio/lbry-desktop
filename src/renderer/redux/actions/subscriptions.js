// @flow
import * as ACTIONS from 'constants/action_types';
import * as NOTIFICATION_TYPES from 'constants/notification_types';
import * as SETTINGS from 'constants/settings';
import rewards from 'rewards';
import type { Dispatch, SubscriptionNotifications } from 'redux/reducers/subscriptions';
import type { Subscription } from 'types/subscription';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { Lbry, buildURI, parseURI, selectCurrentPage } from 'lbry-redux';
import { doPurchaseUri, doFetchClaimsByChannel } from 'redux/actions/content';
import { doClaimRewardType } from 'redux/actions/rewards';
import Promise from 'bluebird';
import Lbryio from 'lbryio';

const CHECK_SUBSCRIPTIONS_INTERVAL = 15 * 60 * 1000;
const SUBSCRIPTION_DOWNLOAD_LIMIT = 1;

export const doFetchMySubscriptions = () => (dispatch: Dispatch, getState: () => any) => {
  const {
    subscriptions: subscriptionState,
    settings: { daemonSettings },
  } = getState();
  const { subscriptions: reduxSubscriptions } = subscriptionState;
  const { share_usage_data: isSharingData } = daemonSettings;

  if (!isSharingData && isSharingData !== undefined) {
    // They aren't sharing their data, subscriptions will be handled by persisted redux state
    return;
  }

  // most of this logic comes from scenarios where the db isn't synced with redux
  // this will happen if the user stops sharing data
  dispatch({ type: ACTIONS.FETCH_SUBSCRIPTIONS_START });

  Lbryio.call('subscription', 'list')
    .then(dbSubscriptions => {
      const storedSubscriptions = dbSubscriptions || [];

      // User has no subscriptions in db or redux
      if (!storedSubscriptions.length && (!reduxSubscriptions || !reduxSubscriptions.length)) {
        return [];
      }

      // There is some mismatch between redux state and db state
      // If something is in the db, but not in redux, add it to redux
      // If something is in redux, but not in the db, add it to the db
      if (storedSubscriptions.length !== reduxSubscriptions.length) {
        const dbSubMap = {};
        const reduxSubMap = {};
        const subsNotInDB = [];
        const subscriptionsToReturn = reduxSubscriptions.slice();

        storedSubscriptions.forEach(sub => {
          dbSubMap[sub.claim_id] = 1;
        });

        reduxSubscriptions.forEach(sub => {
          const { claimId } = parseURI(sub.uri);
          reduxSubMap[claimId] = 1;

          if (!dbSubMap[claimId]) {
            subsNotInDB.push({
              claim_id: claimId,
              channel_name: sub.channelName,
            });
          }
        });

        storedSubscriptions.forEach(sub => {
          if (!reduxSubMap[sub.claim_id]) {
            const uri = `lbry://${sub.channel_name}#${sub.claim_id}`;
            subscriptionsToReturn.push({ uri, channelName: sub.channel_name });
          }
        });

        return Promise.all(subsNotInDB.map(payload => Lbryio.call('subscription', 'new', payload)))
          .then(() => subscriptionsToReturn)
          .catch(
            () =>
              // let it fail, we will try again when the navigate to the subscriptions page
              subscriptionsToReturn
          );
      }

      // DB is already synced, just return the subscriptions in redux
      return reduxSubscriptions;
    })
    .then(subscriptions => {
      dispatch({
        type: ACTIONS.FETCH_SUBSCRIPTIONS_SUCCESS,
        data: subscriptions,
      });

      subscriptions.forEach(({ uri }) => dispatch(doFetchClaimsByChannel(uri)));
    })
    .catch(() => {
      dispatch({
        type: ACTIONS.FETCH_SUBSCRIPTIONS_FAIL,
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

export const setSubscriptionNotification = (
  subscription: Subscription,
  uri: string,
  notificationType: string
) => (dispatch: Dispatch) =>
  dispatch({
    type: ACTIONS.SET_SUBSCRIPTION_NOTIFICATION,
    data: {
      subscription,
      uri,
      type: notificationType,
    },
  });

export const doCheckSubscription = (subscriptionUri: string, notify?: boolean) => (
  dispatch: Dispatch,
  getState: () => {}
) => {
  // no dispatching FETCH_CHANNEL_CLAIMS_STARTED; causes loading issues on <SubscriptionsPage>

  const state = getState();
  const currentPage = selectCurrentPage(state);
  const savedSubscription = state.subscriptions.subscriptions.find(
    sub => sub.uri === subscriptionUri
  );

  Lbry.claim_list_by_channel({ uri: subscriptionUri, page: 1 }).then(result => {
    const claimResult = result[subscriptionUri] || {};
    const { claims_in_channel: claimsInChannel } = claimResult;

    // may happen if subscribed to an abandoned channel or an empty channel
    if (!claimsInChannel) {
      return;
    }

    const latestIndex = claimsInChannel.findIndex(
      claim => `${claim.name}#${claim.claim_id}` === savedSubscription.latest
    );

    // if latest is 0, nothing has changed
    // when there is no subscription latest, it is either a newly subscriubed channel or
    // the user has cleared their cache. Either way, do not download or notify about new content
    // as that would download/notify 10 claims per channel
    if (claimsInChannel.length && latestIndex !== 0 && savedSubscription.latest) {
      let downloadCount = 0;
      claimsInChannel.slice(0, latestIndex === -1 ? 10 : latestIndex).forEach(claim => {
        const uri = buildURI({ contentName: claim.name, claimId: claim.claim_id }, false);
        const shouldDownload = Boolean(
          downloadCount < SUBSCRIPTION_DOWNLOAD_LIMIT &&
            !claim.value.stream.metadata.fee &&
            makeSelectClientSetting(SETTINGS.AUTO_DOWNLOAD)(state)
        );
        if (notify && currentPage !== 'subscriptions') {
          dispatch(
            setSubscriptionNotification(
              savedSubscription,
              uri,
              shouldDownload ? NOTIFICATION_TYPES.DOWNLOADING : NOTIFICATION_TYPES.NOTIFY_ONLY
            )
          );
        }
        if (shouldDownload) {
          downloadCount += 1;
          dispatch(doPurchaseUri(uri, { cost: 0 }, true));
        }
      });
    }

    // always setLatest; important for newly subscribed channels
    dispatch(
      setSubscriptionLatest(
        {
          channelName: claimsInChannel[0].channel_name,
          uri: buildURI(
            {
              channelName: claimsInChannel[0].channel_name,
              claimId: claimsInChannel[0].claim_id,
            },
            false
          ),
        },
        buildURI(
          { contentName: claimsInChannel[0].name, claimId: claimsInChannel[0].claim_id },
          false
        )
      )
    );

    // calling FETCH_CHANNEL_CLAIMS_COMPLETED after not calling STARTED
    // means it will delete a non-existant fetchingChannelClaims[uri]
    dispatch({
      type: ACTIONS.FETCH_CHANNEL_CLAIMS_COMPLETED,
      data: {
        uri: subscriptionUri,
        claims: claimsInChannel || [],
        page: 1,
      },
    });
  });
};

export const setSubscriptionNotifications = (notifications: SubscriptionNotifications) => (
  dispatch: Dispatch
) =>
  dispatch({
    type: ACTIONS.SET_SUBSCRIPTION_NOTIFICATIONS,
    data: {
      notifications,
    },
  });

export const doChannelSubscribe = (subscription: Subscription) => (
  dispatch: Dispatch,
  getState: () => any
) => {
  const {
    settings: { daemonSettings },
  } = getState();
  const { share_usage_data: isSharingData } = daemonSettings;

  dispatch({
    type: ACTIONS.CHANNEL_SUBSCRIBE,
    data: subscription,
  });

  // if the user isn't sharing data, keep the subscriptions entirely in the app
  if (isSharingData) {
    const { claimId } = parseURI(subscription.uri);
    // They are sharing data, we can store their subscriptions in our internal database
    Lbryio.call('subscription', 'new', {
      channel_name: subscription.channelName,
      claim_id: claimId,
    });

    dispatch(doClaimRewardType(rewards.SUBSCRIPTION, { failSilently: true }));
  }

  dispatch(doCheckSubscription(subscription.uri, true));
};

export const doChannelUnsubscribe = (subscription: Subscription) => (
  dispatch: Dispatch,
  getState: () => any
) => {
  const {
    settings: { daemonSettings },
  } = getState();
  const { share_usage_data: isSharingData } = daemonSettings;

  dispatch({
    type: ACTIONS.CHANNEL_UNSUBSCRIBE,
    data: subscription,
  });

  if (isSharingData) {
    const { claimId } = parseURI(subscription.uri);
    Lbryio.call('subscription', 'delete', {
      claim_id: claimId,
    });
  }
};

export const doCheckSubscriptions = () => (dispatch: Dispatch, getState: () => any) => {
  const state = getState();
  const subscriptions = selectSubscriptions(state);
  subscriptions.forEach((sub: Subscription) => {
    dispatch(doCheckSubscription(sub.uri, true));
  });
};

export const doCheckSubscriptionsInit = () => (dispatch: Dispatch) => {
  // doCheckSubscriptionsInit is called by doDaemonReady
  // setTimeout below is a hack to ensure redux is hydrated when subscriptions are checked
  // this will be replaced with <PersistGate> which reqiures a package upgrade
  setTimeout(() => dispatch(doFetchMySubscriptions()), 5000);
  setTimeout(() => dispatch(doCheckSubscriptions()), 10000);
  const checkSubscriptionsTimer = setInterval(
    () => dispatch(doCheckSubscriptions()),
    CHECK_SUBSCRIPTIONS_INTERVAL
  );
  dispatch({
    type: ACTIONS.CHECK_SUBSCRIPTIONS_SUBSCRIBE,
    data: { checkSubscriptionsTimer },
  });
};
