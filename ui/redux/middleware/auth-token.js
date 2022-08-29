import * as ACTIONS from 'constants/action_types';
import { X_LBRY_AUTH_TOKEN } from 'constants/token';
import Lbry from 'lbry';
import { getAuthToken } from 'util/saved-passwords';

export const populateAuthTokenHeader = () => {
  return (next) => (action) => {
    // @if TARGET='web'
    if (
      (action.type === ACTIONS.USER_FETCH_SUCCESS || action.type === ACTIONS.AUTHENTICATION_SUCCESS) &&
      action.data.user.has_verified_email === true
    ) {
      const authToken = getAuthToken();
      Lbry.setApiHeader(X_LBRY_AUTH_TOKEN, authToken);
    }
    // @endif

    return next(action);
  };
};
