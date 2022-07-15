// @flow
import { selectClaimIdForUri } from 'redux/selectors/claims';

type State = { claims: any, stats: any, user: UserState };

const selectState = (state: State) => state.stats || {};
export const selectViewCount = (state: State) => selectState(state).viewCountById;
export const selectSubCount = (state: State) => selectState(state).subCountById;

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
