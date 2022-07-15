// @flow
import * as ACTIONS from 'constants/action_types';
import { Lbryio } from 'lbryinc';
import { selectClaimForUri } from 'redux/selectors/claims';

// eslint-disable-next-line import/prefer-default-export
export function doFetchCostInfoForUri(uri: string) {
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const claim = selectClaimForUri(state, uri);

    if (!claim) return;

    const fee = claim.value ? claim.value.fee : undefined;

    let costInfo;
    if (fee === undefined) {
      costInfo = { cost: 0, includesData: true };
    } else if (fee.currency === 'LBC') {
      costInfo = { cost: fee.amount, includesData: true };
    } else {
      await Lbryio.getExchangeRates().then(({ LBC_USD }) => {
        costInfo = { cost: fee.amount / LBC_USD, includesData: true };
      });
    }

    dispatch({
      type: ACTIONS.FETCH_COST_INFO_COMPLETED,
      data: {
        uri,
        costInfo,
      },
    });

    return costInfo;
  };
}
