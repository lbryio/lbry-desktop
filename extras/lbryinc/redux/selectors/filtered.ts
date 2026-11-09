//@ts-nocheck
import {createSelector} from 'reselect';

export const selectState = state: unknown => state.filtered || {};

export const selectFilteredOutpoints = createSelector(
  selectState,
  state => state.filteredOutpoints
);

export const selectFilteredOutpointMap = createSelector(
  selectFilteredOutpoints,
  outpoints =>
    outpoints
      ? outpoints.reduce<Record<string, any>>((acc, val) => {
          const outpoint = `${val.txid}:${val.nout}`;
          acc[outpoint] = 1;
          return acc;
        }, {})
      : {}
);
