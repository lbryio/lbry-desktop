import * as ACTIONS from 'constants/action_types';
import Lbryuri from 'lbryuri';
import { doResolveUri } from 'redux/actions/content';
import { doNavigate } from 'redux/actions/navigation';
import { selectCurrentPage } from 'redux/selectors/navigation';
import batchActions from 'util/batchActions';

// TODO: this should be in a util
const handleResponse = response =>
  response.status === 200
    ? Promise.resolve(response.json())
    : Promise.reject(new Error(response.statusText));

// eslint-disable-next-line import/prefer-default-export
export const doSearch = rawQuery => (dispatch, getState) => {
  const state = getState();
  const page = selectCurrentPage(state);

  const query = rawQuery.replace(/^lbry:\/\//i, '');

  if (!query) {
    dispatch({
      type: ACTIONS.SEARCH_CANCELLED,
    });
    return;
  }

  dispatch({
    type: ACTIONS.SEARCH_STARTED,
    data: { query },
  });

  if (page !== 'search') {
    dispatch(doNavigate('search', { query }));
  } else {
    fetch(`https://lighthouse.lbry.io/search?s=${query}`)
      .then(handleResponse)
      .then(data => {
        const uris = [];
        const actions = [];

        data.forEach(result => {
          const uri = Lbryuri.build({
            name: result.name,
            claimId: result.claimId,
          });
          actions.push(doResolveUri(uri));
          uris.push(uri);
        });

        actions.push({
          type: ACTIONS.SEARCH_COMPLETED,
          data: {
            query,
            uris,
          },
        });
        dispatch(batchActions(...actions));
      })
      .catch(() => {
        dispatch({
          type: ACTIONS.SEARCH_CANCELLED,
        });
      });
  }
};

export const updateSearchQuery = searchQuery => ({
  type: ACTIONS.UPDATE_SEARCH_QUERY,
  data: { searchQuery },
});

export const getSearchSuggestions = value => dispatch => {
  dispatch({ type: ACTIONS.GET_SEARCH_SUGGESTIONS_START });
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
    .then(handleResponse)
    .then(suggestions => {
      const formattedSuggestions = suggestions.slice(0, 5).map(suggestion => ({
        label: suggestion,
        value: suggestion,
      }));

      // Should we add lbry://{query} as the first result?
      // If it's not a valid uri, then add a "search for {query}" result
      const searchLabel = `Search for "${value}"`;
      try {
        const uri = Lbryuri.normalize(value);
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
