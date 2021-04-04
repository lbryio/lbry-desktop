// @flow
import { createSelector } from 'reselect';

const selectState = (state: { coinSwap: CoinSwapState }) => state.coinSwap || {};

export const selectCoinSwaps = createSelector(selectState, (state: CoinSwapState) => {
  return state.coinSwaps.filter((x) => typeof x.sendAddress === 'string');
});
