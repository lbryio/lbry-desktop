import * as ACTIONS from 'constants/action_types';
import Lbry from 'lbry';
import { doToast } from 'redux/actions/notifications';
import { selectBalance, selectPendingSupportTransactions, selectTxoPageParams } from 'redux/selectors/wallet';
import { creditsToString } from 'util/format-credits';
import { selectMyClaimsRaw } from 'redux/selectors/claims';
import { doFetchChannelListMine, doFetchClaimListMine } from 'redux/actions/claims';

let walletBalancePromise = null;
export function doUpdateBalance() {
  return (dispatch, getState) => {
    const {
      wallet: { totalBalance: totalInStore },
    } = getState();

    if (walletBalancePromise === null) {
      walletBalancePromise = Lbry.wallet_balance()
        .then(response => {
          walletBalancePromise = null;

          const { available, reserved, reserved_subtotals, total } = response;
          const { claims, supports, tips } = reserved_subtotals;
          const totalFloat = parseFloat(total);

          if (totalInStore !== totalFloat) {
            dispatch({
              type: ACTIONS.UPDATE_BALANCE,
              data: {
                totalBalance: totalFloat,
                balance: parseFloat(available),
                reservedBalance: parseFloat(reserved),
                claimsBalance: parseFloat(claims),
                supportsBalance: parseFloat(supports),
                tipsBalance: parseFloat(tips),
              },
            });
          }
        })
        .catch(() => {
          walletBalancePromise = null;
        });
    }

    return walletBalancePromise;
  };
}

export function doBalanceSubscribe() {
  return dispatch => {
    dispatch(doUpdateBalance());
    setInterval(() => dispatch(doUpdateBalance()), 5000);
  };
}

export function doFetchTransactions(page = 1, pageSize = 99999) {
  return dispatch => {
    dispatch(doFetchSupports());
    dispatch({
      type: ACTIONS.FETCH_TRANSACTIONS_STARTED,
    });

    Lbry.utxo_release()
      .then(() => Lbry.transaction_list({ page, page_size: pageSize }))
      .then(result => {
        dispatch({
          type: ACTIONS.FETCH_TRANSACTIONS_COMPLETED,
          data: {
            transactions: result.items,
          },
        });
      });
  };
}

export function doFetchTxoPage() {
  return (dispatch, getState) => {
    dispatch({
      type: ACTIONS.FETCH_TXO_PAGE_STARTED,
    });

    const state = getState();
    const queryParams = selectTxoPageParams(state);

    Lbry.utxo_release()
      .then(() => Lbry.txo_list(queryParams))
      .then(res => {
        dispatch({
          type: ACTIONS.FETCH_TXO_PAGE_COMPLETED,
          data: res,
        });
      })
      .catch(e => {
        dispatch({
          type: ACTIONS.FETCH_TXO_PAGE_COMPLETED,
          data: e.message,
        });
      });
  };
}

export function doUpdateTxoPageParams(params: TxoListParams) {
  return dispatch => {
    dispatch({
      type: ACTIONS.UPDATE_TXO_FETCH_PARAMS,
      data: params,
    });

    dispatch(doFetchTxoPage());
  };
}

export function doFetchSupports(page = 1, pageSize = 99999) {
  return dispatch => {
    dispatch({
      type: ACTIONS.FETCH_SUPPORTS_STARTED,
    });

    Lbry.support_list({ page, page_size: pageSize }).then(result => {
      dispatch({
        type: ACTIONS.FETCH_SUPPORTS_COMPLETED,
        data: {
          supports: result.items,
        },
      });
    });
  };
}

export function doGetNewAddress() {
  return dispatch => {
    dispatch({
      type: ACTIONS.GET_NEW_ADDRESS_STARTED,
    });

    Lbry.address_unused().then(address => {
      dispatch({
        type: ACTIONS.GET_NEW_ADDRESS_COMPLETED,
        data: { address },
      });
    });
  };
}

export function doCheckAddressIsMine(address) {
  return dispatch => {
    dispatch({
      type: ACTIONS.CHECK_ADDRESS_IS_MINE_STARTED,
    });

    Lbry.address_is_mine({ address }).then(isMine => {
      if (!isMine) dispatch(doGetNewAddress());

      dispatch({
        type: ACTIONS.CHECK_ADDRESS_IS_MINE_COMPLETED,
      });
    });
  };
}

export function doSendDraftTransaction(address, amount) {
  return (dispatch, getState) => {
    const state = getState();
    const balance = selectBalance(state);

    if (balance - amount <= 0) {
      dispatch(
        doToast({
          title: 'Insufficient credits',
          message: 'Insufficient credits',
        })
      );
      return;
    }

    dispatch({
      type: ACTIONS.SEND_TRANSACTION_STARTED,
    });

    const successCallback = response => {
      if (response.txid) {
        dispatch({
          type: ACTIONS.SEND_TRANSACTION_COMPLETED,
        });
        dispatch(
          doToast({
            message: `You sent ${amount} LBC`,
            linkText: 'History',
            linkTarget: '/wallet',
          })
        );
      } else {
        dispatch({
          type: ACTIONS.SEND_TRANSACTION_FAILED,
          data: { error: response },
        });
        dispatch(
          doToast({
            message: 'Transaction failed',
            isError: true,
          })
        );
      }
    };

    const errorCallback = error => {
      dispatch({
        type: ACTIONS.SEND_TRANSACTION_FAILED,
        data: { error: error.message },
      });
      dispatch(
        doToast({
          message: 'Transaction failed',
          isError: true,
        })
      );
    };

    Lbry.wallet_send({
      addresses: [address],
      amount: creditsToString(amount),
    }).then(successCallback, errorCallback);
  };
}

export function doSetDraftTransactionAmount(amount) {
  return {
    type: ACTIONS.SET_DRAFT_TRANSACTION_AMOUNT,
    data: { amount },
  };
}

export function doSetDraftTransactionAddress(address) {
  return {
    type: ACTIONS.SET_DRAFT_TRANSACTION_ADDRESS,
    data: { address },
  };
}

export function doSendTip(amount, claimId, isSupport, successCallback, errorCallback) {
  return (dispatch, getState) => {
    const state = getState();
    const balance = selectBalance(state);
    const myClaims = selectMyClaimsRaw(state);

    const shouldSupport =
      isSupport || (myClaims ? myClaims.find(claim => claim.claim_id === claimId) : false);

    if (balance - amount <= 0) {
      dispatch(
        doToast({
          message: __('Insufficient credits'),
          isError: true,
        })
      );
      return;
    }

    const success = () => {
      dispatch(
        doToast({
          message: shouldSupport
            ? __('You deposited %amount% LBC as a support!', { amount })
            : __('You sent %amount% LBC as a tip, Mahalo!', { amount }),
          linkText: __('History'),
          linkTarget: __('/wallet'),
        })
      );

      dispatch({
        type: ACTIONS.SUPPORT_TRANSACTION_COMPLETED,
      });

      if (successCallback) {
        successCallback();
      }
    };

    const error = err => {
      dispatch(
        doToast({
          message: __(`There was an error sending support funds.`),
          isError: true,
        })
      );

      dispatch({
        type: ACTIONS.SUPPORT_TRANSACTION_FAILED,
        data: {
          error: err,
        },
      });

      if (errorCallback) {
        errorCallback();
      }
    };

    dispatch({
      type: ACTIONS.SUPPORT_TRANSACTION_STARTED,
    });

    Lbry.support_create({
      claim_id: claimId,
      amount: creditsToString(amount),
      tip: !shouldSupport,
      blocking: true,
    }).then(success, error);
  };
}

export function doClearSupport() {
  return {
    type: ACTIONS.CLEAR_SUPPORT_TRANSACTION,
  };
}

export function doWalletEncrypt(newPassword) {
  return dispatch => {
    dispatch({
      type: ACTIONS.WALLET_ENCRYPT_START,
    });

    Lbry.wallet_encrypt({ new_password: newPassword }).then(result => {
      if (result === true) {
        dispatch({
          type: ACTIONS.WALLET_ENCRYPT_COMPLETED,
          result,
        });
      } else {
        dispatch({
          type: ACTIONS.WALLET_ENCRYPT_FAILED,
          result,
        });
      }
    });
  };
}

export function doWalletUnlock(password) {
  return dispatch => {
    dispatch({
      type: ACTIONS.WALLET_UNLOCK_START,
    });

    Lbry.wallet_unlock({ password }).then(result => {
      if (result === true) {
        dispatch({
          type: ACTIONS.WALLET_UNLOCK_COMPLETED,
          result,
        });
      } else {
        dispatch({
          type: ACTIONS.WALLET_UNLOCK_FAILED,
          result,
        });
      }
    });
  };
}

export function doWalletLock() {
  return dispatch => {
    dispatch({
      type: ACTIONS.WALLET_LOCK_START,
    });

    Lbry.wallet_lock().then(result => {
      if (result === true) {
        dispatch({
          type: ACTIONS.WALLET_LOCK_COMPLETED,
          result,
        });
      } else {
        dispatch({
          type: ACTIONS.WALLET_LOCK_FAILED,
          result,
        });
      }
    });
  };
}

export function doSupportAbandonForClaim(claimId, claimType, keep,  preview) {
  return dispatch => {
    if (preview) {
      dispatch({
        type: ACTIONS.ABANDON_CLAIM_SUPPORT_PREVIEW,
      });
    } else {
      dispatch({
        type: ACTIONS.ABANDON_CLAIM_SUPPORT_STARTED,
      });
    }

    const params = {claim_id: claimId};
    if (preview) params['preview'] = true;
    if (keep) params['keep'] = keep;
    return (
      Lbry.support_abandon(params)
        .then((res) => {
          if (!preview) {
            dispatch({
              type: ACTIONS.ABANDON_CLAIM_SUPPORT_COMPLETED,
              data: { claimId, txid: res.txid, effective: res.outputs[0].amount, type: claimType}, // add to pendingSupportTransactions,
            });
            dispatch(doCheckPendingTxs());
          }
          return res;
        })
        .catch(e => {
          dispatch({
            type: ACTIONS.ABANDON_CLAIM_SUPPORT_FAILED,
            data: e.message,
          });
        }));
  };
}

export function doWalletReconnect() {
  return dispatch => {
    dispatch({
      type: ACTIONS.WALLET_RESTART,
    });
    // this basically returns null when it's done. :(
    // might be good to  dispatch ACTIONS.WALLET_RESTARTED
    Lbry.wallet_reconnect().then(() =>
      dispatch({
        type: ACTIONS.WALLET_RESTART_COMPLETED,
      })
    );
  };
}
export function doWalletDecrypt() {
  return dispatch => {
    dispatch({
      type: ACTIONS.WALLET_DECRYPT_START,
    });

    Lbry.wallet_decrypt().then(result => {
      if (result === true) {
        dispatch({
          type: ACTIONS.WALLET_DECRYPT_COMPLETED,
          result,
        });
      } else {
        dispatch({
          type: ACTIONS.WALLET_DECRYPT_FAILED,
          result,
        });
      }
    });
  };
}

export function doWalletStatus() {
  return dispatch => {
    dispatch({
      type: ACTIONS.WALLET_STATUS_START,
    });

    Lbry.wallet_status().then(status => {
      if (status) {
        dispatch({
          type: ACTIONS.WALLET_STATUS_COMPLETED,
          result: status.is_encrypted,
        });
      }
    });
  };
}


export function doSetTransactionListFilter(filterOption) {
  return {
    type: ACTIONS.SET_TRANSACTION_LIST_FILTER,
    data: filterOption,
  };
}

export function doUpdateBlockHeight() {
  return dispatch =>
    Lbry.status().then(status => {
      if (status.wallet) {
        dispatch({
          type: ACTIONS.UPDATE_CURRENT_HEIGHT,
          data: status.wallet.blocks,
        });
      }
    });
}

// Calls transaction_show on txes until any pending txes are confirmed
export const doCheckPendingTxs = () => (
  dispatch,
  getState
) => {
  const state = getState();
  const pendingTxsById = selectPendingSupportTransactions(state); // {}
  if (!Object.keys(pendingTxsById).length) {
    return;
  }
  let txCheckInterval;
  const checkTxList = () => {
    const state = getState();
    const pendingTxs = selectPendingSupportTransactions(state); // {}
    const promises = [];
    const newPendingTxes = {};
    const types = new Set([]);
    let changed = false;
    Object.entries(pendingTxs).forEach(([claim, data]) => {
      promises.push(Lbry.transaction_show({txid: data.txid}));
      types.add(data.type);
    });

    Promise.all(promises).then(txShows => {
      txShows.forEach(result => {
        if (result.height <= 0) {
          const entries = Object.entries(pendingTxs);
          const match = entries.find((entry) => entry[1].txid === result.txid);
          newPendingTxes[match[0]] = match[1];
        } else {
          changed = true;
        }
      });
    }).then(() => {
      if (changed) {
        dispatch({
          type: ACTIONS.PENDING_SUPPORTS_UPDATED,
          data: newPendingTxes,
        });
        if (types.has('channel')) {
          dispatch(doFetchChannelListMine());
        }
        if (types.has('stream')) {
          dispatch(doFetchClaimListMine());
        }
      }
      if (Object.keys(newPendingTxes).length === 0) clearInterval(txCheckInterval);
    });

    if (!Object.keys(pendingTxsById).length) {
      clearInterval(txCheckInterval);
    }
  };

  txCheckInterval = setInterval(() => {
    checkTxList();
  }, 30000);
};
