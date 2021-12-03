import * as ACTIONS from 'constants/action_types';
import { Lbryio } from 'lbryinc';
import Lbry from 'lbry';
import { doWalletEncrypt, doWalletDecrypt } from 'redux/actions/wallet';

const NO_WALLET_ERROR = 'no wallet found for this user';

export function doSetDefaultAccount(success, failure) {
  return dispatch => {
    dispatch({
      type: ACTIONS.SET_DEFAULT_ACCOUNT,
    });

    Lbry.account_list()
      .then(accountList => {
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
            .catch(err => {
              if (failure) {
                failure(err);
              }
            });
        } else if (failure) {
          // no default account to set
          failure('Could not set a default account'); // fail
        }
      })
      .catch(err => {
        if (failure) {
          failure(err);
        }
      });
  };
}

export function doSetSync(oldHash, newHash, data) {
  return dispatch => {
    dispatch({
      type: ACTIONS.SET_SYNC_STARTED,
    });

    return Lbryio.call('sync', 'set', { old_hash: oldHash, new_hash: newHash, data }, 'post')
      .then(response => {
        if (!response.hash) {
          throw Error('No hash returned for sync/set.');
        }

        return dispatch({
          type: ACTIONS.SET_SYNC_COMPLETED,
          data: { syncHash: response.hash },
        });
      })
      .catch(error => {
        dispatch({
          type: ACTIONS.SET_SYNC_FAILED,
          data: { error },
        });
      });
  };
}

export function doGetSync(passedPassword, callback) {
  const password = passedPassword === null || passedPassword === undefined ? '' : passedPassword;

  function handleCallback(error, hasNewData) {
    if (callback) {
      if (typeof callback !== 'function') {
        throw new Error('Second argument passed to "doGetSync" must be a function');
      }

      callback(error, hasNewData);
    }
  }

  return dispatch => {
    dispatch({
      type: ACTIONS.GET_SYNC_STARTED,
    });

    const data = {};

    Lbry.wallet_status()
      .then(status => {
        if (status.is_locked) {
          return Lbry.wallet_unlock({ password });
        }

        // Wallet is already unlocked
        return true;
      })
      .then(isUnlocked => {
        if (isUnlocked) {
          return Lbry.sync_hash();
        }
        data.unlockFailed = true;
        throw new Error();
      })
      .then(hash => Lbryio.call('sync', 'get', { hash }, 'post'))
      .then(response => {
        const syncHash = response.hash;
        data.syncHash = syncHash;
        data.syncData = response.data;
        data.changed = response.changed;
        data.hasSyncedWallet = true;

        if (response.changed) {
          return Lbry.sync_apply({ password, data: response.data, blocking: true });
        }
      })
      .then(response => {
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
      .catch(syncAttemptError => {
        if (data.unlockFailed) {
          dispatch({ type: ACTIONS.GET_SYNC_FAILED, data: { error: syncAttemptError } });

          if (password !== '') {
            dispatch({ type: ACTIONS.SYNC_APPLY_BAD_PASSWORD });
          }

          handleCallback(syncAttemptError);
        } else if (data.hasSyncedWallet) {
          const error =
            (syncAttemptError && syncAttemptError.message) || 'Error getting synced wallet';
          dispatch({
            type: ACTIONS.GET_SYNC_FAILED,
            data: {
              error,
            },
          });

          // Temp solution until we have a bad password error code
          // Don't fail on blank passwords so we don't show a "password error" message
          // before users have ever entered a password
          if (password !== '') {
            dispatch({ type: ACTIONS.SYNC_APPLY_BAD_PASSWORD });
          }

          handleCallback(error);
        } else {
          // user doesn't have a synced wallet
          dispatch({
            type: ACTIONS.GET_SYNC_COMPLETED,
            data: { hasSyncedWallet: false, syncHash: null },
          });

          // call sync_apply to get data to sync
          // first time sync. use any string for old hash
          if (syncAttemptError.message === NO_WALLET_ERROR) {
            Lbry.sync_apply({ password })
              .then(({ hash: walletHash, data: syncApplyData }) => {
                dispatch(doSetSync('', walletHash, syncApplyData, password));
                handleCallback();
              })
              .catch(syncApplyError => {
                handleCallback(syncApplyError);
              });
          }
        }
      });
  };
}

export function doSyncApply(syncHash, syncData, password) {
  return dispatch => {
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
            error:
              'Invalid password specified. Please enter the password for your previously synchronised wallet.',
          },
        });
      });
  };
}

export function doCheckSync() {
  return dispatch => {
    dispatch({
      type: ACTIONS.GET_SYNC_STARTED,
    });

    Lbry.sync_hash().then(hash => {
      Lbryio.call('sync', 'get', { hash }, 'post')
        .then(response => {
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
  return dispatch =>
    new Promise(resolve => {
      dispatch({ type: ACTIONS.SYNC_RESET });
      resolve();
    });
}

export function doSyncEncryptAndDecrypt(oldPassword, newPassword, encrypt) {
  return dispatch => {
    const data = {};
    return Lbry.sync_hash()
      .then(hash => Lbryio.call('sync', 'get', { hash }, 'post'))
      .then(syncGetResponse => {
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
      .then(syncApplyResponse => {
        if (syncApplyResponse.hash !== data.oldHash) {
          return dispatch(doSetSync(data.oldHash, syncApplyResponse.hash, syncApplyResponse.data));
        }
      })
      .catch(console.error);
  };
}
