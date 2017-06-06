import * as types from "constants/action_types";
import lbry from "lbry";
import lbryio from "lbryio";
import { doResolveUri } from "actions/content";
import { selectResolvingUris } from "selectors/content";
import { selectClaimsByUri } from "selectors/claims";
import { selectSettingsIsGenerous } from "selectors/settings";

export function doFetchCostInfoForUri(uri) {
  return function(dispatch, getState) {
    const state = getState(),
      claim = selectClaimsByUri(state)[uri],
      isResolving = selectResolvingUris(state).indexOf(uri) !== -1,
      isGenerous = selectSettingsIsGenerous(state);

    if (claim === null) {
      //claim doesn't exist, nothing to fetch a cost for
      return;
    }

    if (!claim) {
      setTimeout(() => {
        dispatch(doFetchCostInfoForUri(uri));
      }, 1000);
      if (!isResolving) {
        dispatch(doResolveUri(uri));
      }
      return;
    }

    function begin() {
      dispatch({
        type: types.FETCH_COST_INFO_STARTED,
        data: {
          uri,
        },
      });
    }

    function resolve(costInfo) {
      dispatch({
        type: types.FETCH_COST_INFO_COMPLETED,
        data: {
          uri,
          costInfo,
        },
      });
    }

    if (isGenerous && claim) {
      let cost;
      const fee = claim.value.stream.metadata.fee;
      if (fee === undefined) {
        resolve({ cost: 0, includesData: true });
      } else if (fee.currency == "LBC") {
        resolve({ cost: fee.amount, includesData: true });
      } else {
        begin();
        lbryio.getExchangeRates().then(({ lbc_usd }) => {
          resolve({ cost: fee.amount / lbc_usd, includesData: true });
        });
      }
    } else {
      begin();
      lbry.getCostInfo(uri).then(resolve);
    }
  };
}
