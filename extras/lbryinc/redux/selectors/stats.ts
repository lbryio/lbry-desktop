import {createSelector} from 'reselect';
import { selectClaimIdForUri } from 'redux/selectors/claims';

type State = {
  claims: any
};
// @ts-expect-error - TS2339 - Property 'stats' does not exist on type 'unknown'.
const selectState = (state: unknown) => state.stats || {};
export const selectViewCount = createSelector(selectState, state => state.viewCountById);
export const selectSubCount = createSelector(selectState, state => state.subCountById);

export const selectViewCountForUri = (state: State, uri: string) => {
  const claimId = selectClaimIdForUri(state, uri);
  const viewCountById = selectViewCount(state);
  return claimId ? viewCountById[claimId] || 0 : 0;
};

export const selectSubCountForUri = (state: State, uri: string) => {
  const claimId = selectClaimIdForUri(state, uri);
  const subCountById = selectSubCount(state);
  return claimId ? subCountById[claimId] || 0 : 0;
};
