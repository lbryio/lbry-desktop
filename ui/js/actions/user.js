import * as types from "constants/action_types";
import lbryio from "lbryio";
import { setLocal } from "utils";
import { doRewardList } from "actions/rewards";
import { selectEmailToVerify } from "selectors/user";

export function doAuthenticate() {
  return function(dispatch, getState) {
    dispatch({
      type: types.AUTHENTICATION_STARTED,
    });
    lbryio
      .authenticate()
      .then(user => {
        dispatch({
          type: types.AUTHENTICATION_SUCCESS,
          data: { user },
        });
        dispatch(doRewardList());
      })
      .catch(error => {
        dispatch({
          type: types.AUTHENTICATION_FAILURE,
          data: { error },
        });
      });
  };
}

export function doUserFetch() {
  return function(dispatch, getState) {
    dispatch({
      type: types.USER_FETCH_STARTED,
    });
    lbryio
      .getCurrentUser()
      .then(user => {
        dispatch(doRewardList());

        dispatch({
          type: types.USER_FETCH_SUCCESS,
          data: { user },
        });
      })
      .catch(error => {
        dispatch({
          type: types.USER_FETCH_FAILURE,
          data: { error },
        });
      });
  };
}

export function doUserEmailNew(email) {
  return function(dispatch, getState) {
    dispatch({
      type: types.USER_EMAIL_NEW_STARTED,
      email: email,
    });
    lbryio
      .call(
        "user_email",
        "new",
        { email: email, send_verification_email: true },
        "post"
      )
      .catch(error => {
        if (error.xhr && error.xhr.status == 409) {
          return lbryio.call(
            "user_email",
            "resend_token",
            { email: email, only_if_expired: true },
            "post"
          );
        }
        throw error;
      })
      .then(() => {
        dispatch({
          type: types.USER_EMAIL_NEW_SUCCESS,
          data: { email },
        });
        dispatch(doUserFetch());
      })
      .catch(error => {
        dispatch({
          type: types.USER_EMAIL_NEW_FAILURE,
          data: { error },
        });
      });
  };
}

export function doUserEmailDecline() {
  return function(dispatch, getState) {
    setLocal("user_email_declined", true);
    dispatch({
      type: types.USER_EMAIL_DECLINE,
    });
  };
}

export function doUserEmailVerify(verificationToken) {
  return function(dispatch, getState) {
    const email = selectEmailToVerify(getState());
    verificationToken = verificationToken.toString().trim();

    dispatch({
      type: types.USER_EMAIL_VERIFY_STARTED,
      code: verificationToken,
    });

    lbryio
      .call(
        "user_email",
        "confirm",
        { verification_token: verificationToken, email: email },
        "post"
      )
      .then(userEmail => {
        if (userEmail.is_verified) {
          dispatch({
            type: types.USER_EMAIL_VERIFY_SUCCESS,
            data: { email },
          });
          dispatch(doUserFetch());
        } else {
          throw new Error("Your email is still not verified."); //shouldn't happen
        }
      })
      .catch(error => {
        dispatch({
          type: types.USER_EMAIL_VERIFY_FAILURE,
          data: { error },
        });
      });
  };
}
