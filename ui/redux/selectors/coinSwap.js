// @flow
import { createSelector } from 'reselect';

const selectState = (state) => state.coinSwap || {};

export const selectCoinSwaps = createSelector(selectState, (state: CoinSwapState) => {
  return state.coinSwaps;
});
