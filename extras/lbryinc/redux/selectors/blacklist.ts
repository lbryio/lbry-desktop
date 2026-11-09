//@ts-nocheck
import {createSelector} from 'reselect';

export const selectState = (state: unknown) => state.blacklist || {};

export const selectBlackListedOutpoints = createSelector(
  selectState,
  state => state.blackListedOutpoints
);

export const selectBlacklistedOutpointMap = createSelector(
  selectBlackListedOutpoints,
  outpoints =>
    outpoints
      ? outpoints.reduce<Record<string, any>>((acc, val) => {
          const outpoint = `${val.txid}:${val.nout}`;
          acc[outpoint] = 1;
          return acc;
        }, {})
      : {}
);
