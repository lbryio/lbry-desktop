import { createSelector } from 'reselect';
import { makeSelectClaimForUri } from 'lbry-redux';

// eslint-disable-next-line no-underscore-dangle
const _selectState = state => state.media || {};

export const selectMediaPaused = createSelector(_selectState, state => state.paused);

export const makeSelectMediaPositionForUri = uri =>
  createSelector(_selectState, makeSelectClaimForUri(uri), (state, claim) => {
    const outpoint = `${claim.txid}:${claim.nout}`;
    return state.positions[outpoint] || null;
  });
