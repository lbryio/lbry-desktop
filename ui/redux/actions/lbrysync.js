// @flow
import * as ACTIONS from 'constants/action_types';
import Lbrysync from 'lbrysync';

// register an email (eventually username)
export const doLbrysyncRegister = (email: string, password: string) => async (dispatch: Dispatch) => {
  const { register } = Lbrysync;
  // started
  dispatch({
    type: ACTIONS.LSYNC_REGISTER_STARTED,
  });
  const resultIfError = await register(email, password);

  if (!resultIfError) {
    dispatch({
      type: ACTIONS.LSYNC_REGISTER_COMPLETED,
      data: email,
    });
  } else {
    dispatch({
      type: ACTIONS.LSYNC_REGISTER_FAILED,
      data: resultIfError,
    });
  }
};

// get token given username/password
export const doLbrysyncAuthenticate =
  (email: string, password: string, deviceId: string) => async (dispatch: Dispatch) => {
    const { getAuthToken } = Lbrysync;

    // started
    dispatch({
      type: ACTIONS.LSYNC_AUTH_STARTED,
    });
    const result: { token?: string, error?: string } = await getAuthToken(email, password, deviceId);

    if (result.token) {
      dispatch({
        type: ACTIONS.LSYNC_AUTH_COMPLETED,
        data: result.token,
      });
    } else if (result.error) {
      dispatch({
        type: ACTIONS.LSYNC_AUTH_FAILED,
        data: result.error,
      });
    }
  };
