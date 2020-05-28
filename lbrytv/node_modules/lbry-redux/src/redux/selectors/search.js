// @flow
import { SEARCH_TYPES, SEARCH_OPTIONS } from 'constants/search';
import { getSearchQueryString } from 'util/query-params';
import { normalizeURI, parseURI } from 'lbryURI';
import { createSelector } from 'reselect';

type State = { search: SearchState };

export const selectState = (state: State): SearchState => state.search;

export const selectSearchValue: (state: State) => string = createSelector(
  selectState,
  state => state.searchQuery
);

export const selectSearchOptions: (state: State) => SearchOptions = createSelector(
  selectState,
  state => state.options
);

export const selectSuggestions: (
  state: State
) => { [string]: Array<SearchSuggestion> } = createSelector(
  selectState,
  state => state.suggestions
);

export const selectIsSearching: (state: State) => boolean = createSelector(
  selectState,
  state => state.searching
);

export const selectSearchUrisByQuery: (
  state: State
) => { [string]: Array<string> } = createSelector(
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
) => { [string]: Array<ResolvedSearchResult> } = createSelector(
  selectState,
  state => state.resolvedResultsByQuery
);

export const selectResolvedSearchResultsByQueryLastPageReached: (
  state: State
) => { [string]: Array<boolean> } = createSelector(
  selectState,
  state => state.resolvedResultsByQueryLastPageReached
);

export const makeSelectResolvedSearchResults = (
  query: string
): ((state: State) => Array<ResolvedSearchResult>) =>
  // replace statement below is kind of ugly, and repeated in doSearch action
  createSelector(
    selectResolvedSearchResultsByQuery,
    byQuery => byQuery[query ? query.replace(/^lbry:\/\//i, '').replace(/\//, ' ') : query]
  );

export const makeSelectResolvedSearchResultsLastPageReached = (
  query: string
): ((state: State) => boolean) =>
  // replace statement below is kind of ugly, and repeated in doSearch action
  createSelector(
    selectResolvedSearchResultsByQueryLastPageReached,
    byQuery => byQuery[query ? query.replace(/^lbry:\/\//i, '').replace(/\//, ' ') : query]
  );

export const selectSearchBarFocused: boolean = createSelector(
  selectState,
  state => state.focused
);

export const selectSearchSuggestions: Array<SearchSuggestion> = createSelector(
  selectSearchValue,
  selectSuggestions,
  (query: string, suggestions: { [string]: Array<string> }) => {
    if (!query) {
      return [];
    }
    const queryIsPrefix =
      query === 'lbry:' || query === 'lbry:/' || query === 'lbry://' || query === 'lbry://@';

    if (queryIsPrefix) {
      // If it is a prefix, wait until something else comes to figure out what to do
      return [];
    } else if (query.startsWith('lbry://')) {
      // If it starts with a prefix, don't show any autocomplete results
      // They are probably typing/pasting in a lbry uri
      return [
        {
          value: query,
          type: query[7] === '@' ? SEARCH_TYPES.CHANNEL : SEARCH_TYPES.FILE,
        },
      ];
    }

    let searchSuggestions = [];
    try {
      const uri = normalizeURI(query);
      const { channelName, streamName, isChannel } = parseURI(uri);
      searchSuggestions.push(
        {
          value: query,
          type: SEARCH_TYPES.SEARCH,
        },
        {
          value: uri,
          shorthand: isChannel ? channelName : streamName,
          type: isChannel ? SEARCH_TYPES.CHANNEL : SEARCH_TYPES.FILE,
        }
      );
    } catch (e) {
      searchSuggestions.push({
        value: query,
        type: SEARCH_TYPES.SEARCH,
      });
    }

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
              const uri = normalizeURI(suggestion);
              const { channelName, streamName, isChannel } = parseURI(uri);

              return {
                value: uri,
                shorthand: isChannel ? channelName : streamName,
                type: isChannel ? SEARCH_TYPES.CHANNEL : SEARCH_TYPES.FILE,
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
  createSelector(
    selectSearchValue,
    selectSearchOptions,
    (query, defaultOptions) => {
      const searchOptions = { ...defaultOptions, ...options };
      const queryString = getSearchQueryString(customQuery || query, searchOptions);

      return queryString;
    }
  );
