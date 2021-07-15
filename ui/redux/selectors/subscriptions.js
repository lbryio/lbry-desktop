import { SUGGESTED_FEATURED, SUGGESTED_TOP_SUBSCRIBED } from 'constants/subscriptions';
import { createSelector } from 'reselect';
import {
  selectAllFetchingChannelClaims,
  makeSelectChannelForClaimUri,
  parseURI,
  makeSelectClaimForUri,
  isURIEqual,
} from 'lbry-redux';
import { swapKeyAndValue } from 'util/swap-json';

// Returns the entire subscriptions state
const selectState = (state) => state.subscriptions || {};

// Returns the list of channel uris a user is subscribed to
export const selectSubscriptions = createSelector(
  selectState,
  (state) => state.subscriptions && state.subscriptions.sort((a, b) => a.channelName.localeCompare(b.channelName))
);

export const selectFollowing = createSelector(selectState, (state) => state.following && state.following);

// Fetching list of users subscriptions
export const selectIsFetchingSubscriptions = createSelector(selectState, (state) => state.loading);

// The current view mode on the subscriptions page
export const selectViewMode = createSelector(selectState, (state) => state.viewMode);

// Suggested subscriptions from internal apis
export const selectSuggested = createSelector(selectState, (state) => state.suggested);
export const selectIsFetchingSuggested = createSelector(selectState, (state) => state.loadingSuggested);
export const selectSuggestedChannels = createSelector(
  selectSubscriptions,
  selectSuggested,
  (userSubscriptions, suggested) => {
    if (!suggested) {
      return null;
    }

    // Swap the key/value because we will use the uri for everything, this just makes it easier
    // suggested is returned from the api with the form:
    // {
    //   featured: { "Channel label": uri, ... },
    //   top_subscribed: { "@channel": uri, ... }
    //   top_bid: { "@channel": uri, ... }
    // }
    // To properly compare the suggested subscriptions from our current subscribed channels
    // We only care about the uri, not the label

    // We also only care about top_subscribed and featured
    // top_bid could just be porn or a channel with no content
    const topSubscribedSuggestions = swapKeyAndValue(suggested[SUGGESTED_TOP_SUBSCRIBED]);
    const featuredSuggestions = swapKeyAndValue(suggested[SUGGESTED_FEATURED]);

    // Make sure there are no duplicates
    // If a uri isn't already in the suggested object, add it
    const suggestedChannels = { ...topSubscribedSuggestions };

    Object.keys(featuredSuggestions).forEach((uri) => {
      if (!suggestedChannels[uri]) {
        const channelLabel = featuredSuggestions[uri];
        suggestedChannels[uri] = channelLabel;
      }
    });

    userSubscriptions.forEach(({ uri }) => {
      // Note to passer bys:
      // Maybe we should just remove the `lbry://` prefix from subscription uris
      // Most places don't store them like that
      const subscribedUri = uri.slice('lbry://'.length);

      if (suggestedChannels[subscribedUri]) {
        delete suggestedChannels[subscribedUri];
      }
    });

    return Object.keys(suggestedChannels).map((uri) => ({
      uri,
      label: suggestedChannels[uri],
    }));
  }
);

export const selectFirstRunCompleted = createSelector(selectState, (state) => state.firstRunCompleted);
export const selectshowSuggestedSubs = createSelector(selectState, (state) => state.showSuggestedSubs);

// Fetching any claims that are a part of a users subscriptions
export const selectSubscriptionsBeingFetched = createSelector(
  selectSubscriptions,
  selectAllFetchingChannelClaims,
  (subscriptions, fetchingChannelClaims) => {
    const fetchingSubscriptionMap = {};
    subscriptions.forEach((sub) => {
      const isFetching = fetchingChannelClaims && fetchingChannelClaims[sub.uri];
      if (isFetching) {
        fetchingSubscriptionMap[sub.uri] = true;
      }
    });

    return fetchingSubscriptionMap;
  }
);

// Returns true if a user is subscribed to the channel associated with the uri passed in
// Accepts content or channel uris
export const makeSelectChannelInSubscriptions = (uri) =>
  createSelector(selectSubscriptions, (subscriptions) => subscriptions.some((sub) => sub.uri === uri));

export const makeSelectIsSubscribed = (uri) =>
  createSelector(
    selectSubscriptions,
    makeSelectChannelForClaimUri(uri, true),
    makeSelectClaimForUri(uri),
    (subscriptions, channelUri, claim) => {
      if (channelUri) {
        return subscriptions.some((sub) => isURIEqual(sub.uri, channelUri));
      }

      // If we couldn't get a channel uri from the claim uri, the uri passed in might be a channel already
      let isChannel;
      try {
        ({ isChannel } = parseURI(uri));
      } catch (e) {}

      if (isChannel && claim) {
        const uri = claim.permanent_url;
        return subscriptions.some((sub) => isURIEqual(sub.uri, uri));
      }

      if (isChannel && !claim) {
        return subscriptions.some((sub) => isURIEqual(sub.uri, uri));
      }

      return false;
    }
  );

export const makeSelectNotificationsDisabled = (uri) =>
  createSelector(
    selectFollowing,
    makeSelectChannelForClaimUri(uri, true),
    makeSelectClaimForUri(uri),
    (following, channelUri, claim) => {
      if (channelUri) {
        return following.some((following) => following.uri === channelUri && following.notificationsDisabled);
      }

      // If we couldn't get a channel uri from the claim uri, the uri passed in might be a channel already
      let isChannel;
      try {
        ({ isChannel } = parseURI(uri));
      } catch (e) {}

      if (isChannel && claim) {
        const uri = claim.permanent_url;
        const disabled = following.some((sub) => {
          return sub.uri === uri && sub.notificationsDisabled === true;
        });

        return disabled;
      }

      return true;
    }
  );
