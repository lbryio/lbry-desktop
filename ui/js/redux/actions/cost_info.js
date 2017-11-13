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
      isGenerous = selectSettingsIsGenerous(state);

    if (!claim) return null;

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

    /**
     * "Generous" check below is disabled. We're no longer attempting to include or estimate data fees regardless of settings.
     *
     * This should be modified when lbry.stream_cost_estimate is reliable and performant.
     */

    /*
      lbry.stream_cost_estimate({ uri }).then(cost => {
        cacheAndResolve(cost);
      }, reject);
     */

    const fee = claim.value && claim.value.stream && claim.value.stream.metadata
      ? claim.value.stream.metadata.fee
      : undefined;

    if (fee === undefined) {
      resolve({ cost: 0, includesData: true });
    } else if (fee.currency == "LBC") {
      resolve({ cost: fee.amount, includesData: true });
    } else {
      // begin();
      lbryio.getExchangeRates().then(({ lbc_usd }) => {
        resolve({ cost: fee.amount / lbc_usd, includesData: true });
      });
    }

    // if (isGenerous && claim) {
    //   let cost;
    //   const fee = claim.value &&
    //     claim.value.stream &&
    //     claim.value.stream.metadata
    //     ? claim.value.stream.metadata.fee
    //     : undefined;
    //   if (fee === undefined) {
    //     resolve({ cost: 0, includesData: true });
    //   } else if (fee.currency == "LBC") {
    //     resolve({ cost: fee.amount, includesData: true });
    //   } else {
    //     // begin();
    //     lbryio.getExchangeRates().then(({ lbc_usd }) => {
    //       resolve({ cost: fee.amount / lbc_usd, includesData: true });
    //     });
    //   }
    // } else {
    //   begin();
    //   lbry.getCostInfo(uri).then(resolve);
    // }
  };
}
