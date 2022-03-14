import { Lbryio } from 'lbryinc';
import * as ACTIONS from 'constants/action_types';

const CHECK_BLACK_LISTED_CONTENT_INTERVAL = 60 * 60 * 1000;

export function doFetchBlackListedOutpoints() {
  return dispatch => {
    dispatch({
      type: ACTIONS.FETCH_BLACK_LISTED_CONTENT_STARTED,
    });

    const success = ({ outpoints }) => {
      const splitOutpoints = [];
      if (outpoints) {
        outpoints.forEach((outpoint, index) => {
          const [txid, nout] = outpoint.split(':');

          splitOutpoints[index] = { txid, nout: Number.parseInt(nout, 10) };
        });
      }

      dispatch({
        type: ACTIONS.FETCH_BLACK_LISTED_CONTENT_COMPLETED,
        data: {
          outpoints: splitOutpoints,
          success: true,
        },
      });
    };

    const failure = ({ message: error }) => {
      dispatch({
        type: ACTIONS.FETCH_BLACK_LISTED_CONTENT_FAILED,
        data: {
          error,
          success: false,
        },
      });
    };

    Lbryio.call('file', 'list_blocked', {
      auth_token: '',
    }).then(success, failure);
  };
}

export function doBlackListedOutpointsSubscribe() {
  return dispatch => {
    dispatch(doFetchBlackListedOutpoints());
    setInterval(() => dispatch(doFetchBlackListedOutpoints()), CHECK_BLACK_LISTED_CONTENT_INTERVAL);
  };
}
