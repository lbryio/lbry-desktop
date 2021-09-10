// @flow

type State = { coinSwap: CoinSwapState };

const selectState = (state: State) => state.coinSwap || {};

export const selectCoinSwaps = (state: State) => selectState(state).coinSwaps;
