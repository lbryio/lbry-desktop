import {
  Lbry,
  doFetchChannelListMine,
  batchActions,
  makeSelectClaimForUri,
  isURIValid,
  normalizeURI,
} from 'lbry-redux';
import * as ACTIONS from 'constants/action_types';
import { doClaimRewardType, doRewardList } from 'redux/actions/rewards';
import { selectEmailToVerify, selectPhoneToVerify, selectUserCountryCode, selectUser } from 'redux/selectors/user';
import { doToast } from 'redux/actions/notifications';
import rewards from 'rewards';
import { Lbryio } from 'lbryinc';
import { DOMAIN } from 'config';
import { getDefaultLanguage } from 'util/default-languages';
const AUTH_IN_PROGRESS = 'authInProgress';
export let sessionStorageAvailable = false;
const CHECK_INTERVAL = 200;
const AUTH_WAIT_TIMEOUT = 10000;

export function doFetchInviteStatus(shouldCallRewardList = true) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.USER_INVITE_STATUS_FETCH_STARTED,
    });

    Promise.all([Lbryio.call('user', 'invite_status'), Lbryio.call('user_referral_code', 'list')])
      .then(([status, code]) => {
        if (shouldCallRewardList) {
          dispatch(doRewardList());
        }

        dispatch({
          type: ACTIONS.USER_INVITE_STATUS_FETCH_SUCCESS,
          data: {
            invitesRemaining: status.invites_remaining ? status.invites_remaining : 0,
            invitees: status.invitees,
            referralLink: `${Lbryio.CONNECTION_STRING}user/refer?r=${code}`,
            referralCode: code,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.USER_INVITE_STATUS_FETCH_FAILURE,
          data: { error },
        });
      });
  };
}

export function doInstallNew(appVersion, callbackForUsersWhoAreSharingData, domain) {
  const payload = { app_version: appVersion, domain };

  Lbry.status().then((status) => {
    payload.app_id =
      domain && domain !== 'lbry.tv'
        ? (domain.replace(/[.]/gi, '') + status.installation_id).slice(0, 66)
        : status.installation_id;
    payload.node_id = status.lbry_id;
    Lbry.version().then((version) => {
      payload.daemon_version = version.lbrynet_version;
      payload.operating_system = version.os_system;
      payload.platform = version.platform;
      Lbryio.call('install', 'new', payload);

      if (callbackForUsersWhoAreSharingData) {
        callbackForUsersWhoAreSharingData(status);
      }
    });
  });
}

function checkAuthBusy() {
  let time = Date.now();
  return new Promise(function (resolve, reject) {
    (function waitForAuth() {
      try {
        sessionStorage.setItem('test', 'available');
        sessionStorage.removeItem('test');
        sessionStorageAvailable = true;
      } catch (e) {
        if (e) {
          // no session storage
        }
      }
      if (!IS_WEB || !sessionStorageAvailable) {
        return resolve();
      }
      const inProgress = window.sessionStorage.getItem(AUTH_IN_PROGRESS);
      if (!inProgress) {
        window.sessionStorage.setItem(AUTH_IN_PROGRESS, 'true');
        return resolve();
      } else {
        if (Date.now() - time < AUTH_WAIT_TIMEOUT) {
          setTimeout(waitForAuth, CHECK_INTERVAL);
        } else {
          return resolve();
        }
      }
    })();
  });
}

// TODO: Call doInstallNew separately so we don't have to pass appVersion and os_system params?
/**
 *
 * @param appVersion
 * @param shareUsageData
 * @param callbackForUsersWhoAreSharingData
 * @param callInstall
 * @returns {Function}
 *
 * Does Lbryio.authenticate, i.e. call Authenticate() then update redux with auth token.
 * Authenticate does getAuthToken then getCurrentUser, and if !user, call userNew and return the user
 * telling redux the auth token is probably dumb. we will
 * keycloak = useKeycloak(), keycloak.token whenever we want that
 *
 */
export function doAuthenticate(
  appVersion,
  shareUsageData = true,
  callbackForUsersWhoAreSharingData,
  callInstall = true
) {
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.AUTHENTICATION_STARTED,
    });
    try {
      await checkAuthBusy();
      const user = await Lbryio.authenticate(DOMAIN, getDefaultLanguage());
      console.log('USER', user);
      if (sessionStorageAvailable) window.sessionStorage.removeItem(AUTH_IN_PROGRESS);
      // put this back , accessToken: tokens.access_token
      Lbryio.getTokens().then((tokens) => {
        dispatch({
          type: ACTIONS.AUTHENTICATION_SUCCESS,
          data: { user, accessToken: tokens.auth_token }, // rename 'accessToken' = auth_token
        });
        if (shareUsageData) {
          dispatch(doRewardList());
          dispatch(doFetchInviteStatus(false));
          if (callInstall) {
            doInstallNew(appVersion, callbackForUsersWhoAreSharingData, DOMAIN);
          }
        }
      });
    } catch (error) {
      if (sessionStorageAvailable) window.sessionStorage.removeItem(AUTH_IN_PROGRESS);

      dispatch({
        type: ACTIONS.AUTHENTICATION_FAILURE,
        data: { error },
      });
    }
  };
}

export function doUserFetch() {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: ACTIONS.USER_FETCH_STARTED,
      });

      Lbryio.getCurrentUser()
        .then((user) => {
          dispatch({
            type: ACTIONS.USER_FETCH_SUCCESS,
            data: { user },
          });
          resolve(user);
        })
        .catch((error) => {
          reject(error);
          dispatch({
            type: ACTIONS.USER_FETCH_FAILURE,
            data: { error },
          });
        });
    });
}

export function doUserCheckEmailVerified() {
  // This will happen in the background so we don't need loading booleans
  return (dispatch) => {
    Lbryio.getCurrentUser().then((user) => {
      if (user.has_verified_email) {
        dispatch(doRewardList());

        dispatch({
          type: ACTIONS.USER_FETCH_SUCCESS,
          data: { user },
        });
      }
    });
  };
}

export function doUserPhoneReset() {
  return {
    type: ACTIONS.USER_PHONE_RESET,
  };
}

export function doUserPhoneNew(phone, countryCode) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.USER_PHONE_NEW_STARTED,
      data: { phone, country_code: countryCode },
    });

    const success = () => {
      dispatch({
        type: ACTIONS.USER_PHONE_NEW_SUCCESS,
        data: { phone },
      });
    };

    const failure = (error) => {
      dispatch({
        type: ACTIONS.USER_PHONE_NEW_FAILURE,
        data: { error },
      });
    };

    Lbryio.call('user', 'phone_number_new', { phone_number: phone, country_code: countryCode }, 'post').then(
      success,
      failure
    );
  };
}

export function doUserPhoneVerifyFailure(error) {
  return {
    type: ACTIONS.USER_PHONE_VERIFY_FAILURE,
    data: { error },
  };
}

export function doUserPhoneVerify(verificationCode) {
  return (dispatch, getState) => {
    const phoneNumber = selectPhoneToVerify(getState());
    const countryCode = selectUserCountryCode(getState());

    dispatch({
      type: ACTIONS.USER_PHONE_VERIFY_STARTED,
      code: verificationCode,
    });

    Lbryio.call(
      'user',
      'phone_number_confirm',
      {
        verification_code: verificationCode,
        phone_number: phoneNumber,
        country_code: countryCode,
      },
      'post'
    )
      .then((user) => {
        if (user.is_identity_verified) {
          dispatch({
            type: ACTIONS.USER_PHONE_VERIFY_SUCCESS,
            data: { user },
          });
          dispatch(doClaimRewardType(rewards.TYPE_NEW_USER));
        }
      })
      .catch((error) => dispatch(doUserPhoneVerifyFailure(error)));
  };
}

export function doUserEmailToVerify(email) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.USER_EMAIL_VERIFY_SET,
      data: { email },
    });
  };
}

export function doUserEmailNew(email) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.USER_EMAIL_NEW_STARTED,
      email,
    });

    const success = () => {
      dispatch({
        type: ACTIONS.USER_EMAIL_NEW_SUCCESS,
        data: { email },
      });
      dispatch(doUserFetch());
    };

    const failure = (error) => {
      dispatch({
        type: ACTIONS.USER_EMAIL_NEW_FAILURE,
        data: { error },
      });
    };

    Lbryio.call('user_email', 'new', { email, send_verification_email: true }, 'post')
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          dispatch({
            type: ACTIONS.USER_EMAIL_NEW_EXISTS,
          });

          return Lbryio.call('user_email', 'resend_token', { email, only_if_expired: true }, 'post').then(
            success,
            failure
          );
        }
        throw error;
      })
      .then(success, failure);
  };
}

export function doUserCheckIfEmailExists(email) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.USER_EMAIL_NEW_STARTED,
      email,
    });

    const triggerEmailFlow = (hasPassword) => {
      dispatch({
        type: ACTIONS.USER_EMAIL_NEW_SUCCESS,
        data: { email },
      });

      dispatch({
        type: ACTIONS.USER_EMAIL_NEW_EXISTS,
      });

      if (hasPassword) {
        dispatch({
          type: ACTIONS.USER_PASSWORD_EXISTS,
        });
      } else {
        // If they don't have a password, they will need to use the email verification api
        Lbryio.call('user_email', 'resend_token', { email, only_if_expired: true }, 'post');
      }
    };

    const success = (response) => {
      triggerEmailFlow(response.has_password);
    };

    const failure = (error) =>
      dispatch({
        type: ACTIONS.USER_EMAIL_NEW_FAILURE,
        data: { error },
      });

    Lbryio.call('user', 'exists', { email }, 'post')
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          dispatch({
            type: ACTIONS.USER_EMAIL_NEW_DOES_NOT_EXIST,
          });
        } else if (error.response && error.response.status === 412) {
          triggerEmailFlow(false);
        }

        throw error;
      })
      .then(success, failure);
  };
}

export function doUserSignIn(email, password) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.USER_EMAIL_NEW_STARTED,
      email,
    });

    const success = () => {
      dispatch({
        type: ACTIONS.USER_EMAIL_NEW_SUCCESS,
        data: { email },
      });
      dispatch(doUserFetch());
    };

    const failure = (error) =>
      dispatch({
        type: ACTIONS.USER_EMAIL_NEW_FAILURE,
        data: { error },
      });

    Lbryio.call('user', 'signin', { email, ...(password ? { password } : {}) }, 'post')
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          dispatch({
            type: ACTIONS.USER_EMAIL_NEW_EXISTS,
          });

          return Lbryio.call('user_email', 'resend_token', { email, only_if_expired: true }, 'post').then(
            success,
            failure
          );
        }
        throw error;
      })
      .then(success, failure);
  };
}

export function doUserSignUp(email, password) {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: ACTIONS.USER_EMAIL_NEW_STARTED,
        email,
      });

      const success = () => {
        dispatch({
          type: ACTIONS.USER_EMAIL_NEW_SUCCESS,
          data: { email },
        });
        dispatch(doUserFetch());
        resolve();
      };

      const failure = (error) => {
        if (error.response && error.response.status === 409) {
          dispatch({
            type: ACTIONS.USER_EMAIL_NEW_EXISTS,
          });
        }
        dispatch({
          type: ACTIONS.USER_EMAIL_NEW_FAILURE,
          data: { error },
        });

        reject(error);
      };

      Lbryio.call('user', 'signup', { email, ...(password ? { password } : {}) }, 'post').then(success, failure);
    });
}

export function doUserPasswordReset(email) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.USER_PASSWORD_RESET_STARTED,
      email,
    });

    const success = () => {
      dispatch({
        type: ACTIONS.USER_PASSWORD_RESET_SUCCESS,
      });
    };

    const failure = (error) =>
      dispatch({
        type: ACTIONS.USER_PASSWORD_RESET_FAILURE,
        data: { error },
      });

    Lbryio.call('user_password', 'reset', { email }, 'post').then(success, failure);
  };
}

export function doUserPasswordSet(newPassword, oldPassword, authToken) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.USER_PASSWORD_SET_STARTED,
    });

    const success = () => {
      dispatch({
        type: ACTIONS.USER_PASSWORD_SET_SUCCESS,
      });
      dispatch(doUserFetch());
    };

    const failure = (error) =>
      dispatch({
        type: ACTIONS.USER_PASSWORD_SET_FAILURE,
        data: { error },
      });

    Lbryio.call(
      'user_password',
      'set',
      {
        new_password: newPassword,
        ...(oldPassword ? { old_password: oldPassword } : {}),
        ...(authToken ? { auth_token: authToken } : {}),
      },
      'post'
    ).then(success, failure);
  };
}

export function doUserResendVerificationEmail(email) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.USER_EMAIL_VERIFY_RETRY_STARTED,
    });

    const success = () => {
      dispatch({
        type: ACTIONS.USER_EMAIL_VERIFY_RETRY_SUCCESS,
      });
    };

    const failure = (error) => {
      dispatch({
        type: ACTIONS.USER_EMAIL_VERIFY_RETRY_FAILURE,
        data: { error },
      });
    };

    Lbryio.call('user_email', 'resend_token', { email, only_if_expired: true }, 'post')
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          throw error;
        }
      })
      .then(success, failure);
  };
}

export function doClearEmailEntry() {
  return {
    type: ACTIONS.USER_EMAIL_NEW_CLEAR_ENTRY,
  };
}

export function doClearPasswordEntry() {
  return {
    type: ACTIONS.USER_PASSWORD_SET_CLEAR,
  };
}

export function doUserEmailVerifyFailure(error) {
  return {
    type: ACTIONS.USER_EMAIL_VERIFY_FAILURE,
    data: { error },
  };
}

export function doUserEmailVerify(verificationToken, recaptcha) {
  return (dispatch, getState) => {
    const email = selectEmailToVerify(getState());

    dispatch({
      type: ACTIONS.USER_EMAIL_VERIFY_STARTED,
      code: verificationToken,
      recaptcha,
    });

    Lbryio.call(
      'user_email',
      'confirm',
      {
        verification_token: verificationToken,
        email,
        recaptcha,
      },
      'post'
    )
      .then((userEmail) => {
        if (userEmail.is_verified) {
          dispatch({
            type: ACTIONS.USER_EMAIL_VERIFY_SUCCESS,
            data: { email },
          });
          dispatch(doUserFetch());
        } else {
          throw new Error('Your email is still not verified.'); // shouldn't happen
        }
      })
      .catch((error) => dispatch(doUserEmailVerifyFailure(error)));
  };
}

export function doFetchAccessToken() {
  return (dispatch) => {
    const success = (token) =>
      dispatch({
        type: ACTIONS.FETCH_ACCESS_TOKEN_SUCCESS,
        data: { token },
      });
    Lbryio.getAuthToken().then(success);
  };
}

export function doUserIdentityVerify(stripeToken) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.USER_IDENTITY_VERIFY_STARTED,
      token: stripeToken,
    });

    Lbryio.call('user', 'verify_identity', { stripe_token: stripeToken }, 'post')
      .then((user) => {
        if (user.is_identity_verified) {
          dispatch({
            type: ACTIONS.USER_IDENTITY_VERIFY_SUCCESS,
            data: { user },
          });
          dispatch(doClaimRewardType(rewards.TYPE_NEW_USER));
        } else {
          throw new Error('Your identity is still not verified. This should not happen.'); // shouldn't happen
        }
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.USER_IDENTITY_VERIFY_FAILURE,
          data: { error: error.toString() },
        });
      });
  };
}

export function doUserInviteNew(email) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.USER_INVITE_NEW_STARTED,
    });

    return Lbryio.call('user', 'invite', { email }, 'post')
      .then((success) => {
        dispatch({
          type: ACTIONS.USER_INVITE_NEW_SUCCESS,
          data: { email },
        });

        dispatch(
          doToast({
            message: __('Invite sent to %email_address%', { email_address: email }),
          })
        );

        dispatch(doFetchInviteStatus());
        return success;
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.USER_INVITE_NEW_FAILURE,
          data: { error },
        });
      });
  };
}

export function doUserSetReferrerReset() {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.USER_SET_REFERRER_RESET,
    });
  };
}
export function doUserSetReferrer(referrer, shouldClaim) {
  return async (dispatch, getState) => {
    dispatch({
      type: ACTIONS.USER_SET_REFERRER_STARTED,
    });
    let claim;
    let referrerCode;
    const isValid = isURIValid(referrer);
    if (isValid) {
      const uri = normalizeURI(referrer);
      claim = makeSelectClaimForUri(uri)(getState());
      if (!claim) {
        try {
          const response = await Lbry.resolve({ urls: [uri] });
          if (response && response[uri] && !response[uri].error) claim = response && response[uri];
          if (claim) {
            if (claim.signing_channel) {
              referrerCode = claim.signing_channel.permanent_url.replace('lbry://', '');
            } else {
              referrerCode = claim.permanent_url.replace('lbry://', '');
            }
          }
        } catch (error) {
          dispatch({
            type: ACTIONS.USER_SET_REFERRER_FAILURE,
            data: { error },
          });
        }
      } else {
        referrerCode = claim.permanent_url.replace('lbry://', '');
      }
    }

    if (!referrerCode) {
      referrerCode = referrer;
    }

    try {
      await Lbryio.call('user', 'referral', { referrer: referrerCode }, 'post');
      dispatch({
        type: ACTIONS.USER_SET_REFERRER_SUCCESS,
      });
      if (shouldClaim) {
        dispatch(doClaimRewardType(rewards.TYPE_REFEREE));
        dispatch(doUserFetch());
      } else {
        dispatch(doUserFetch());
      }
    } catch (error) {
      dispatch({
        type: ACTIONS.USER_SET_REFERRER_FAILURE,
        data: { error },
      });
    }
  };
}

export function doUserSetCountry(country) {
  return (dispatch, getState) => {
    const state = getState();
    const user = selectUser(state);

    Lbryio.call('user_country', 'set', { country }).then(() => {
      const newUser = { ...user, country };
      dispatch({
        type: ACTIONS.USER_FETCH_SUCCESS,
        data: { user: newUser },
      });
    });
  };
}

export function doClaimYoutubeChannels() {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.USER_YOUTUBE_IMPORT_STARTED,
    });

    let transferResponse;
    return Lbry.address_list({ page: 1, page_size: 99999 })
      .then((addressList) => addressList.items[0])
      .then((address) =>
        Lbryio.call('yt', 'transfer', {
          address: address.address,
          public_key: address.pubkey,
        }).then((response) => {
          if (response && response.length) {
            transferResponse = response;
            return Promise.all(
              response.map((channelMeta) => {
                if (channelMeta && channelMeta.channel && channelMeta.channel.channel_certificate) {
                  return Lbry.channel_import({
                    channel_data: channelMeta.channel.channel_certificate,
                  });
                }
                return null;
              })
            ).then(() => {
              const actions = [
                {
                  type: ACTIONS.USER_YOUTUBE_IMPORT_SUCCESS,
                  data: transferResponse,
                },
              ];
              actions.push(doUserFetch());
              actions.push(doFetchChannelListMine());
              dispatch(batchActions(...actions));
            });
          }
        })
      )
      .catch((error) => {
        dispatch({
          type: ACTIONS.USER_YOUTUBE_IMPORT_FAILURE,
          data: String(error),
        });
      });
  };
}

export function doCheckYoutubeTransfer() {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.USER_YOUTUBE_IMPORT_STARTED,
    });

    return Lbryio.call('yt', 'transfer')
      .then((response) => {
        if (response && response.length) {
          dispatch({
            type: ACTIONS.USER_YOUTUBE_IMPORT_SUCCESS,
            data: response,
          });
        } else {
          throw new Error();
        }
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.USER_YOUTUBE_IMPORT_FAILURE,
          data: String(error),
        });
      });
  };
}
