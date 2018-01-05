import * as ACTIONS from 'constants/action_types';
import Lbryuri from 'lbryuri';
import { doResolveUri } from 'redux/actions/content';
import { doNavigate } from 'redux/actions/navigation';
import { selectCurrentPage } from 'redux/selectors/navigation';
import batchActions from 'util/batchActions';

// eslint-disable-next-line import/prefer-default-export
export function doSearch(rawQuery) {
  return (dispatch, getState) => {
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
        .then(
          response =>
            response.status === 200
              ? Promise.resolve(response.json())
              : Promise.reject(new Error(response.statusText))
        )
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
}
