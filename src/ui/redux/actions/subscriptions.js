// @flow
import * as ACTIONS from 'constants/action_types';
import { Lbryio, rewards, doClaimRewardType } from 'lbryinc';
import { selectUnreadByChannel } from 'redux/selectors/subscriptions';
import { parseURI, doResolveUris } from 'lbry-redux';

export const doSetViewMode = (viewMode: ViewMode) => (dispatch: Dispatch) =>
  dispatch({
    type: ACTIONS.SET_VIEW_MODE,
    data: viewMode,
  });

export const doFetchMySubscriptions = () => (dispatch: Dispatch, getState: GetState) => {
  const state: { subscriptions: SubscriptionState, settings: any } = getState();
  const { subscriptions: reduxSubscriptions } = state.subscriptions;
  const { share_usage_data: shareSetting } = state.settings.daemonSettings;
  const isSharingData = shareSetting || IS_WEB;

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
      // // User has no subscriptions in db or redux
      if (!storedSubscriptions.length && (!reduxSubscriptions || !reduxSubscriptions.length)) {
        return [];
      }

      // There is some mismatch between redux state and db state
      // If something is in the db, but not in redux, add it to redux
      // If something is in redux, but not in the db, add it to the db
      if (storedSubscriptions.length !== reduxSubscriptions.length) {
        const reduxSubMap = {};
        const subscriptionsToReturn = reduxSubscriptions.slice();

        reduxSubscriptions.forEach(sub => {
          const { channelClaimId } = parseURI(sub.uri);
          reduxSubMap[channelClaimId] = 1;
        });

        storedSubscriptions.forEach(sub => {
          if (!reduxSubMap[sub.claim_id]) {
            const uri = `lbry://${sub.channel_name}#${sub.claim_id}`;
            subscriptionsToReturn.push({ uri, channelName: sub.channel_name });
          }
        });

        return subscriptionsToReturn;
      }

      // DB is already synced, just return the subscriptions in redux
      return reduxSubscriptions;
    })
    .then((subscriptions: Array<Subscription>) => {
      dispatch({
        type: ACTIONS.FETCH_SUBSCRIPTIONS_SUCCESS,
        data: subscriptions,
      });

      dispatch(doResolveUris(subscriptions.map(({ uri }) => uri)));
    })
    .catch(() => {
      dispatch({
        type: ACTIONS.FETCH_SUBSCRIPTIONS_FAIL,
      });
    });
};

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
  } = getState();
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

    dispatch(doClaimRewardType(rewards.TYPE_SUBSCRIPTION, { failSilently: true }));
  }
};

export const doChannelUnsubscribe = (subscription: Subscription) => (dispatch: Dispatch, getState: GetState) => {
  const {
    settings: { daemonSettings },
  } = getState();
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
