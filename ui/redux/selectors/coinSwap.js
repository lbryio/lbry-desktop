// @flow
import { createSelector } from 'reselect';

const selectState = (state: { coinSwap: CoinSwapState }) => state.coinSwap || {};

export const selectBtcAddresses = createSelector(selectState, (state: CoinSwapState) => {
  return state.btcAddresses.filter((x) => typeof x === 'string');
});
