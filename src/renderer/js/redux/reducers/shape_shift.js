// @flow
import { handleActions } from "util/redux-utils";
import * as actions from "constants/action_types";
import * as statuses from "constants/shape_shift";

export type ShapeShiftState = {
  loading: boolean,
  updating: boolean,
  shiftSupportedCoins: Array<string>,
  hasActiveShift: boolean,
  originCoin: ?string,
  error: ?string,
  shiftDepositAddress: ?string,
  shiftReturnAddress: ?string,
  shiftCoinType: ?string,
  shiftOrderId: ?string,
  shiftState: ?string,
  originCoinDepositMax: ?number,
  // originCoinDepositMin is a string because we need to convert it from scientifc notation
  // it will usually be something like 0.00000001 coins
  // using Number(x) or parseInt(x) will either change it back to scientific notation or round to zero
  originCoinDepositMin: ?string,
  originCoinDepositFee: ?number,
};

// All ShapeShift actions that will have some payload
export type GetSupportedCoinsSuccess = {
  type: actions.GET_SUPPORTED_COINS_SUCCESS,
  data: Array<string>,
};
export type GetCoinStatsStart = {
  type: actions.GET_SUPPORTED_COINS_SUCCESS,
  data: string,
};
export type GetCoinStatsSuccess = {
  type: actions.GET_COIN_STATS_SUCCESS,
  data: ShapeShiftMarketInfo,
};
export type GetCoinStatsFail = {
  type: actions.GET_COIN_STATS_FAIL,
  data: string,
};
export type PrepareShapeShiftSuccess = {
  type: actions.PREPARE_SHAPE_SHIFT_SUCCESS,
  data: ActiveShiftInfo,
};
export type PrepareShapeShiftFail = {
  type: actions.PREPARE_SHAPE_SHIFT_FAIL,
  data: ShapeShiftErrorResponse,
};
export type GetActiveShiftSuccess = {
  type: actions.GET_ACTIVE_SHIFT_SUCCESS,
  data: string,
};
export type GetActiveShiftFail = {
  type: actions.GET_ACTIVE_SHIFT_FAIL,
  data: ShapeShiftErrorResponse,
};

// ShapeShift sub-types
// Defined for actions that contain an object in the payload
type ShapeShiftMarketInfo = {
  limit: number,
  minimum: number,
  minerFee: number,
};

type ActiveShiftInfo = {
  deposit: string,
  depositType: string,
  returnAddress: string,
  orderId: string,
};

type ShapeShiftErrorResponse = {
  message: string,
};

const defaultState: ShapeShiftState = {
  loading: true,
  updating: false,
  shiftSupportedCoins: [],
  hasActiveShift: false,
  originCoin: undefined,
  error: undefined,
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
    [actions.GET_SUPPORTED_COINS_START]: (
      state: ShapeShiftState
    ): ShapeShiftState => ({
      ...state,
      loading: true,
      error: undefined,
    }),
    [actions.GET_SUPPORTED_COINS_SUCCESS]: (
      state: ShapeShiftState,
      action: GetSupportedCoinsSuccess
    ): ShapeShiftState => {
      const shiftSupportedCoins = action.data;
      return {
        ...state,
        error: undefined,
        shiftSupportedCoins,
      };
    },
    [actions.GET_SUPPORTED_COINS_FAIL]: (
      state: ShapeShiftState
    ): ShapeShiftState => ({
      ...state,
      loading: false,
      error: "Error getting available coins",
    }),

    [actions.GET_COIN_STATS_START]: (
      state: ShapeShiftState,
      action: GetCoinStatsStart
    ): ShapeShiftState => {
      const coin = action.data;
      return {
        ...state,
        updating: true,
        originCoin: coin,
      };
    },
    [actions.GET_COIN_STATS_SUCCESS]: (
      state: ShapeShiftState,
      action: GetCoinStatsSuccess
    ): ShapeShiftState => {
      const marketInfo: ShapeShiftMarketInfo = action.data;

      return {
        ...state,
        loading: false,
        updating: false,
        originCoinDepositMax: marketInfo.limit,
        // this will come in scientific notation
        // toFixed shows the real number, then regex to remove trailing zeros
        originCoinDepositMin: marketInfo.minimum
          .toFixed(10)
          .replace(/\.?0+$/, ""),
        originCoinDepositFee: marketInfo.minerFee,
      };
    },
    [actions.GET_COIN_STATS_FAIL]: (
      state: ShapeShiftState,
      action: GetCoinStatsFail
    ): ShapeShiftState => {
      const error = action.data;
      return {
        ...state,
        loading: false,
        error,
      };
    },

    [actions.PREPARE_SHAPE_SHIFT_START]: (
      state: ShapeShiftState
    ): ShapeShiftState => ({
      ...state,
      error: undefined,
    }),
    [actions.PREPARE_SHAPE_SHIFT_SUCCESS]: (
      state: ShapeShiftState,
      action: PrepareShapeShiftSuccess
    ) => {
      const activeShiftInfo: ActiveShiftInfo = action.data;
      return {
        ...state,
        hasActiveShift: true,
        shiftDepositAddress: activeShiftInfo.deposit,
        shiftCoinType: activeShiftInfo.depositType,
        shiftReturnAddress: activeShiftInfo.returnAddress,
        shiftOrderId: activeShiftInfo.orderId,
        shiftState: statuses.NO_DEPOSITS,
      };
    },
    [actions.PREPARE_SHAPE_SHIFT_FAIL]: (
      state: ShapeShiftState,
      action: PrepareShapeShiftFail
    ) => {
      const error: ShapeShiftErrorResponse = action.data;
      return {
        ...state,
        error: error.message,
      };
    },

    [actions.CLEAR_SHAPE_SHIFT]: (state: ShapeShiftState): ShapeShiftState => ({
      ...state,
      loading: false,
      updating: false,
      hasActiveShift: false,
      shiftDepositAddress: undefined,
      shiftReturnAddress: undefined,
      shiftCoinType: undefined,
      shiftOrderId: undefined,
      originCoin: state.shiftSupportedCoins[0],
    }),

    [actions.GET_ACTIVE_SHIFT_START]: (
      state: ShapeShiftState
    ): ShapeShiftState => ({
      ...state,
      error: undefined,
      updating: true,
    }),
    [actions.GET_ACTIVE_SHIFT_SUCCESS]: (
      state: ShapeShiftState,
      action: GetActiveShiftSuccess
    ): ShapeShiftState => {
      const status = action.data;
      return {
        ...state,
        updating: false,
        shiftState: status,
      };
    },
    [actions.GET_ACTIVE_SHIFT_FAIL]: (
      state: ShapeShiftState,
      action: GetActiveShiftFail
    ): ShapeShiftState => {
      const error: ShapeShiftErrorResponse = action.data;
      return {
        ...state,
        updating: false,
        error: error.message,
      };
    },
  },
  defaultState
);
