import * as settings from 'constants/settings';
import { createSelector } from 'reselect';
import lbryuri from 'lbryuri';
import { makeSelectClaimForUri } from 'redux/selectors/claims';

const _selectState = state => state.media || {};

export const selectMediaPaused = createSelector(_selectState, state => state.paused);

export const makeSelectMediaPositionForUri = uri =>
  createSelector(_selectState, makeSelectClaimForUri(uri), (state, claim) => {
    const outpoint = `${claim.txid}:${claim.nout}`;
    return state.positions[outpoint] || null;
  });
