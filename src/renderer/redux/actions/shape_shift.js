// @flow
import Promise from "bluebird";
import * as types from "constants/action_types";
import { coinRegexPatterns } from "util/shape_shift";
import type {
  GetSupportedCoinsSuccess,
  GetCoinStatsStart,
  GetCoinStatsSuccess,
  GetCoinStatsFail,
  PrepareShapeShiftSuccess,
  PrepareShapeShiftFail,
  GetActiveShiftSuccess,
  GetActiveShiftFail,
} from "redux/reducers/shape_shift";
import type { FormikActions } from "types/common";

// use promise chains instead of callbacks for shapeshift api
const shapeShift = Promise.promisifyAll(require("shapeshift.io"));

// All ShapeShift actions
// Action types defined in the reducer will contain some payload
export type Action =
  | { type: types.GET_SUPPORTED_COINS_START }
  | { type: types.GET_SUPPORTED_COINS_FAIL }
  | GetSupportedCoinsSuccess
  | GetCoinStatsStart
  | { type: types.GET_COIN_STATS_START }
  | GetCoinStatsFail
  | GetCoinStatsSuccess
  | { type: types.PREPARE_SHAPE_SHIFT_START }
  | PrepareShapeShiftFail
  | PrepareShapeShiftSuccess
  | { type: types.GET_ACTIVE_SHIFT_START }
  | GetActiveShiftFail
  | GetActiveShiftSuccess;

// Basic thunk types
// It would be nice to import these from types/common
// Not sure how that would work since they rely on the Action type
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch) => any;
export type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

// ShapeShift form values
export type ShapeShiftFormValues = {
  originCoin: string,
  returnAddress: ?string,
  receiveAddress: string,
};

export const shapeShiftInit = () => (dispatch: Dispatch): ThunkAction => {
  dispatch({ type: types.GET_SUPPORTED_COINS_START });

  return shapeShift
    .coinsAsync()
    .then(coinData => {
      let supportedCoins = [];
      Object.keys(coinData).forEach(symbol => {
        if (coinData[symbol].status === "available") {
          supportedCoins.push(coinData[symbol]);
        }
      });

      // only use larger coins with client side validation
      supportedCoins = supportedCoins
        .filter(coin => coinRegexPatterns[coin.symbol])
        .map(coin => coin.symbol);

      dispatch({
        type: types.GET_SUPPORTED_COINS_SUCCESS,
        data: supportedCoins,
      });
      dispatch(getCoinStats(supportedCoins[0]));
    })
    .catch(err =>
      dispatch({ type: types.GET_SUPPORTED_COINS_FAIL, data: err })
    );
};

export const getCoinStats = (coin: string) => (
  dispatch: Dispatch
): ThunkAction => {
  const pair = `${coin.toLowerCase()}_lbc`;

  dispatch({ type: types.GET_COIN_STATS_START, data: coin });

  return shapeShift
    .marketInfoAsync(pair)
    .then(marketInfo =>
      dispatch({ type: types.GET_COIN_STATS_SUCCESS, data: marketInfo })
    )
    .catch(err => dispatch({ type: types.GET_COIN_STATS_FAIL, data: err }));
};

export const createShapeShift = (
  values: ShapeShiftFormValues,
  actions: FormikActions
) => (dispatch: Dispatch): ThunkAction => {
  const {
    originCoin,
    returnAddress,
    receiveAddress: withdrawalAddress,
  } = values;

  const pair = `${originCoin.toLowerCase()}_lbc`;
  const options = {
    returnAddress,
  };

  dispatch({ type: types.PREPARE_SHAPE_SHIFT_START });
  return shapeShift
    .shiftAsync(withdrawalAddress, pair, options)
    .then(res =>
      dispatch({ type: types.PREPARE_SHAPE_SHIFT_SUCCESS, data: res })
    )
    .catch(err => {
      dispatch({ type: types.PREPARE_SHAPE_SHIFT_FAIL, data: err });
      // for formik to stop the submit
      actions.setSubmitting(false);
    });
};

export const getActiveShift = (depositAddress: string) => (
  dispatch: Dispatch
): ThunkAction => {
  dispatch({ type: types.GET_ACTIVE_SHIFT_START });

  return shapeShift
    .statusAsync(depositAddress)
    .then(res => dispatch({ type: types.GET_ACTIVE_SHIFT_SUCCESS, data: res }))
    .catch(err => dispatch({ type: types.GET_ACTIVE_SHIFT_FAIL, data: err }));
};

export const clearShapeShift = () => (dispatch: Dispatch): Action =>
  dispatch({ type: types.CLEAR_SHAPE_SHIFT });
