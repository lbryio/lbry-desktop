// @flow
import * as ACTIONS from 'constants/action_types';
import { ipcRenderer } from 'electron';
import { safeStoreEncrypt, safeStoreDecrypt } from 'util/saved-passwords';

import * as Lbrysync from 'lbrysync';
import Lbry from 'lbry';
import { Lbryio } from "lbryinc";
import { selectSyncHash } from '../selectors/sync';
export const doLbrysyncGetSalt = (email: string) => async (dispatch: Dispatch) => {
  const { fetchSaltSeed } = Lbrysync;
  dispatch({
    type: ACTIONS.LSYNC_GET_SALT_STARTED,
  });
  try {
    const saltOrError = await fetchSaltSeed(email);
    dispatch({
      type: ACTIONS.LSYNC_GET_SALT_COMPLETED,
      data: { email: email, saltSeed: saltOrError},
    });
    return saltOrError;
  } catch (e) {
    dispatch({
      type: ACTIONS.LSYNC_GET_SALT_FAILED,
      data: { email: email, saltError: 'Not Found'},
    });
    return 'not found';
  }
};

// register an email (eventually username)
export const doLbrysyncRegister = (email: string, secrets: any, saltSeed: string) => async (dispatch: Dispatch) => {
  const { register } = Lbrysync;
  // started
  dispatch({
    type: ACTIONS.LSYNC_REGISTER_STARTED,
  });
  const resultIfError = await register(email, secrets.providerPass, saltSeed);
  const encProviderPass = safeStoreEncrypt(secrets.providerPass);
  const encHmacKey = safeStoreEncrypt(secrets.hmacKey);
  const enctyptedRoot = safeStoreEncrypt(secrets.rootPassword);
  const registerData = {
    email,
    saltSeed,
    providerPass: encProviderPass,
    hmacKey: encHmacKey,
    rootPass: enctyptedRoot,
  };

  if (!resultIfError) {
    dispatch({
      type: ACTIONS.LSYNC_REGISTER_COMPLETED,
      data: registerData,
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
  () => async (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: ACTIONS.LSYNC_AUTH_STARTED,
    });
    const state = getState();
    const { lbrysync } = state;
    const { registeredEmail: email, encryptedProviderPass } = lbrysync;
    const status = await Lbry.status();
    const { installation_id: deviceId } = status;
    const password = safeStoreDecrypt(encryptedProviderPass);

    const { getAuthToken } = Lbrysync;

    const result: { token?: string, error?: string } = await getAuthToken(email, password, deviceId);

    if (result.token) {
      dispatch({
        type: ACTIONS.LSYNC_AUTH_COMPLETED,
        data: result.token,
      });
    } else {
      dispatch({
        type: ACTIONS.LSYNC_AUTH_FAILED,
        data: result.error,
      });
    }
  };

export const doGenerateSaltSeed = () => async (dispatch: Dispatch) => {
  const result = await ipcRenderer.invoke('invoke-get-salt-seed');
  return result;
};

export const doDeriveSecrets = (rootPassword: string, email: string, saltSeed: string) => async (dispatch: Dispatch) =>
  {
    dispatch({
      type: ACTIONS.LSYNC_DERIVE_STARTED,
    });
    try {
      const result = await ipcRenderer.invoke('invoke-get-secrets', rootPassword, email, saltSeed);

      const data = {
        hmacKey: result.hmacKey,
        rootPassword,
        providerPass: result.lbryIdPassword,
      };

      dispatch({
        type: ACTIONS.LSYNC_DERIVE_COMPLETED,
        data,
      });
      return data;
    } catch (e) {
      dispatch({
        type: ACTIONS.LSYNC_DERIVE_FAILED,
        data: {
          error: e,
        },
      });
      return { error: e.message };
    }

  };

export async function doSetSync() {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const localHash = selectSyncHash(state);
    const { lbrysync } = state;
    const { authToken, encryptedRoot } = lbrysync;
    dispatch({
      type: ACTIONS.SET_SYNC_STARTED,
    });
    let error;

    try {
      const status = Lbry.wallet_status();
      if (status.is_locked) {
        throw new Error('Error parsing i18n messages file: ' + messagesFilePath + ' err: ' + err);
      }
    } catch(e) {
      error = e.message;
    }

    if (!error) {
      const syncData = await Lbry.sync_apply({ password: , data: response.data, blocking: true })
    }
    // return Lbryio.call('sync', 'set', { old_hash: oldHash, new_hash: newHash, data }, 'post')
    return pushWallet(authToken)
      .then((response) => {
        if (!response.hash) {
          throw Error('No hash returned for sync/set.');
        }

        return dispatch({
          type: ACTIONS.SET_SYNC_COMPLETED,
          data: { syncHash: response.hash },
        });
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.SET_SYNC_FAILED,
          data: { error },
        });
      });
  };
}

export function doGetSync(passedPassword?: string, callback?: (any, ?boolean) => void) {

  const password = passedPassword === null || passedPassword === undefined ? '' : passedPassword;

  function handleCallback(error, hasNewData) {
    if (callback) {
      if (typeof callback !== 'function') {
        throw new Error('Second argument passed to "doGetSync" must be a function');
      }

      callback(error, hasNewData);
    }
  }

  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const localHash = selectSyncHash(state);
    const { lbrysync } = state;
    const { authToken, encryptedRoot } = lbrysync;
    const { pullWallet } = Lbrysync;
    dispatch({
      type: ACTIONS.GET_SYNC_STARTED,
    });

    const data = {};

    Lbry.wallet_status()
      .then((status) => {
        if (status.is_locked) {
          return Lbry.wallet_unlock({ password });
        }

        // Wallet is already unlocked
        return true;
      })
      .then((isUnlocked) => {
        if (isUnlocked) {
          return Lbry.sync_hash(); //unnec
        }
        data.unlockFailed = true;
        throw new Error();
      })
      // .then((hash?: string) => Lbryio.call('sync', 'get', { hash }, 'post'))
      .then((hash?: string) => pullWallet(authToken))
      .then((response: any) => {
        // get data, put it in sync apply.
        const syncHash = response.hash;
        data.syncHash = syncHash;
        data.syncData = response.data;
        data.changed = response.changed || syncHash !== localHash;
        data.hasSyncedWallet = true;

        if (response.changed) {
          return Lbry.sync_apply({ password, data: response.data, blocking: true });
        }
      })
      .then((response) => {
        if (!response) {
          dispatch({ type: ACTIONS.GET_SYNC_COMPLETED, data });
          handleCallback(null, data.changed);
          return;
        }

        const { hash: walletHash, data: walletData } = response;

        if (walletHash !== data.syncHash) {
          // different local hash, need to synchronise
          dispatch(doSetSync(data.syncHash, walletHash, walletData));
        }

        dispatch({ type: ACTIONS.GET_SYNC_COMPLETED, data });
        handleCallback(null, data.changed);
      })
      .catch((syncAttemptError) => {
        const badPasswordError =
          syncAttemptError && syncAttemptError.data && syncAttemptError.data.name === BAD_PASSWORD_ERROR_NAME;

        if (data.unlockFailed) {
          dispatch({ type: ACTIONS.GET_SYNC_FAILED, data: { error: syncAttemptError } });

          if (badPasswordError) {
            dispatch({ type: ACTIONS.SYNC_APPLY_BAD_PASSWORD });
          }

          handleCallback(syncAttemptError);
        } else if (data.hasSyncedWallet) {
          const error = (syncAttemptError && syncAttemptError.message) || 'Error getting synced wallet';
          dispatch({
            type: ACTIONS.GET_SYNC_FAILED,
            data: {
              error,
            },
          });

          if (badPasswordError) {
            dispatch({ type: ACTIONS.SYNC_APPLY_BAD_PASSWORD });
          }

          handleCallback(error);
        } else {
          const noWalletError = syncAttemptError && syncAttemptError.message === NO_WALLET_ERROR;

          dispatch({
            type: ACTIONS.GET_SYNC_COMPLETED,
            data: {
              hasSyncedWallet: false,
              syncHash: null,
              // If there was some unknown error, bail
              fatalError: !noWalletError,
            },
          });

          // user doesn't have a synced wallet
          //   call sync_apply to get data to sync
          //   first time sync. use any string for old hash
          if (noWalletError) {
            Lbry.sync_apply({ password })
              .then(({ hash: walletHash, data: syncApplyData }) => {
                dispatch(doSetSync('', walletHash, syncApplyData));
                handleCallback();
              })
              .catch((syncApplyError) => {
                handleCallback(syncApplyError);
              });
          }
        }
      });
  };
}

