import * as types from "constants/action_types";
import lbryuri from "lbryuri";
import lighthouse from "lighthouse";
import { doResolveUri } from "actions/content";
import { doNavigate, doHistoryPush } from "actions/app";
import { selectCurrentPage } from "selectors/app";
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
      lighthouse.search(query).then(results => {
        const actions = [];

        results.forEach(result => {
          const uri = lbryuri.build({
            channelName: result.channel_name,
            contentName: result.name,
            claimId: result.channel_id || result.claim_id,
          });
          actions.push(doResolveUri(uri));
        });

        actions.push({
          type: types.SEARCH_COMPLETED,
          data: {
            query,
            results,
          },
        });

        dispatch(batchActions(...actions));
      });
    }
  };
}
