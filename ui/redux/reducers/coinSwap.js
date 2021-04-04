// @flow
import * as ACTIONS from 'constants/action_types';
import { ACTIONS as LBRY_REDUX_ACTIONS } from 'lbry-redux';
import { handleActions } from 'util/redux-utils';

const defaultState: CoinSwapState = {
  coinSwaps: [],
};

export default handleActions(
  {
    [ACTIONS.ADD_COIN_SWAP]: (state: CoinSwapState, action: CoinSwapAction): CoinSwapState => {
      const { coinSwaps } = state;
      const { coin, sendAddress, sendAmount, lbcAmount } = action.data;

      let newCoinSwaps = coinSwaps.slice();
      if (!newCoinSwaps.find((x) => x.sendAddress === sendAddress)) {
        newCoinSwaps.push({
          coin: coin,
          sendAddress: sendAddress,
          sendAmount: sendAmount,
          lbcAmount: lbcAmount,
        });
      }

      return {
        coinSwaps: newCoinSwaps,
      };
    },
    [ACTIONS.REMOVE_COIN_SWAP]: (state: CoinSwapState, action: CoinSwapRemoveAction): CoinSwapState => {
      const { coinSwaps } = state;
      const { sendAddress } = action.data;
      let newCoinSwaps = coinSwaps.slice();
      newCoinSwaps = newCoinSwaps.filter((x) => x.sendAddress !== sendAddress);
      return {
        coinSwaps: newCoinSwaps,
      };
    },
    [LBRY_REDUX_ACTIONS.USER_STATE_POPULATE]: (
      state: CoinSwapState,
      action: { data: { coinSwaps: ?Array<CoinSwapInfo> } }
    ) => {
      const { coinSwaps } = action.data;
      const sanitizedCoinSwaps = coinSwaps && coinSwaps.filter((x) => typeof x.sendAddress === 'string');
      return {
        ...state,
        coinSwaps: sanitizedCoinSwaps && sanitizedCoinSwaps.length ? sanitizedCoinSwaps : state.coinSwaps,
      };
    },
  },
  defaultState
);
