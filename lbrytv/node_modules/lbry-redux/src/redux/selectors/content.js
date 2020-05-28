// @flow
import { createSelector } from 'reselect';
import { makeSelectClaimForUri } from 'redux/selectors/claims';

export const selectState = (state: any) => state.content || {};

export const makeSelectContentPositionForUri = (uri: string) =>
  createSelector(
    selectState,
    makeSelectClaimForUri(uri),
    (state, claim) => {
      if (!claim) {
        return null;
      }
      const outpoint = `${claim.txid}:${claim.nout}`;
      const id = claim.claim_id;
      return state.positions[id] ? state.positions[id][outpoint] : null;
    }
  );
