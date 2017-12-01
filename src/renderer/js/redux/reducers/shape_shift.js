import { handleActions } from "util/redux-utils";
import * as types from "constants/action_types";
import * as statuses from "constants/shape_shift";

const defaultState = {
  loading: true,
  updating: false,
  error: undefined,
  shiftSupportedCoins: [],
  originCoin: undefined,
  hasActiveShift: false,
  shiftDepositAddress: undefined, // shapeshift address to send your coins to
  shiftReturnAddress: undefined,
  shiftCoinType: undefined,
  shiftOrderId: undefined,
  shiftState: undefined,
  originCoinDepositMax: undefined,
  originCoinDepositMin: undefined,
  originCoinDepositFee: undefined,
};

export default handleActions(
  {
    [types.GET_SUPPORTED_COINS_START]: () => ({
      loading: true,
      error: undefined,
    }),
    [types.GET_SUPPORTED_COINS_SUCCESS]: (
      state,
      { data: shiftSupportedCoins }
    ) => ({
      error: undefined,
      shiftSupportedCoins,
    }),
    [types.GET_SUPPORTED_COINS_FAIL]: () => ({
      loading: false,
      error: true,
    }),

    [types.GET_COIN_STATS_START]: (state, { data: coin }) => ({
      updating: true,
      originCoin: coin,
    }),
    [types.GET_COIN_STATS_SUCCESS]: (state, { data: marketInfo }) => ({
      loading: false,
      updating: false,
      originCoinDepositMax: marketInfo.limit,
      // this will come in scientific notation
      // toFixed shows the real number, then regex to remove trailing zeros
      originCoinDepositMin: marketInfo.minimum
        .toFixed(10)
        .replace(/\.?0+$/, ""),
      originCoinDepositFee: marketInfo.minerFee,
    }),
    [types.GET_COIN_STATS_FAIL]: (state, { data: error }) => ({
      loading: false,
      error,
    }),

    [types.PREPARE_SHAPE_SHIFT_START]: () => ({
      error: undefined,
    }),
    [types.PREPARE_SHAPE_SHIFT_SUCCESS]: (
      state,
      { data: { deposit, depositType, returnAddress, orderId } }
    ) => ({
      hasActiveShift: true,
      shiftDepositAddress: deposit,
      shiftCoinType: depositType,
      shiftReturnAddress: returnAddress,
      shiftOrderId: orderId,
      shiftState: statuses.NO_DEPOSITS,
    }),
    [types.PREPARE_SHAPE_SHIFT_FAIL]: (state, { data: error }) => ({
      error: error.message,
    }),

    [types.CLEAR_SHAPE_SHIFT]: () => ({
      loading: false,
      updating: false,
      hasActiveShift: false,
      shiftDepositAddress: undefined,
      shiftReturnAddress: undefined,
      shiftCoinType: undefined,
      shiftOrderId: undefined,
      originCoin: "BTC",
    }),

    [types.GET_ACTIVE_SHIFT_START]: () => ({
      error: undefined,
      updating: true,
    }),
    [types.GET_ACTIVE_SHIFT_SUCCESS]: (state, { data: status }) => ({
      updating: false,
      shiftState: status,
    }),
    [types.GET_ACTIVE_SHIFT_FAIL]: (state, { data: error }) => ({
      updating: false,
      error: error.message,
    }),
  },
  defaultState
);
