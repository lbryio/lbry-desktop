import { createSelector } from 'reselect';
import {
  selectAllClaimsByChannel,
  selectClaimsById,
  selectAllFetchingChannelClaims,
  makeSelectChannelForClaimUri,
  selectClaimsByUri,
  parseURI,
} from 'lbry-redux';

// Returns the entire subscriptions state
const selectState = state => state.subscriptions || {};

// Returns the list of channel uris a user is subscribed to
export const selectSubscriptions = createSelector(selectState, state => state.subscriptions);

// Fetching list of users subscriptions
export const selectIsFetchingSubscriptions = createSelector(selectState, state => state.loading);

// The current view mode on the subscriptions page
export const selectViewMode = createSelector(selectState, state => state.viewMode);

// Fetching any claims that are a part of a users subscriptions
export const selectSubscriptionsBeingFetched = createSelector(
  selectSubscriptions,
  selectAllFetchingChannelClaims,
  (subscriptions, fetchingChannelClaims) => {
    const fetchingSubscriptionMap = {};
    subscriptions.forEach(sub => {
      const isFetching = fetchingChannelClaims && fetchingChannelClaims[sub.uri];
      if (isFetching) {
        fetchingSubscriptionMap[sub.uri] = true;
      }
    });

    return fetchingSubscriptionMap;
  }
);

export const selectUnreadByChannel = createSelector(selectState, state => state.unread);

// Returns the current total of unread subscriptions
export const selectUnreadAmount = createSelector(selectUnreadByChannel, unreadByChannel => {
  const unreadChannels = Object.keys(unreadByChannel);
  let badges = 0;

  if (!unreadChannels.length) {
    return badges;
  }

  unreadChannels.forEach(channel => {
    badges += unreadByChannel[channel].uris.length;
  });

  return badges;
});

// Returns the uris with channels as an array with the channel with the newest content first
// If you just want the `unread` state, use selectUnread
export const selectUnreadSubscriptions = createSelector(
  selectUnreadAmount,
  selectUnreadByChannel,
  selectClaimsByUri,
  (unreadAmount, unreadByChannel, claimsByUri) => {
    // determine which channel has the newest content
    const unreadList = [];
    if (!unreadAmount) {
      return unreadList;
    }

    const channelUriList = Object.keys(unreadByChannel);

    // There is only one channel with unread notifications
    if (unreadAmount === 1) {
      channelUriList.forEach(channel => {
        const unreadChannel = {
          channel,
          uris: unreadByChannel[channel].uris,
        };
        unreadList.push(unreadChannel);
      });

      return unreadList;
    }

    channelUriList
      .sort((channel1, channel2) => {
        const latestUriFromChannel1 = unreadByChannel[channel1].uris[0];
        const latestClaimFromChannel1 = claimsByUri[latestUriFromChannel1] || {};
        const latestUriFromChannel2 = unreadByChannel[channel2].uris[0];
        const latestClaimFromChannel2 = claimsByUri[latestUriFromChannel2] || {};

        const latestHeightFromChannel1 = latestClaimFromChannel1.height || 0;
        const latestHeightFromChannel2 = latestClaimFromChannel2.height || 0;

        if (latestHeightFromChannel1 !== latestHeightFromChannel2) {
          return latestHeightFromChannel2 - latestHeightFromChannel1;
        }

        return 0;
      })
      .forEach(channel => {
        const unreadSubscription = unreadByChannel[channel];
        const unreadChannel = {
          channel,
          uris: unreadSubscription.uris,
        };

        unreadList.push(unreadChannel);
      });

    return unreadList;
  }
);

// Returns all unread subscriptions for a uri passed in
export const makeSelectUnreadByChannel = uri =>
  createSelector(selectUnreadByChannel, unread => unread[uri]);

// Returns the first page of claims for every channel a user is subscribed to
export const selectSubscriptionClaims = createSelector(
  selectAllClaimsByChannel,
  selectClaimsById,
  selectSubscriptions,
  selectUnreadByChannel,
  (channelIds, allClaims, savedSubscriptions, unreadByChannel) => {
    // no claims loaded yet
    if (!Object.keys(channelIds).length) {
      return [];
    }

    let fetchedSubscriptions = [];

    savedSubscriptions.forEach(subscription => {
      let channelClaims = [];

      // if subscribed channel has content
      if (channelIds[subscription.uri] && channelIds[subscription.uri]['1']) {
        // This will need to be more robust, we will want to be able to load more than the first page

        // Strip out any ids that will be shown as notifications
        const pageOneChannelIds = channelIds[subscription.uri]['1'];

        // we have the channel ids and the corresponding claims
        // loop over the list of ids and grab the claim
        pageOneChannelIds.forEach(id => {
          const grabbedClaim = allClaims[id];

          if (
            unreadByChannel[subscription.uri] &&
            unreadByChannel[subscription.uri].uris.some(uri => uri.includes(id))
          ) {
            grabbedClaim.isNew = true;
          }

          channelClaims = channelClaims.concat([grabbedClaim]);
        });
      }

      fetchedSubscriptions = fetchedSubscriptions.concat(channelClaims);
    });

    return fetchedSubscriptions;
  }
);

// Returns true if a user is subscribed to the channel associated with the uri passed in
// Accepts content or channel uris
export const makeSelectIsSubscribed = uri =>
  createSelector(
    selectSubscriptions,
    makeSelectChannelForClaimUri(uri, true),
    (subscriptions, channelUri) => {
      if (channelUri) {
        return subscriptions.some(sub => sub.uri === channelUri);
      }

      // If we couldn't get a channel uri from the claim uri, the uri passed in might be a channel already
      const { isChannel } = parseURI(uri);
      if (isChannel) {
        const uriWithPrefix = uri.startsWith('lbry://') ? uri : `lbry://${uri}`;
        return subscriptions.some(sub => sub.uri === uriWithPrefix);
      }

      return false;
    }
  );
