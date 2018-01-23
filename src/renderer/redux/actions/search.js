import * as ACTIONS from 'constants/action_types';
import { normalizeURI } from 'lbryURI';
import { doResolveUri } from 'redux/actions/content';
import { doNavigate } from 'redux/actions/navigation';
import { selectCurrentPage } from 'redux/selectors/navigation';
import batchActions from 'util/batchActions';

// TODO: this should be in a util
const handleSearchApiResponse = searchResponse =>
  searchResponse.status === 200
    ? Promise.resolve(searchResponse.json())
    : Promise.reject(new Error(searchResponse.statusText));

export const doSearch = rawQuery => (dispatch, getState) => {
  const state = getState();
  const page = selectCurrentPage(state);

  const query = rawQuery.replace(/^lbry:\/\//i, '');

  if (!query) {
    dispatch({
      type: ACTIONS.SEARCH_FAIL,
    });
    return;
  }

  dispatch({
    type: ACTIONS.SEARCH_START,
    data: { query },
  });

  if (page !== 'search') {
    dispatch(doNavigate('search', { query }));
  } else {
    fetch(`https://lighthouse.lbry.io/search?s=${query}`)
      .then(handleSearchApiResponse)
      .then(data => {
        const uris = [];
        const actions = [];

        data.forEach(result => {
          const uri = buildURI({
            name: result.name,
            claimId: result.claimId,
          });
          actions.push(doResolveUri(uri));
          uris.push(uri);
        });

        actions.push({
          type: ACTIONS.SEARCH_SUCCESS,
          data: {
            query,
            uris,
          },
        });
        dispatch(batchActions(...actions));
      })
      .catch(() => {
        dispatch({
          type: ACTIONS.SEARCH_FAIL,
        });
      });
  }
};

export const updateSearchQuery = searchQuery => ({
  type: ACTIONS.UPDATE_SEARCH_QUERY,
  data: { searchQuery },
});

export const getSearchSuggestions = value => dispatch => {
  dispatch({ type: ACTIONS.SEARCH_SUGGESTIONS_START });
  if (!value) {
    dispatch({
      type: ACTIONS.GET_SEARCH_SUGGESTIONS_SUCCESS,
      data: [],
    });
    return;
  }

  // This should probably be more robust
  let searchValue = value;
  if (searchValue.startsWith('lbry://')) {
    searchValue = searchValue.slice(7);
  }

  // need to handle spaces in the query?
  fetch(`https://lighthouse.lbry.io/autocomplete?s=${searchValue}`)
    .then(handleSearchApiResponse)
    .then(suggestions => {
      const formattedSuggestions = suggestions.slice(0, 5).map(suggestion => ({
        label: suggestion,
        value: suggestion,
      }));

      // Should we add lbry://{query} as the first result?
      // If it's not a valid uri, then add a "search for {query}" result
      const searchLabel = `Search for "${value}"`;
      try {
        const uri = normalizeURI(value);
        formattedSuggestions.unshift(
          { label: uri, value: uri },
          { label: searchLabel, value: `${value}?search` }
        );
      } catch (e) {
        if (value) {
          formattedSuggestions.unshift({ label: searchLabel, value });
        }
      }

      return dispatch({
        type: ACTIONS.GET_SEARCH_SUGGESTIONS_SUCCESS,
        data: formattedSuggestions,
      });
    })
    .catch(err =>
      dispatch({
        type: ACTIONS.GET_SEARCH_SUGGESTIONS_FAIL,
        data: err,
      })
    );
};
