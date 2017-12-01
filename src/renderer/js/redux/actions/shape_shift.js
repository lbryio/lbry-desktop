import { createAction } from "util/redux-utils";
import Promise from "bluebird";
import * as types from "constants/action_types";
import { coinRegexPatterns } from "util/shape_shift";

const shapeShift = Promise.promisifyAll(require("shapeshift.io"));

export const shapeShiftInit = () => dispatch => {
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

export const getCoinStats = coin => dispatch => {
  // TODO: get ShapeShift fee
  const pair = `${coin.toLowerCase()}_lbc`;

  dispatch({ type: types.GET_COIN_STATS_START, data: coin });

  return shapeShift
    .marketInfoAsync(pair)
    .then(marketInfo =>
      dispatch({ type: types.GET_COIN_STATS_SUCCESS, data: marketInfo })
    )
    .catch(err => dispatch({ type: types.GET_COIN_STATS_FAIL, data: err }));
};

export const createShapeShift = (values, actions) => dispatch => {
  const {
    originCoin,
    returnAddress,
    receiveAddress: withdrawalAddress,
  } = values;

  const pair = `${originCoin.toLowerCase()}_lbc`;
  const options = {
    returnAddress: returnAddress,
  };

  dispatch({ type: types.PREPARE_SHAPE_SHIFT_START });
  return shapeShift
    .shiftAsync(withdrawalAddress, pair, options)
    .then(res =>
      dispatch({ type: types.PREPARE_SHAPE_SHIFT_SUCCESS, data: res })
    )
    .catch(err => {
      dispatch({ type: types.PREPARE_SHAPE_SHIFT_FAIL, data: err });
      // for formik
      actions.setSubmitting(false);
    });
};

export const getActiveShift = depositAddress => dispatch => {
  dispatch({ type: types.GET_ACTIVE_SHIFT_START });

  return shapeShift
    .statusAsync(depositAddress)
    .then(res => dispatch({ type: types.GET_ACTIVE_SHIFT_SUCCESS, data: res }))
    .catch(err => dispatch({ type: types.GET_ACTIVE_SHIFT_FAIL, data: err }));
};

export const clearShapeShift = () => dispatch =>
  dispatch({ type: types.CLEAR_SHAPE_SHIFT });
