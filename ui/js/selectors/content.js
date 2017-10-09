import { createSelector } from "reselect";

export const _selectState = state => state.content || {};

export const selectFeaturedUris = createSelector(
  _selectState,
  state => state.featuredUris
);

export const selectSubscriptions = createSelector(_selectState, state => {
  function selectContent(content, subscriptions, index) {
    if (content.length === 10 || subscriptions.length === 0) return content;
    if (subscriptions[index] && subscriptions[index].length) {
      content.push(subscriptions[index][0]);
      subscriptions[index] = subscriptions[index].slice(1);
    } else if (subscriptions[index]) {
      subscriptions.splice(index, 1);
    }
    return selectContent(
      content,
      subscriptions,
      index + 1 >= subscriptions.length ? 0 : index + 1
    );
  }

  return selectContent([], Object.values(state.subscriptionContent), 0).map(
    _ => `${_.name}#${_.claim_id}`
  );
});

export const selectFetchingFeaturedUris = createSelector(
  _selectState,
  state => !!state.fetchingFeaturedContent
);

export const selectResolvingUris = createSelector(
  _selectState,
  state => state.resolvingUris || []
);

export const selectPlayingUri = createSelector(
  _selectState,
  state => state.playingUri
);

export const makeSelectIsUriResolving = uri => {
  return createSelector(
    selectResolvingUris,
    resolvingUris => resolvingUris && resolvingUris.indexOf(uri) != -1
  );
};

export const selectChannelPages = createSelector(
  _selectState,
  state => state.channelPages || {}
);

export const makeSelectTotalPagesForChannel = uri => {
  return createSelector(selectChannelPages, byUri => byUri && byUri[uri]);
};

export const selectRewardContentClaimIds = createSelector(
  _selectState,
  state => state.rewardedContentClaimIds
);
