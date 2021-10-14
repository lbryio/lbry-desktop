// @flow
import { Lbryio } from 'lbryinc';
import * as ACTIONS from 'constants/action_types';

export const doFetchViewCount = (claimIdCsv: string) => (dispatch: Dispatch) => {
  dispatch({ type: ACTIONS.FETCH_VIEW_COUNT_STARTED });

  return Lbryio.call('file', 'view_count', { claim_id: claimIdCsv })
    .then((result: Array<number>) => {
      const viewCounts = result;
      dispatch({ type: ACTIONS.FETCH_VIEW_COUNT_COMPLETED, data: { claimIdCsv, viewCounts } });
    })
    .catch(error => {
      dispatch({ type: ACTIONS.FETCH_VIEW_COUNT_FAILED, data: error });
    });
};

export const doFetchSubCount = (claimId: string) => (dispatch: Dispatch) => {
  dispatch({ type: ACTIONS.FETCH_SUB_COUNT_STARTED });

  return Lbryio.call('subscription', 'sub_count', { claim_id: claimId })
    .then((result: Array<number>) => {
      const subCount = result[0];
      dispatch({
        type: ACTIONS.FETCH_SUB_COUNT_COMPLETED,
        data: { claimId, subCount },
      });
    })
    .catch(error => {
      dispatch({ type: ACTIONS.FETCH_SUB_COUNT_FAILED, data: error });
    });
};
