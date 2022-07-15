// @flow
import { Lbryio } from 'lbryinc';
import * as ACTIONS from 'constants/action_types';

const FETCH_SUB_COUNT_MIN_INTERVAL_MS = 5 * 60 * 1000;
const FETCH_SUB_COUNT_IDLE_FIRE_MS = 100;

export const doFetchViewCount = (claimIdCsv: string) => (dispatch: Dispatch) => {
  dispatch({ type: ACTIONS.FETCH_VIEW_COUNT_STARTED });

  return Lbryio.call('file', 'view_count', { claim_id: claimIdCsv })
    .then((result: Array<number>) => {
      const viewCounts = result;
      dispatch({ type: ACTIONS.FETCH_VIEW_COUNT_COMPLETED, data: { claimIdCsv, viewCounts } });
    })
    .catch((error) => {
      dispatch({ type: ACTIONS.FETCH_VIEW_COUNT_FAILED, data: error });
    });
};

const executeFetchSubCount = (claimIdCsv: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const subCountLastFetchedById = state.stats.subCountLastFetchedById;
  const now = Date.now();

  const claimIds = claimIdCsv.split(',').filter((id) => {
    const prev = subCountLastFetchedById[id];
    return !prev || now - prev > FETCH_SUB_COUNT_MIN_INTERVAL_MS;
  });

  if (claimIds.length === 0) {
    return;
  }

  dispatch({ type: ACTIONS.FETCH_SUB_COUNT_STARTED });

  return Lbryio.call('subscription', 'sub_count', { claim_id: claimIds.join(',') })
    .then((result: Array<number>) => {
      const subCounts = result;
      dispatch({
        type: ACTIONS.FETCH_SUB_COUNT_COMPLETED,
        data: { claimIds, subCounts, fetchDate: now },
      });
    })
    .catch((error) => {
      dispatch({ type: ACTIONS.FETCH_SUB_COUNT_FAILED, data: error });
    });
};

let fetchSubCountTimer;
let fetchSubCountQueue = '';

export const doFetchSubCount = (claimIdCsv: string) => (dispatch: Dispatch) => {
  if (fetchSubCountTimer) {
    clearTimeout(fetchSubCountTimer);
  }

  if (fetchSubCountQueue && !fetchSubCountQueue.endsWith(',')) {
    fetchSubCountQueue += ',';
  }

  fetchSubCountQueue += claimIdCsv;

  fetchSubCountTimer = setTimeout(() => {
    dispatch(executeFetchSubCount(fetchSubCountQueue));
    fetchSubCountQueue = '';
  }, FETCH_SUB_COUNT_IDLE_FIRE_MS);
};
