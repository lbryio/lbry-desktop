import * as types from "constants/action_types";
import * as modals from "constants/modal_types";
import lbryio from "lbryio";
import { doOpenModal, doShowSnackBar } from "actions/app";
import { doRewardList, doClaimRewardType } from "actions/rewards";
import { selectEmailToVerify, selectUser } from "selectors/user";
import rewards from "rewards";

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
        dispatch(doFetchInviteStatus());
      })
      .catch(error => {
        dispatch(doOpenModal(modals.AUTHENTICATION_FAILURE));
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

export function doUserIdentityVerify(stripeToken) {
  return function(dispatch, getState) {
    dispatch({
      type: types.USER_IDENTITY_VERIFY_STARTED,
      token: stripeToken,
    });

    lbryio
      .call("user", "verify_identity", { stripe_token: stripeToken }, "post")
      .then(user => {
        if (user.is_identity_verified) {
          dispatch({
            type: types.USER_IDENTITY_VERIFY_SUCCESS,
            data: { user },
          });
          dispatch(doClaimRewardType(rewards.TYPE_NEW_USER));
        } else {
          throw new Error(
            "Your identity is still not verified. This should not happen."
          ); //shouldn't happen
        }
      })
      .catch(error => {
        dispatch({
          type: types.USER_IDENTITY_VERIFY_FAILURE,
          data: { error: error.toString() },
        });
      });
  };
}

export function doFetchAccessToken() {
  return function(dispatch, getState) {
    const success = token =>
      dispatch({
        type: types.FETCH_ACCESS_TOKEN_SUCCESS,
        data: { token },
      });
    lbryio.getAuthToken().then(success);
  };
}

export function doFetchInviteStatus() {
  return function(dispatch, getState) {
    dispatch({
      type: types.USER_INVITE_STATUS_FETCH_STARTED,
    });

    lbryio
      .call("user", "invite_status")
      .then(status => {
        dispatch({
          type: types.USER_INVITE_STATUS_FETCH_SUCCESS,
          data: {
            invitesRemaining: status.invites_remaining
              ? status.invites_remaining
              : 0,
            invitees: status.invitees,
          },
        });
      })
      .catch(error => {
        dispatch({
          type: types.USER_INVITE_STATUS_FETCH_FAILURE,
          data: { error },
        });
      });
  };
}

export function doUserInviteNew(email) {
  return function(dispatch, getState) {
    dispatch({
      type: types.USER_INVITE_NEW_STARTED,
    });

    lbryio
      .call("user", "invite", { email: email }, "post")
      .then(invite => {
        dispatch({
          type: types.USER_INVITE_NEW_SUCCESS,
          data: { email },
        });

        dispatch(
          doShowSnackBar({
            message: __("Invite sent to %s", email),
          })
        );

        dispatch(doFetchInviteStatus());
      })
      .catch(error => {
        dispatch({
          type: types.USER_INVITE_NEW_FAILURE,
          data: { error },
        });
      });
  };
}

export function doSubscribe(account) {
  return function(dispatch, getState) {
    dispatch({
      type: types.USER_SUBSCRIBE,
      data: { account },
    });
  };
}
