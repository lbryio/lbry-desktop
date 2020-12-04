// @flow
import { getSearchQueryString } from 'util/query-params';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import {
  parseURI,
  makeSelectClaimForUri,
  makeSelectClaimIsNsfw,
  buildURI,
  SETTINGS,
  isClaimNsfw,
  makeSelectPendingClaimUrlForName
} from 'lbry-redux';
import { createSelector } from 'reselect';

type State = { search: SearchState };

export const selectState = (state: State): SearchState => state.search;

export const selectSearchValue: (state: State) => string = createSelector(selectState, state => state.searchQuery);

export const selectSearchOptions: (state: State) => SearchOptions = createSelector(selectState, state => state.options);

export const selectIsSearching: (state: State) => boolean = createSelector(selectState, state => state.searching);

export const selectSearchUrisByQuery: (state: State) => { [string]: Array<string> } = createSelector(
  selectState,
  state => state.urisByQuery
);

export const makeSelectSearchUris = (query: string): ((state: State) => Array<string>) =>
  // replace statement below is kind of ugly, and repeated in doSearch action
  createSelector(
    selectSearchUrisByQuery,
    byQuery => byQuery[query ? query.replace(/^lbry:\/\//i, '').replace(/\//, ' ') : query]
  );

// Creates a query string based on the state in the search reducer
// Can be overrided by passing in custom sizes/from values for other areas pagination

type CustomOptions = {
  isBackgroundSearch?: boolean,
  size?: number,
  from?: number,
  related_to?: string,
  nsfw?: boolean,
};

export const makeSelectQueryWithOptions = (customQuery: ?string, options: CustomOptions) =>
  createSelector(selectSearchValue, selectSearchOptions, (query, defaultOptions) => {
    const searchOptions = { ...defaultOptions, ...options };
    const queryString = getSearchQueryString(customQuery || query, searchOptions);

    return queryString;
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

        if (!isMature) {
          options['nsfw'] = false;
        }
        const searchQuery = getSearchQueryString(title.replace(/\//, ' '), options);

        let searchUris = searchUrisByQuery[searchQuery];
        if (searchUris) {
          searchUris = searchUris.filter(searchUri => searchUri !== currentUri);
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
    makeSelectClientSetting(SETTINGS.SHOW_MATURE),
    makeSelectPendingClaimUrlForName(query),
    makeSelectClaimForUri(uriFromQuery),
    makeSelectClaimForUri(channelUriFromQuery),
    (matureEnabled, pendingClaimUrl, claim1, claim2) => {
      const claim1Mature = claim1 && isClaimNsfw(claim1);
      const claim2Mature = claim2 && isClaimNsfw(claim2);
      if (pendingClaimUrl) {
        return pendingClaimUrl;
      }
      if (!claim1 && !claim2) {
        return undefined;
      } else if (!claim1 && claim2) {
        return matureEnabled ? claim2.canonical_url : claim2Mature ? undefined : claim2.canonical_url;
      } else if (claim1 && !claim2) {
        return matureEnabled ? claim1.canonical_url : claim1Mature ? undefined : claim1.canonical_url;
      }

      const effectiveAmount1 = claim1 && claim1.meta.effective_amount;
      const effectiveAmount2 = claim2 && claim2.meta.effective_amount;

      if (!matureEnabled) {
        if (claim1Mature && !claim2Mature) {
          return claim2.canonical_url;
        } else if (claim2Mature && !claim1Mature) {
          return claim1.canonical_url;
        } else if (claim1Mature && claim2Mature) {
          return undefined;
        }
      }

      return Number(effectiveAmount1) > Number(effectiveAmount2) ? claim1.canonical_url : claim2.canonical_url;
    }
  );
};
