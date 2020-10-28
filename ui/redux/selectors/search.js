// @flow
import { SEARCH_TYPES } from 'constants/search';
import { getSearchQueryString } from 'util/query-params';
import { parseURI, makeSelectClaimForUri, makeSelectClaimIsNsfw, buildURI } from 'lbry-redux';
import { createSelector } from 'reselect';

type State = { search: SearchState };

export const selectState = (state: State): SearchState => state.search;

export const selectSearchValue: (state: State) => string = createSelector(selectState, state => state.searchQuery);

export const selectSearchOptions: (state: State) => SearchOptions = createSelector(selectState, state => state.options);

export const selectSuggestions: (state: State) => { [string]: Array<SearchSuggestion> } = createSelector(
  selectState,
  state => state.suggestions
);

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

export const selectResolvedSearchResultsByQuery: (
  state: State
) => { [string]: Array<ResolvedSearchResult> } = createSelector(selectState, state => state.resolvedResultsByQuery);

export const selectSearchBarFocused: boolean = createSelector(selectState, state => state.focused);

export const selectSearchSuggestions: Array<SearchSuggestion> = createSelector(
  selectSearchValue,
  selectSuggestions,
  (query: string, suggestions: { [string]: Array<string> }) => {
    if (!query) {
      return [];
    }
    const queryIsPrefix = query === 'lbry:' || query === 'lbry:/' || query === 'lbry://' || query === 'lbry://@';

    if (queryIsPrefix) {
      // If it is a prefix, wait until something else comes to figure out what to do
      return [];
    } else if (query.startsWith('lbry://')) {
      // If it starts with a prefix, don't show any autocomplete results
      // They are probably typing/pasting in a lbry uri
      let type: string;
      try {
        let { isChannel } = parseURI(query);
        type = isChannel ? SEARCH_TYPES.CHANNEL : SEARCH_TYPES.FILE;
      } catch (e) {
        type = SEARCH_TYPES.SEARCH;
      }

      return [
        {
          value: query,
          type: type,
        },
      ];
    }

    let searchSuggestions = [];
    searchSuggestions.push({
      value: query,
      type: SEARCH_TYPES.SEARCH,
    });

    try {
      const uriObj = parseURI(query);
      searchSuggestions.push({
        value: buildURI(uriObj),
        shorthand: uriObj.isChannel ? uriObj.channelName : uriObj.streamName,
        type: uriObj.isChannel ? SEARCH_TYPES.CHANNEL : SEARCH_TYPES.FILE,
      });
    } catch (e) {}

    searchSuggestions.push({
      value: query,
      type: SEARCH_TYPES.TAG,
    });

    const apiSuggestions = suggestions[query] || [];
    if (apiSuggestions.length) {
      searchSuggestions = searchSuggestions.concat(
        apiSuggestions
          .filter(suggestion => suggestion !== query)
          .map(suggestion => {
            // determine if it's a channel
            try {
              const uriObj = parseURI(suggestion);
              return {
                value: buildURI(uriObj),
                shorthand: uriObj.isChannel ? uriObj.channelName : uriObj.streamName,
                type: uriObj.isChannel ? SEARCH_TYPES.CHANNEL : SEARCH_TYPES.FILE,
              };
            } catch (e) {
              // search result includes some character that isn't valid in claim names
              return {
                value: suggestion,
                type: SEARCH_TYPES.SEARCH,
              };
            }
          })
      );
    }

    return searchSuggestions;
  }
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
    makeSelectClaimForUri(uriFromQuery),
    makeSelectClaimForUri(channelUriFromQuery),
    (claim1, claim2) => {
      if (!claim1 && !claim2) {
        return undefined;
      } else if (!claim1 && claim2) {
        return claim2.canonical_url;
      } else if (claim1 && !claim2) {
        return claim1.canonical_url;
      }

      const effectiveAmount1 = claim1 && claim1.meta.effective_amount;
      const effectiveAmount2 = claim2 && claim2.meta.effective_amount;
      return effectiveAmount1 > effectiveAmount2 ? claim1.canonical_url : claim2.canonical_url;
    }
  );
};
