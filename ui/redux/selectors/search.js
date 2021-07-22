// @flow
import { getSearchQueryString } from 'util/query-params';
import { selectShowMatureContent } from 'redux/selectors/settings';
import {
  parseURI,
  makeSelectClaimForUri,
  makeSelectClaimIsNsfw,
  buildURI,
  isClaimNsfw,
  makeSelectPendingClaimForUri,
  makeSelectIsUriResolving,
} from 'lbry-redux';
import { createSelector } from 'reselect';
import { createNormalizedSearchKey } from 'util/search';

type State = { search: SearchState };

export const selectState = (state: State): SearchState => state.search;

export const selectSearchValue: (state: State) => string = createSelector(selectState, (state) => state.searchQuery);

export const selectSearchOptions: (state: State) => SearchOptions = createSelector(
  selectState,
  (state) => state.options
);

export const selectIsSearching: (state: State) => boolean = createSelector(selectState, (state) => state.searching);

export const selectSearchUrisByQuery: (state: State) => { [string]: Array<string> } = createSelector(
  selectState,
  (state) => state.urisByQuery
);

export const selectHasReachedMaxResultsLength: (state: State) => { [boolean]: Array<boolean> } = createSelector(
  selectState,
  (state) => state.hasReachedMaxResultsLength
);

export const makeSelectSearchUris = (query: string): ((state: State) => Array<string>) =>
  // replace statement below is kind of ugly, and repeated in doSearch action
  createSelector(selectSearchUrisByQuery, (byQuery) => {
    if (query) {
      query = query.replace(/^lbry:\/\//i, '').replace(/\//, ' ');
      const normalizedQuery = createNormalizedSearchKey(query);
      return byQuery[normalizedQuery];
    }
    return byQuery[query];
  });

export const makeSelectHasReachedMaxResultsLength = (query: string): ((state: State) => boolean) =>
  createSelector(selectHasReachedMaxResultsLength, (hasReachedMaxResultsLength) => {
    if (query) {
      query = query.replace(/^lbry:\/\//i, '').replace(/\//, ' ');
      const normalizedQuery = createNormalizedSearchKey(query);
      return hasReachedMaxResultsLength[normalizedQuery];
    }
    return hasReachedMaxResultsLength[query];
  });

export const makeSelectRecommendedContentForUri = (uri: string) =>
  createSelector(
    makeSelectClaimForUri(uri),
    selectSearchUrisByQuery,
    makeSelectClaimIsNsfw(uri),
    (claim, searchUrisByQuery, isMature) => {
      let recommendedContent;
      if (claim) {
        // always grab full URL - this can change once search returns canonical
        const currentUri = buildURI({ streamClaimId: claim.claim_id, streamName: claim.name });

        const { title } = claim.value;

        if (!title) {
          return;
        }

        const options: {
          related_to?: string,
          nsfw?: boolean,
          isBackgroundSearch?: boolean,
        } = { related_to: claim.claim_id, isBackgroundSearch: true };

        options['nsfw'] = isMature;
        const searchQuery = getSearchQueryString(title.replace(/\//, ' '), options);
        const normalizedSearchQuery = createNormalizedSearchKey(searchQuery);

        let searchUris = searchUrisByQuery[normalizedSearchQuery];
        if (searchUris) {
          searchUris = searchUris.filter((searchUri) => searchUri !== currentUri);
          recommendedContent = searchUris;
        }
      }
      return recommendedContent;
    }
  );

export const makeSelectWinningUriForQuery = (query: string) => {
  const uriFromQuery = `lbry://${query}`;

  let channelUriFromQuery;
  try {
    const { isChannel } = parseURI(uriFromQuery);
    if (!isChannel) {
      channelUriFromQuery = `lbry://@${query}`;
    }
  } catch (e) {}

  return createSelector(
    selectShowMatureContent,
    makeSelectPendingClaimForUri(uriFromQuery),
    makeSelectClaimForUri(uriFromQuery),
    makeSelectClaimForUri(channelUriFromQuery),
    (matureEnabled, pendingClaim, claim1, claim2) => {
      const claim1Mature = claim1 && isClaimNsfw(claim1);
      const claim2Mature = claim2 && isClaimNsfw(claim2);
      let pendingAmount = pendingClaim && pendingClaim.amount;

      if (!claim1 && !claim2) {
        return undefined;
      } else if (!claim1 && claim2) {
        return matureEnabled ? claim2.canonical_url : claim2Mature ? undefined : claim2.canonical_url;
      } else if (claim1 && !claim2) {
        return matureEnabled
          ? claim1.repost_url || claim1.canonical_url
          : claim1Mature
          ? undefined
          : claim1.repost_url || claim1.canonical_url;
      }

      const effectiveAmount1 = claim1 && (claim1.repost_bid_amount || claim1.meta.effective_amount);
      // claim2 will never have a repost_bid_amount because reposts never start with "@"
      const effectiveAmount2 = claim2 && claim2.meta.effective_amount;

      if (!matureEnabled) {
        if (claim1Mature && !claim2Mature) {
          return claim2.canonical_url;
        } else if (claim2Mature && !claim1Mature) {
          return claim1.repost_url || claim1.canonical_url;
        } else if (claim1Mature && claim2Mature) {
          return undefined;
        }
      }

      const returnBeforePending =
        Number(effectiveAmount1) > Number(effectiveAmount2)
          ? claim1.repost_url || claim1.canonical_url
          : claim2.canonical_url;
      if (pendingAmount && pendingAmount > effectiveAmount1 && pendingAmount > effectiveAmount2) {
        return pendingAmount.permanent_url;
      } else {
        return returnBeforePending;
      }
    }
  );
};

export const makeSelectIsResolvingWinningUri = (query: string = '') => {
  const uriFromQuery = `lbry://${query}`;
  let channelUriFromQuery;
  try {
    const { isChannel } = parseURI(uriFromQuery);
    if (!isChannel) {
      channelUriFromQuery = `lbry://@${query}`;
    }
  } catch (e) {}

  return createSelector(
    makeSelectIsUriResolving(uriFromQuery),
    channelUriFromQuery ? makeSelectIsUriResolving(channelUriFromQuery) : () => {},
    (claim1IsResolving, claim2IsResolving) => {
      return claim1IsResolving || claim2IsResolving;
    }
  );
};
