import { createSelector } from 'reselect';

export const selectState = (state) => state.blacklist || {};

export const selectBlackListedOutpoints = (state) => selectState(state).blackListedOutpoints;

export const selectBlacklistedOutpointMap = createSelector(selectBlackListedOutpoints, (outpoints) =>
  outpoints
    ? outpoints.reduce((acc, val) => {
        const outpoint = `${val.txid}:${val.nout}`;
        acc[outpoint] = 1;
        return acc;
      }, {})
    : {}
);
