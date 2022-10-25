// @flow
import * as ACTIONS from 'constants/action_types';
import * as SETTINGS from 'constants/settings';
import * as SHARED_PREFERENCES from 'constants/shared_preferences';
import { Lbryio } from 'lbryinc';
import Lbry from 'lbry';
import { ipcRenderer } from 'electron';
import * as Lbrysync from 'lbrysync';
import { safeStoreEncrypt, safeStoreDecrypt, getSavedPassword } from 'util/saved-passwords';

import { doWalletEncrypt, doWalletDecrypt, doUpdateBalance } from 'redux/actions/wallet';
import {
  selectSyncHash,
  selectGetSyncIsPending,
  selectSetSyncIsPending,
  selectSyncIsLocked,
} from 'redux/selectors/sync';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doHandleSyncComplete } from 'redux/actions/app';
import Comments from 'comments';
import { getSubsetFromKeysArray } from 'util/sync-settings';

let syncTimer = null;
let verifyInterval = null;
const SYNC_INTERVAL = 1000 * 60 * 5; // 5 minutes
const NO_WALLET_ERROR = 'no wallet found for this user';
const BAD_PASSWORD_ERROR_NAME = 'InvalidPasswordError';
const { CLIENT_SYNC_KEYS } = SHARED_PREFERENCES;
export function doSetDefaultAccount(success: () => void, failure: (string) => void) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.SET_DEFAULT_ACCOUNT,
    });

    Lbry.account_list()
      .then((accountList) => {
        const { lbc_mainnet: accounts } = accountList;
        let defaultId;
        for (let i = 0; i < accounts.length; ++i) {
          if (accounts[i].satoshis > 0) {
            defaultId = accounts[i].id;
            break;
          }
        }

        // In a case where there's no balance on either account
        // assume the second (which is created after sync) as default
        if (!defaultId && accounts.length > 1) {
          defaultId = accounts[1].id;
        }

        // Set the default account
        if (defaultId) {
          Lbry.account_set({ account_id: defaultId, default: true })
            .then(() => {
              if (success) {
                success();
              }
            })
            .catch((err) => {
              if (failure) {
                failure(err);
              }
            });
        } else if (failure) {
          // no default account to set
          failure('Could not set a default account'); // fail
        }
      })
      .catch((err) => {
        if (failure) {
          failure(err);
        }
      });
  };
}

// "signupCheck=true" - if signupCheck and salt, return fail. else if salt return salt.
// export const doLbrysyncGetSalt = (email: string) => async (dispatch: Dispatch) => {
//   const { fetchSaltSeed } = Lbrysync;
//   dispatch({
//     type: ACTIONS.LSYNC_GET_SALT_STARTED,
//   });
//   try {
//     const saltOrError = await fetchSaltSeed(email);
//     console.log('REDUX Salt', saltOrError)
//     dispatch({
//       type: ACTIONS.LSYNC_GET_SALT_COMPLETED,
//       data: { email: email, saltSeed: saltOrError},
//     });
//     return saltOrError;
//   } catch (e) {
//     dispatch({
//       type: ACTIONS.LSYNC_GET_SALT_FAILED,
//       data: { email: email, saltError: 'Not Found'},
//     });
//     return 'not found';
//   }
// };

export const doHandleEmail = (email, isSignUp) => async (dispatch: Dispatch) => {
  dispatch({
    type: ACTIONS.LSYNC_CHECK_EMAIL_STARTED,
    // CLEAR STUFF
  });
  const { fetchSaltSeed } = Lbrysync;
  if (isSignUp) {
    try {
      await fetchSaltSeed(email);
      // !!got salt seed
      dispatch({
        type: ACTIONS.LSYNC_CHECK_EMAIL_FAILED,
        data: { emailError: 'Email Already Found' },
      });
    } catch (e) {
      // no salt, we're good.
      const seed = await ipcRenderer.invoke('invoke-get-salt-seed');
      dispatch({
        type: ACTIONS.LSYNC_CHECK_EMAIL_COMPLETED,
        data: { candidateEmail: email, saltSeed: seed },
      });
    }
  } else {
    // Sign In
    try {
      const saltResponse = await fetchSaltSeed(email);
      // !!got salt seed
      dispatch({
        type: ACTIONS.LSYNC_CHECK_EMAIL_COMPLETED,
        data: { candidateEmail: email, saltSeed: saltResponse.seed },
      });
    } catch (e) {
      console.log('e', e.message);
      dispatch({
        type: ACTIONS.LSYNC_CHECK_EMAIL_FAILED,
        data: { emailError: 'Email Not Found' },
      });
    }
  }
};

export const doLbrysyncSync = () => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({
    type: ACTIONS.LSYNC_SYNC_STARTED,
  });
  // Wallet status
  const status = await Lbry.wallet_status();
  // if (status.isLocked) {
  //   // error
  // }
  // return Lbry.wallet_unlock({ password });
  //   .then((status) => {
  //
  //
  // }

  // See if we should pull
  const { pullWallet } = Lbrysync;

  // Pull from sync
  const walletInfo = await pullWallet();
  if (walletInfo) {
    console.log('walletInfo', walletInfo);
    /*
        wallet_state = WalletState(
        encrypted_wallet=response.json()['encryptedWallet'],
        sequence=response.json()['sequence'],
        )
        hmac = response.json()['hmac']
        return wallet_state, hmac
       */
    // Lbry.wallet_import();
    // update sequence, others
  }
  const exported = await Lbry.wallet_export();
  // const encWallet = encrypt(exported, password)
};

//register an email (eventually username)
export const doLbrysyncRegister = (password: string) => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({
    type: ACTIONS.LSYNC_REGISTER_STARTED,
  });
  const state = getState();
  const { sync } = state;
  const { candidateEmail: email, saltSeed } = sync;
  // started
  try {
    const secrets = await ipcRenderer.invoke('invoke-get-secrets', password, email, saltSeed);
    const encProviderKey = safeStoreEncrypt(secrets.providerKey);
    const encHmacKey = safeStoreEncrypt(secrets.hmacKey);
    const encDataKey = safeStoreEncrypt(secrets.dataKey);
    const enctyptedRoot = safeStoreEncrypt(password);
    const registerData = {
      email, // email
      saltSeed,
      providerKey: encProviderKey,
      hmacKey: encHmacKey,
      dataKey: encDataKey,
      rootPass: enctyptedRoot,
    };
    dispatch({
      type: ACTIONS.LSYNC_REGISTER_COMPLETED,
      data: registerData,
    });

    return registerData;
  } catch (e) {
    console.log('e', e.message);
    dispatch({
      type: ACTIONS.LSYNC_REGISTER_FAILED,
      data: 'ohno',
    });
    return;
  }
};

export function doEmailVerifySubscribe(stop) {
  return (dispatch) => {
    if (stop) {
      clearInterval(verifyInterval);
    } else {
      dispatch(doLbrysyncAuthenticate());
      verifyInterval = setInterval(() => dispatch(doLbrysyncAuthenticate()), 5000);
    }
  };
}

// get token given username/password
export const doLbrysyncAuthenticate = () => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({
    type: ACTIONS.LSYNC_AUTH_STARTED,
  });
  const state = getState();
  const { sync } = state;
  const { registeredEmail: email, encryptedProviderKey } = sync;
  const status = await Lbry.status();
  const { installation_id: deviceId } = status;
  const password = safeStoreDecrypt(encryptedProviderKey);

  const { getAuthToken } = Lbrysync;

  const result: { token?: string, error?: string } = await getAuthToken(email, password, deviceId);

  if (result.token) {
    dispatch({
      type: ACTIONS.LSYNC_AUTH_COMPLETED,
      data: result.token,
    });
    clearInterval(verifyInterval);
  } else {
    dispatch({
      type: ACTIONS.LSYNC_AUTH_FAILED,
      data: result.error,
    });
  }
};

// replaced with
export function doSetSync(oldHash: string, newHash: string, data: any) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.SET_SYNC_STARTED,
    });

    return Lbryio.call('sync', 'set', { old_hash: oldHash, new_hash: newHash, data }, 'post')
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

/*
  make sure
   - enabled
   - not pending
   - wallet not locked
   -
  get password
  doGetSync(password, cb)
 */
export const doGetSyncDesktop =
  (cb?: (any, any) => void, password?: string) => (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const getSyncPending = selectGetSyncIsPending(state);
    const setSyncPending = selectSetSyncIsPending(state);
    const syncLocked = selectSyncIsLocked(state);
    // here we instead do the new getsync with the derived password
    return getSavedPassword().then((savedPassword) => {
      const passwordArgument = password || password === '' ? password : savedPassword === null ? '' : savedPassword;

      if (!getSyncPending && !setSyncPending && !syncLocked) {
        return dispatch(doGetSync(passwordArgument, cb));
      }
    });
  };

/*
  start regularly polling sync
   - start loop if should.
 */
export function doSyncLoop(noInterval?: boolean) {
  return (dispatch: Dispatch, getState: GetState) => {
    if (!noInterval && syncTimer) clearInterval(syncTimer);
    const state = getState();
    // SHOULD SYNC?
    // syncSignedIn = selectLbrySyncSignedIn(state);
    const syncSignedIn = false;
    const syncEnabled = makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state);
    const syncLocked = selectSyncIsLocked(state);
    // if shouldSync
    if (syncSignedIn && syncEnabled && !syncLocked) {
      // doSync
      //
      dispatch(doGetSyncDesktop((error, hasNewData) => dispatch(doHandleSyncComplete(error, hasNewData))));
      if (!noInterval) {
        syncTimer = setInterval(() => {
          const state = getState();
          const syncEnabled = makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state);
          if (syncEnabled) {
            dispatch(doGetSyncDesktop((error, hasNewData) => dispatch(doHandleSyncComplete(error, hasNewData))));
          }
        }, SYNC_INTERVAL);
      }
    }
  };
}

/*
  stop regularly polling sync
 */
export function doSyncUnsubscribe() {
  return () => {
    if (syncTimer) {
      clearInterval(syncTimer);
    }
  };
}

/*
  make sure not locked

 */
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
          return Lbry.sync_hash();
        }
        data.unlockFailed = true;
        throw new Error();
      })
      .then((hash?: string) => Lbryio.call('sync', 'get', { hash }, 'post'))
      .then((response: any) => {
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

export function doSyncApply(syncHash: string, syncData: any, password: string) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.SYNC_APPLY_STARTED,
    });

    Lbry.sync_apply({ password, data: syncData })
      .then(({ hash: walletHash, data: walletData }) => {
        dispatch({
          type: ACTIONS.SYNC_APPLY_COMPLETED,
        });

        if (walletHash !== syncHash) {
          // different local hash, need to synchronise
          dispatch(doSetSync(syncHash, walletHash, walletData));
        }
      })
      .catch(() => {
        dispatch({
          type: ACTIONS.SYNC_APPLY_FAILED,
          data: {
            error: 'Invalid password specified. Please enter the password for your previously synchronised wallet.',
          },
        });
      });
  };
}

export function doWalletExport(password?: string) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.WALLET_EXPORT_STARTED,
    });
    Lbry.wallet_export({ password })
      .then((walletData) => {
        // if password, etc etc
        // return data
        dispatch({
          type: ACTIONS.WALLET_EXPORT_COMPLETED,
        });
      })
      .catch((e) => {
        dispatch({
          type: ACTIONS.WALLET_EXPORT_FAILED,
          data: {
            error: 'Wallet Export Failed',
          },
        });
      });
  };
}

export function doWalletImport(data: string, password?: string) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.WALLET_IMPORT_STARTED,
    });
    Lbry.wallet_import({ data, password })
      .then((walletData) => {
        // if password, etc etc
        // return data
        dispatch({
          type: ACTIONS.WALLET_IMPORT_COMPLETED,
        });
      })
      .catch((e) => {
        dispatch({
          type: ACTIONS.WALLET_IMPORT_FAILED,
          data: {
            error: 'Wallet Import Failed',
          },
        });
      });
  };
}

export function doCheckSync() {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.GET_SYNC_STARTED,
    });

    Lbry.sync_hash().then((hash) => {
      Lbryio.call('sync', 'get', { hash }, 'post')
        .then((response) => {
          const data = {
            hasSyncedWallet: true,
            syncHash: response.hash,
            syncData: response.data,
            hashChanged: response.changed,
          };
          dispatch({ type: ACTIONS.GET_SYNC_COMPLETED, data });
        })
        .catch(() => {
          // user doesn't have a synced wallet
          dispatch({
            type: ACTIONS.GET_SYNC_COMPLETED,
            data: { hasSyncedWallet: false, syncHash: null },
          });
        });
    });
  };
}

export function doResetSync() {
  return (dispatch: Dispatch): Promise<any> =>
    new Promise((resolve) => {
      dispatch({ type: ACTIONS.SYNC_RESET });
      resolve();
    });
}

export function doSyncEncryptAndDecrypt(oldPassword: string, newPassword: string, encrypt: boolean) {
  return (dispatch: Dispatch) => {
    const data = {};
    return Lbry.sync_hash()
      .then((hash) => Lbryio.call('sync', 'get', { hash }, 'post'))
      .then((syncGetResponse) => {
        data.oldHash = syncGetResponse.hash;

        return Lbry.sync_apply({ password: oldPassword, data: syncGetResponse.data });
      })
      .then(() => {
        if (encrypt) {
          dispatch(doWalletEncrypt(newPassword));
        } else {
          dispatch(doWalletDecrypt());
        }
      })
      .then(() => Lbry.sync_apply({ password: newPassword }))
      .then((syncApplyResponse) => {
        if (syncApplyResponse.hash !== data.oldHash) {
          return dispatch(doSetSync(data.oldHash, syncApplyResponse.hash, syncApplyResponse.data));
        }
      })
      .catch(console.error); // eslint-disable-line
  };
}

export function doSetSyncLock(lock: boolean) {
  return {
    type: ACTIONS.SET_SYNC_LOCK,
    data: lock,
  };
}

export function doSetPrefsReady() {
  return {
    type: ACTIONS.SET_PREFS_READY,
    data: true,
  };
}

type SharedData = {
  version: '0.1',
  value: {
    subscriptions?: Array<string>,
    following?: Array<{ uri: string, notificationsDisabled: boolean }>,
    tags?: Array<string>,
    blocked?: Array<string>,
    settings?: any,
    app_welcome_version?: number,
    sharing_3P?: boolean,
    unpublishedCollections: CollectionGroup,
    editedCollections: CollectionGroup,
    builtinCollections: CollectionGroup,
    savedCollections: Array<string>,
  },
};

function extractUserState(rawObj: SharedData) {
  if (rawObj && rawObj.version === '0.1' && rawObj.value) {
    const {
      subscriptions,
      following,
      tags,
      blocked,
      settings,
      app_welcome_version,
      sharing_3P,
      unpublishedCollections,
      editedCollections,
      builtinCollections,
      savedCollections,
    } = rawObj.value;

    return {
      ...(subscriptions ? { subscriptions } : {}),
      ...(following ? { following } : {}),
      ...(tags ? { tags } : {}),
      ...(blocked ? { blocked } : {}),
      ...(settings ? { settings } : {}),
      ...(app_welcome_version ? { app_welcome_version } : {}),
      ...(sharing_3P ? { sharing_3P } : {}),
      ...(unpublishedCollections ? { unpublishedCollections } : {}),
      ...(editedCollections ? { editedCollections } : {}),
      ...(builtinCollections ? { builtinCollections } : {}),
      ...(savedCollections ? { savedCollections } : {}),
    };
  }

  return {};
}

/* This action function should anything SYNC_STATE_POPULATE needs to trigger */
export function doPopulateSharedUserState(sharedSettings: any) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const {
      settings: { clientSettings: currentClientSettings },
    } = state;

    const {
      subscriptions,
      following,
      tags,
      blocked,
      settings,
      app_welcome_version,
      sharing_3P,
      unpublishedCollections,
      editedCollections,
      builtinCollections,
      savedCollections,
    } = extractUserState(sharedSettings);
    const selectedSettings = settings ? getSubsetFromKeysArray(settings, CLIENT_SYNC_KEYS) : {};
    const mergedClientSettings = { ...currentClientSettings, ...selectedSettings };
    // possibly move to doGetAndPopulate... in success callback
    Comments.setServerUrl(
      mergedClientSettings[SETTINGS.CUSTOM_COMMENTS_SERVER_ENABLED]
        ? mergedClientSettings[SETTINGS.CUSTOM_COMMENTS_SERVER_URL]
        : undefined
    );

    dispatch({
      type: ACTIONS.SYNC_STATE_POPULATE,
      data: {
        subscriptions,
        following,
        tags,
        blocked,
        walletPrefSettings: settings,
        mergedClientSettings,
        welcomeVersion: app_welcome_version,
        allowAnalytics: sharing_3P,
        unpublishedCollections,
        editedCollections,
        builtinCollections,
        savedCollections,
      },
    });
  };
}

export function doPreferenceSet(key: string, value: any, version: string, success: Function, fail: Function) {
  return (dispatch: Dispatch) => {
    const preference = {
      type: typeof value,
      version,
      value,
    };

    const options = {
      key,
      value: JSON.stringify(preference),
    };

    Lbry.preference_set(options)
      .then(() => {
        if (success) {
          success(preference);
        }
      })
      .catch((err) => {
        dispatch({
          type: ACTIONS.SYNC_FATAL_ERROR,
          error: err,
        });

        if (fail) {
          fail();
        }
      });
  };
}

export function doPreferenceGet(key: string, success: Function, fail?: Function) {
  return (dispatch: Dispatch) => {
    const options = {
      key,
    };

    return Lbry.preference_get(options)
      .then((result) => {
        if (result) {
          const preference = result[key];
          return success(preference);
        }

        return success(null);
      })
      .catch((err) => {
        dispatch({
          type: ACTIONS.SYNC_FATAL_ERROR,
          error: err,
        });

        if (fail) {
          fail(err);
        }
      });
  };
}
