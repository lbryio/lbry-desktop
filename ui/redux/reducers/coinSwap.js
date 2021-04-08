// @flow
import * as ACTIONS from 'constants/action_types';
import { ACTIONS as LBRY_REDUX_ACTIONS } from 'lbry-redux';
import { handleActions } from 'util/redux-utils';

const defaultState: CoinSwapState = {
  coinSwaps: [],
};

export default handleActions(
  {
    [ACTIONS.ADD_COIN_SWAP]: (state: CoinSwapState, action: CoinSwapAddAction): CoinSwapState => {
      const { coinSwaps } = state;
      const { chargeCode } = action.data;

      const newCoinSwaps = coinSwaps.slice();
      if (!newCoinSwaps.find((x) => x.chargeCode === chargeCode)) {
        newCoinSwaps.push({ ...action.data });
      }

      return {
        ...state,
        coinSwaps: newCoinSwaps,
      };
    },
    [ACTIONS.REMOVE_COIN_SWAP]: (state: CoinSwapState, action: CoinSwapRemoveAction): CoinSwapState => {
      const { coinSwaps } = state;
      const { chargeCode } = action.data;
      let newCoinSwaps = coinSwaps.slice();
      newCoinSwaps = newCoinSwaps.filter((x) => x.chargeCode !== chargeCode);
      return {
        ...state,
        coinSwaps: newCoinSwaps,
      };
    },
    [ACTIONS.COIN_SWAP_STATUS_RECEIVED]: (state: CoinSwapState, action: any) => {
      const { coinSwaps } = state;
      const newCoinSwaps = coinSwaps.slice();

      let exchange;
      let charge;

      if (action.data.event_data) {
        // Source: Websocket
        exchange = { lbc_txid: action.data.lbc_txid };
        charge = action.data.event_data;
      } else {
        // Source: btc/status
        exchange = action.data.Exchange;
        charge = action.data.Charge.data;
      }

      const calculateLbcAmount = (pricing, exchange, fallback) => {
        if (!exchange || !exchange.rate) {
          return fallback || 0;
        }

        const btcAmount = pricing['bitcoin'].amount;
        const SATOSHIS = 100000000;
        return (btcAmount * SATOSHIS) / exchange.rate;
      };

      const timeline = charge.timeline;
      const lastTimeline = timeline[timeline.length - 1];

      const index = newCoinSwaps.findIndex((x) => x.chargeCode === charge.code);
      if (index > -1) {
        newCoinSwaps[index] = {
          chargeCode: charge.code,
          coins: Object.keys(charge.addresses),
          sendAddresses: charge.addresses,
          sendAmounts: charge.pricing,
          lbcAmount: calculateLbcAmount(charge.pricing, exchange, newCoinSwaps[index].lbcAmount),
          status: {
            status: lastTimeline.status,
            receiptCurrency: lastTimeline.payment.value.currency,
            receiptTxid: lastTimeline.payment.transaction_id,
            lbcTxid: exchange.lbc_txid || '',
          },
        };
      } else {
        newCoinSwaps.push({
          chargeCode: charge.code,
          coins: Object.keys(charge.addresses),
          sendAddresses: charge.addresses,
          sendAmounts: charge.pricing,
          lbcAmount: calculateLbcAmount(charge.pricing, exchange, 0),
          status: {
            status: lastTimeline.status,
            receiptCurrency: lastTimeline.payment.value.currency,
            receiptTxid: lastTimeline.payment.transaction_id,
            lbcTxid: exchange.lbc_txid || '',
          },
        });
      }

      return {
        ...state,
        coinSwaps: newCoinSwaps,
      };
    },
    [LBRY_REDUX_ACTIONS.USER_STATE_POPULATE]: (
      state: CoinSwapState,
      action: { data: { coinSwapCodes: ?Array<string> } }
    ) => {
      const { coinSwapCodes } = action.data;
      const newCoinSwaps = state.coinSwaps.slice();

      if (coinSwapCodes) {
        coinSwapCodes.forEach((chargeCode) => {
          if (!newCoinSwaps.find((x) => x.chargeCode === chargeCode)) {
            newCoinSwaps.push({
              // Just restore the 'chargeCode', and query the other data
              // via 'btc/status' later.
              chargeCode: chargeCode,
              coins: [],
              sendAddresses: {},
              sendAmounts: {},
              lbcAmount: 0,
            });
          }
        });
      }

      return {
        ...state,
        coinSwaps: newCoinSwaps,
      };
    },
  },
  defaultState
);
