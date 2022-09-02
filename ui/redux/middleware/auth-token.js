import * as ACTIONS from 'constants/action_types';
import { X_LBRY_AUTH_TOKEN } from 'constants/token';
import Lbry from 'lbry';
import { getAuthToken } from 'util/saved-passwords';

export const populateAuthTokenHeader = ({ dispatch }) => {
  return (next) => (action) => {
    // @if TARGET='web'

    switch (action.type) {
      case ACTIONS.USER_FETCH_SUCCESS:
      case ACTIONS.AUTHENTICATION_SUCCESS:
        if (action.data.user.has_verified_email === true) {
          const authToken = getAuthToken();
          Lbry.setApiHeader(X_LBRY_AUTH_TOKEN, authToken);
          dispatch({ type: ACTIONS.USER_LOGGED_IN_BROADCAST });
        }
        break;

      case ACTIONS.USER_LOGGED_IN_BROADCAST:
        const xAuth = (Lbry.getApiRequestHeaders() || {})[X_LBRY_AUTH_TOKEN] || '';
        if (!xAuth) {
          window.location.reload();
        }
        break;

      default:
        break; // skip
    }
    // @endif

    return next(action);
  };
};
