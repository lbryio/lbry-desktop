import { createSelector } from 'reselect';
import { selectAllClaimsByChannel, selectClaimsById } from './claims';

// get the entire subscriptions state
const selectState = state => state.subscriptions || {};

export const selectNotifications = createSelector(selectState, state => state.notifications);

// list of saved channel names and uris
export const selectSubscriptions = createSelector(selectState, state => state.subscriptions);

export const selectSubscriptionsFromClaims = createSelector(
  selectAllClaimsByChannel,
  selectClaimsById,
  selectSubscriptions,
  (channelIds, allClaims, savedSubscriptions) => {
    // no claims loaded yet
    if (!Object.keys(channelIds).length) {
      return [];
    }

    const fetchedSubscriptions = [];

    savedSubscriptions.forEach(subscription => {
      let channelClaims = [];

      // if subscribed channel has content
      if (channelIds[subscription.uri] && channelIds[subscription.uri]['1']) {
        // This will need to be more robust, we will want to be able to load more than the first page
        const pageOneChannelIds = channelIds[subscription.uri]['1'];

        // we have the channel ids and the corresponding claims
        // loop over the list of ids and grab the claim
        pageOneChannelIds.forEach(id => {
          const grabbedClaim = allClaims[id];
          channelClaims.push(grabbedClaim);
        });
      }

      // all we really need is a uri for each claim
      channelClaims = channelClaims.map(claim => `${claim.name}#${claim.claim_id}`);

      fetchedSubscriptions.push({
        claims: channelClaims,
        channelName: subscription.channelName,
        uri: subscription.uri,
      });
    });

    return fetchedSubscriptions;
  }
);
