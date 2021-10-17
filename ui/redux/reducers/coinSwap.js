// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

const SWAP_HISTORY_LENGTH_LIMIT = 10;

function getBottomEntries(array, count) {
  const curCount = array.length;
  if (curCount < count) {
    return array;
  } else {
    return array.slice(curCount - count);
  }
}

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
        // If a pending swap is removed, the websocket will return an update
        // when it expires, for example, causing the entry to re-appear. This
        // might be a good thing (e.g. to get back accidental removals), but it
        // actually causes synchronization confusion across multiple instances.
        const IGNORED_DELETED_SWAPS = true;

        if (!IGNORED_DELETED_SWAPS) {
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
      }

      return {
        ...state,
        coinSwaps: newCoinSwaps,
      };
    },
    [ACTIONS.USER_STATE_POPULATE]: (state: CoinSwapState, action: { data: { coinSwapCodes: ?Array<string> } }) => {
      const { coinSwapCodes } = action.data;
      const newCoinSwaps = [];

      if (coinSwapCodes) {
        coinSwapCodes.forEach((chargeCode) => {
          if (chargeCode && typeof chargeCode === 'string') {
            const existingSwap = state.coinSwaps.find((x) => x.chargeCode === chargeCode);
            if (existingSwap) {
              newCoinSwaps.push({ ...existingSwap });
            } else {
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
          }
        });
      }

      return {
        ...state,
        coinSwaps: getBottomEntries(newCoinSwaps, SWAP_HISTORY_LENGTH_LIMIT),
      };
    },
  },
  defaultState
);
