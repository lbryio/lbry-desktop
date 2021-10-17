import * as ACTIONS from 'constants/action_types';
import { Lbryio } from 'lbryinc';

export function doGenerateAuthToken(installationId) {
  return dispatch => {
    dispatch({
      type: ACTIONS.GENERATE_AUTH_TOKEN_STARTED,
    });

    Lbryio.call(
      'user',
      'new',
      {
        auth_token: '',
        language: 'en',
        app_id: installationId,
      },
      'post'
    )
      .then(response => {
        if (!response.auth_token) {
          dispatch({
            type: ACTIONS.GENERATE_AUTH_TOKEN_FAILURE,
          });
        } else {
          dispatch({
            type: ACTIONS.GENERATE_AUTH_TOKEN_SUCCESS,
            data: { authToken: response.auth_token },
          });
        }
      })
      .catch(() => {
        dispatch({
          type: ACTIONS.GENERATE_AUTH_TOKEN_FAILURE,
        });
      });
  };
}
