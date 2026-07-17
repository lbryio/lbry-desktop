import { Lbryio } from 'lbryinc';
import * as ACTIONS from 'constants/action_types';

const CHECK_FILTERED_CONTENT_INTERVAL = 60 * 60 * 1000;

export function doFetchFilteredOutpoints() {
  return dispatch => {
    dispatch({
      type: ACTIONS.FETCH_FILTERED_CONTENT_STARTED,
    });

    const success = ({ outpoints }) => {
      let formattedOutpoints = [];
      if (outpoints) {
        formattedOutpoints = outpoints.map(outpoint => {
          const [txid, nout] = outpoint.split(':');
          return { txid, nout: Number.parseInt(nout, 10) };
        });
      }

      dispatch({
        type: ACTIONS.FETCH_FILTERED_CONTENT_COMPLETED,
        data: {
          outpoints: formattedOutpoints,
        },
      });
    };

    const failure = ({ error }) => {
      dispatch({
        type: ACTIONS.FETCH_FILTERED_CONTENT_FAILED,
        data: {
          error,
        },
      });
    };

    Lbryio.call('file', 'list_filtered', { auth_token: '' }).then(success, failure);
  };
}

export function doFilteredOutpointsSubscribe() {
  return dispatch => {
    dispatch(doFetchFilteredOutpoints());
    setInterval(() => dispatch(doFetchFilteredOutpoints()), CHECK_FILTERED_CONTENT_INTERVAL);
  };
}
