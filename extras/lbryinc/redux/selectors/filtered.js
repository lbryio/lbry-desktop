import { createSelector } from 'reselect';

export const selectState = (state) => state.filtered || {};

export const selectFilteredOutpoints = (state) => selectState(state).filteredOutpoints;

export const selectFilteredOutpointMap = createSelector(selectFilteredOutpoints, (outpoints) =>
  outpoints
    ? outpoints.reduce((acc, val) => {
        const outpoint = `${val.txid}:${val.nout}`;
        acc[outpoint] = 1;
        return acc;
      }, {})
    : {}
);
