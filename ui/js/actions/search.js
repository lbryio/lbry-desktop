import * as types from "constants/action_types";
import lbryuri from "lbryuri";
import { doResolveUri } from "actions/content";
import { doNavigate } from "actions/navigation";
import { selectCurrentPage } from "selectors/navigation";
import batchActions from "util/batchActions";

export function doSearch(query) {
  return function(dispatch, getState) {
    const state = getState();
    const page = selectCurrentPage(state);

    if (!query) {
      return dispatch({
        type: types.SEARCH_CANCELLED,
      });
    }

    dispatch({
      type: types.SEARCH_STARTED,
      data: { query },
    });

    if (page != "search") {
      dispatch(doNavigate("search", { query: query }));
    } else {
      fetch("https://lighthouse.lbry.io/search?s=" + query)
        .then(response => {
          return response.status === 200
            ? Promise.resolve(response.json())
            : Promise.reject(new Error(response.statusText));
        })
        .then(data => {
          console.log(data);
          let uris = [];
          let actions = [];

          data.forEach(result => {
            const uri = lbryuri.build({
              name: result.name,
              claimId: result.claimId,
            });
            actions.push(doResolveUri(uri));
            uris.push(uri);
          });

          actions.push({
            type: types.SEARCH_COMPLETED,
            data: {
              query,
              uris,
            },
          });
          dispatch(batchActions(...actions));
        })
        .catch(err => {
          console.log(err);
          dispatch({
            type: types.SEARCH_CANCELLED,
          });
        });
    }
  };
}
