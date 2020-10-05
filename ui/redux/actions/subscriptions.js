// @flow
import * as ACTIONS from 'constants/action_types';
import REWARDS from 'rewards';
import { Lbryio } from 'lbryinc';
import { doClaimRewardType } from 'redux/actions/rewards';
import { selectUnreadByChannel } from 'redux/selectors/subscriptions';
import { parseURI } from 'lbry-redux';
import { doAlertWaitingForSync } from 'redux/actions/app';

export const doSetViewMode = (viewMode: ViewMode) => (dispatch: Dispatch) =>
  dispatch({
    type: ACTIONS.SET_VIEW_MODE,
    data: viewMode,
  });

export const setSubscriptionLatest = (subscription: Subscription, uri: string) => (dispatch: Dispatch) =>
  dispatch({
    type: ACTIONS.SET_SUBSCRIPTION_LATEST,
    data: {
      subscription,
      uri,
    },
  });

// Populate a channels unread subscriptions or update the type
export const doUpdateUnreadSubscriptions = (
  channelUri: string,
  uris: ?Array<string>,
  type: ?SubscriptionNotificationType
) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const unreadByChannel = selectUnreadByChannel(state);
  const currentUnreadForChannel: UnreadSubscription = unreadByChannel[channelUri];

  let newUris;
  let newType;

  if (!currentUnreadForChannel) {
    newUris = uris;
    newType = type;
  } else {
    if (uris) {
      // If a channel currently has no unread uris, just add them all
      if (!currentUnreadForChannel.uris || !currentUnreadForChannel.uris.length) {
        newUris = uris;
      } else {
        // They already have unreads and now there are new ones
        // Add the new ones to the beginning of the list
        // Make sure there are no duplicates
        const currentUnreadUris = currentUnreadForChannel.uris;
        newUris = uris.filter(uri => !currentUnreadUris.includes(uri)).concat(currentUnreadUris);
      }
    } else {
      newUris = currentUnreadForChannel.uris;
    }

    newType = type || currentUnreadForChannel.type;
  }

  dispatch({
    type: ACTIONS.UPDATE_SUBSCRIPTION_UNREADS,
    data: {
      channel: channelUri,
      uris: newUris,
      type: newType,
    },
  });
};

// Remove multiple files (or all) from a channels unread subscriptions
export const doRemoveUnreadSubscriptions = (channelUri: ?string, readUris: ?Array<string>) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState();
  const unreadByChannel = selectUnreadByChannel(state);

  // If no channel is passed in, remove all unread subscriptions from all channels
  if (!channelUri) {
    return dispatch({
      type: ACTIONS.REMOVE_SUBSCRIPTION_UNREADS,
      data: { channel: null },
    });
  }

  const currentChannelUnread = unreadByChannel[channelUri];
  if (!currentChannelUnread || !currentChannelUnread.uris) {
    // Channel passed in doesn't have any unreads
    return;
  }

  // For each uri passed in, remove it from the list of unread uris
  // If no uris are passed in, remove them all
  let newUris;
  if (readUris) {
    const urisToRemoveMap = readUris.reduce(
      (acc, val) => ({
        ...acc,
        [val]: true,
      }),
      {}
    );

    const filteredUris = currentChannelUnread.uris.filter(uri => !urisToRemoveMap[uri]);
    newUris = filteredUris.length ? filteredUris : null;
  } else {
    newUris = null;
  }

  dispatch({
    type: ACTIONS.REMOVE_SUBSCRIPTION_UNREADS,
    data: {
      channel: channelUri,
      uris: newUris,
    },
  });
};

// Remove a single file from a channels unread subscriptions
export const doRemoveUnreadSubscription = (channelUri: string, readUri: string) => (dispatch: Dispatch) => {
  dispatch(doRemoveUnreadSubscriptions(channelUri, [readUri]));
};

export const doChannelSubscribe = (subscription: Subscription) => (dispatch: Dispatch, getState: GetState) => {
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
    });

    dispatch(doClaimRewardType(REWARDS.TYPE_SUBSCRIPTION, { failSilently: true }));
  }
};

export const doChannelUnsubscribe = (subscription: Subscription) => (dispatch: Dispatch, getState: GetState) => {
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

export const doFetchRecommendedSubscriptions = () => (dispatch: Dispatch) => {
  dispatch({
    type: ACTIONS.GET_SUGGESTED_SUBSCRIPTIONS_START,
  });

  return Lbryio.call('subscription', 'suggest')
    .then(suggested =>
      dispatch({
        type: ACTIONS.GET_SUGGESTED_SUBSCRIPTIONS_SUCCESS,
        data: suggested,
      })
    )
    .catch(error =>
      dispatch({
        type: ACTIONS.GET_SUGGESTED_SUBSCRIPTIONS_FAIL,
        error,
      })
    );
};
