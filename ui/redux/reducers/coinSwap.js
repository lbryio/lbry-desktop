// @flow
import * as ACTIONS from 'constants/action_types';
import { ACTIONS as LBRY_REDUX_ACTIONS } from 'lbry-redux';
import { handleActions } from 'util/redux-utils';

const defaultState: CoinSwapState = {
  btcAddresses: [],
};

export default handleActions(
  {
    [ACTIONS.ADD_BTC_ADDRESS]: (state: CoinSwapState, action: CoinSwapAction): CoinSwapState => {
      const { btcAddresses } = state;
      const { btcAddress } = action.data;
      let newBtcAddresses = btcAddresses.slice();
      if (!newBtcAddresses.includes(btcAddress)) {
        newBtcAddresses.push(btcAddress);
      }
      return {
        btcAddresses: newBtcAddresses,
      };
    },
    [ACTIONS.REMOVE_BTC_ADDRESS]: (state: CoinSwapState, action: CoinSwapAction): CoinSwapState => {
      const { btcAddresses } = state;
      const { btcAddress } = action.data;
      let newBtcAddresses = btcAddresses.slice();
      newBtcAddresses = newBtcAddresses.filter((x) => x !== btcAddress);
      return {
        btcAddresses: newBtcAddresses,
      };
    },
    [LBRY_REDUX_ACTIONS.USER_STATE_POPULATE]: (
      state: CoinSwapState,
      action: { data: { btcAddresses: ?Array<string> } }
    ) => {
      const { btcAddresses } = action.data;
      const sanitizedBtcAddresses = btcAddresses && btcAddresses.filter((e) => typeof e === 'string');
      return {
        ...state,
        btcAddresses:
          sanitizedBtcAddresses && sanitizedBtcAddresses.length ? sanitizedBtcAddresses : state.btcAddresses,
      };
    },
  },
  defaultState
);
