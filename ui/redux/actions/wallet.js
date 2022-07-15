import * as ACTIONS from 'constants/action_types';
import * as MODALS from 'constants/modal_types';
import * as ERRORS from 'constants/errors';
import Lbry from 'lbry';
import { Lbryio } from 'lbryinc';
import { doOpenModal } from 'redux/actions/app';
import { doToast } from 'redux/actions/notifications';
import {
  selectBalance,
  selectPendingSupportTransactions,
  selectTxoPageParams,
  selectPendingOtherTransactions,
  selectPendingConsolidateTxid,
  selectPendingMassClaimTxid,
} from 'redux/selectors/wallet';
import { resolveApiMessage } from 'util/api-message';
import { creditsToString } from 'util/format-credits';
import { selectMyClaimsRaw, selectClaimsById } from 'redux/selectors/claims';
import { doFetchChannelListMine, doFetchClaimListMine, doClaimSearch } from 'redux/actions/claims';
const FIFTEEN_SECONDS = 15000;
let walletBalancePromise = null;

export function doUpdateBalance() {
  return (dispatch, getState) => {
    const {
      wallet: { totalBalance: totalInStore },
    } = getState();

    if (walletBalancePromise === null) {
      walletBalancePromise = Lbry.wallet_balance()
        .then((response) => {
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
  return (dispatch) => {
    dispatch(doUpdateBalance());
    setInterval(() => dispatch(doUpdateBalance()), 10000);
  };
}

export function doFetchTransactions(page = 1, pageSize = 999999) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.FETCH_TRANSACTIONS_STARTED,
    });

    Lbry.transaction_list({ page, page_size: pageSize }).then((result) => {
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
    const fetchId = Math.random().toString(36).substr(2, 9);

    dispatch({
      type: ACTIONS.FETCH_TXO_PAGE_STARTED,
      data: fetchId,
    });

    const state = getState();
    const queryParams = selectTxoPageParams(state);

    Lbry.txo_list(queryParams)
      .then((res) => {
        const items = res.items || [];
        const claimsById = selectClaimsById(state);

        const channelIds = items.reduce((acc, cur) => {
          if (cur.type === 'support' && cur.signing_channel && !claimsById[cur.signing_channel.channel_id]) {
            acc.push(cur.signing_channel.channel_id);
          }
          return acc;
        }, []);

        if (channelIds.length) {
          const searchParams = {
            page_size: 9999,
            page: 1,
            no_totals: true,
            claim_ids: channelIds,
          };
          // make sure redux has these channels resolved
          dispatch(doClaimSearch(searchParams));
        }

        return res;
      })
      .then((res) => {
        dispatch({
          type: ACTIONS.FETCH_TXO_PAGE_COMPLETED,
          data: {
            result: res,
            fetchId: fetchId,
          },
        });
      })
      .catch((e) => {
        dispatch({
          type: ACTIONS.FETCH_TXO_PAGE_COMPLETED,
          data: {
            error: e.message,
            fetchId: fetchId,
          },
        });
      });
  };
}

export function doUpdateTxoPageParams(params) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.UPDATE_TXO_FETCH_PARAMS,
      data: params,
    });

    dispatch(doFetchTxoPage());
  };
}

export function doFetchSupports(page = 1, pageSize = 99999) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.FETCH_SUPPORTS_STARTED,
    });

    Lbry.support_list({ page, page_size: pageSize }).then((result) => {
      dispatch({
        type: ACTIONS.FETCH_SUPPORTS_COMPLETED,
        data: {
          supports: result.items,
        },
      });
    });
  };
}

export function doFetchUtxoCounts() {
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.FETCH_UTXO_COUNT_STARTED,
    });

    let resultSets = await Promise.all([
      Lbry.txo_list({ type: 'other', is_not_spent: true, page: 1, page_size: 1 }),
      Lbry.txo_list({ type: 'support', is_not_spent: true, page: 1, page_size: 1 }),
    ]);
    const counts = {};
    const paymentCount = resultSets[0]['total_items'];
    const supportCount = resultSets[1]['total_items'];
    counts['other'] = typeof paymentCount === 'number' ? paymentCount : 0;
    counts['support'] = typeof supportCount === 'number' ? supportCount : 0;

    dispatch({
      type: ACTIONS.FETCH_UTXO_COUNT_COMPLETED,
      data: counts,
      debug: { resultSets },
    });
  };
}

export function doUtxoConsolidate() {
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.DO_UTXO_CONSOLIDATE_STARTED,
    });

    const results = await Lbry.txo_spend({ type: 'other' });
    const result = results[0];

    dispatch({
      type: ACTIONS.PENDING_CONSOLIDATED_TXOS_UPDATED,
      data: { txids: [result.txid] },
    });

    dispatch({
      type: ACTIONS.DO_UTXO_CONSOLIDATE_COMPLETED,
      data: { txid: result.txid },
    });
    dispatch(doCheckPendingTxs());
  };
}

export function doTipClaimMass() {
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.TIP_CLAIM_MASS_STARTED,
    });

    const results = await Lbry.txo_spend({ type: 'support', is_not_my_input: true });
    const result = results[0];

    dispatch({
      type: ACTIONS.PENDING_CONSOLIDATED_TXOS_UPDATED,
      data: { txids: [result.txid] },
    });

    dispatch({
      type: ACTIONS.TIP_CLAIM_MASS_COMPLETED,
      data: { txid: result.txid },
    });
    dispatch(doCheckPendingTxs());
  };
}

export function doGetNewAddress() {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.GET_NEW_ADDRESS_STARTED,
    });

    Lbry.address_unused().then((address) => {
      dispatch({
        type: ACTIONS.GET_NEW_ADDRESS_COMPLETED,
        data: { address },
      });
    });
  };
}

export function doCheckAddressIsMine(address) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.CHECK_ADDRESS_IS_MINE_STARTED,
    });

    Lbry.address_is_mine({ address }).then((isMine) => {
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
          title: __('Insufficient credits'),
          message: __('Insufficient credits'),
        })
      );
      return;
    }

    dispatch({
      type: ACTIONS.SEND_TRANSACTION_STARTED,
    });

    const successCallback = (response) => {
      if (response.txid) {
        dispatch({
          type: ACTIONS.SEND_TRANSACTION_COMPLETED,
        });
        dispatch(
          doToast({
            message: __('Credits successfully sent.'),
            linkText: `${amount} LBC`,
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
            message: __('Transaction failed'),
            isError: true,
          })
        );
      }
    };

    const errorCallback = (error) => {
      dispatch({
        type: ACTIONS.SEND_TRANSACTION_FAILED,
        data: { error: error.message },
      });

      const errMsg = typeof error === 'object' ? error.message : error;
      if (errMsg.endsWith(ERRORS.SDK_FETCH_TIMEOUT)) {
        dispatch(
          doOpenModal(MODALS.CONFIRM, {
            title: __('Transaction failed'),
            body:
              'The transaction timed out, but may have been completed. Please wait a few minutes, then check your wallet transactions before attempting to retry.',
            onConfirm: (closeModal) => closeModal(),
            hideCancel: true,
          })
        );
      } else {
        dispatch(
          doToast({
            message: __('Transaction failed'),
            subMessage: resolveApiMessage(error?.message),
            isError: true,
          })
        );
      }
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

export function doSendTip(params, isSupport, successCallback, errorCallback, shouldNotify = true, purpose = '') {
  return (dispatch, getState) => {
    const state = getState();
    const balance = selectBalance(state);
    const myClaims = selectMyClaimsRaw(state);
    const supportOwnClaim = myClaims ? myClaims.find((claim) => claim.claim_id === params.claim_id) : false;

    const shouldSupport = isSupport || supportOwnClaim;

    if (balance - params.amount <= 0) {
      dispatch(
        doToast({
          message: __('Insufficient credits'),
          isError: true,
        })
      );
      return;
    }

    const success = (response) => {
      if (shouldNotify) {
        dispatch(
          doToast({
            message: shouldSupport ? __('Boost transaction successful.') : __('Tip successfully sent.'),
            subMessage: __("I'm sure they appreciate it!"),
            linkText: `${params.amount} LBC`,
            linkTarget: '/wallet',
          })
        );
      }

      dispatch({
        type: ACTIONS.SUPPORT_TRANSACTION_COMPLETED,
        data: {
          amount: params.amount,
          type: shouldSupport ? (supportOwnClaim ? 'support_own' : 'support_others') : 'tip',
        },
      });

      if (successCallback) {
        successCallback(response);
      }
    };

    const error = (err) => {
      const baseMsg = isSupport ? __('Boost transaction failed.') : __('Tip transaction failed.');
      const errMsg = typeof err === 'object' ? err.message : err;

      if (errMsg.endsWith(ERRORS.SDK_FETCH_TIMEOUT)) {
        let msg;

        switch (purpose) {
          case 'comment':
            msg = __(
              'The transaction timed out, but may have been completed. Please wait a few minutes, then check your wallet transactions before attempting to retry. Note that due to current limitations, we are unable to re-link the tip sent to a new comment.'
            );
            break;

          default:
            msg = __(
              'The transaction timed out, but may have been completed. Please wait a few minutes, then check your wallet transactions before attempting to retry.'
            );
            break;
        }

        dispatch(
          doOpenModal(MODALS.CONFIRM, {
            title: baseMsg,
            body: msg,
            onConfirm: (closeModal) => closeModal(),
            hideCancel: true,
          })
        );
      }

      dispatch({
        type: ACTIONS.SUPPORT_TRANSACTION_FAILED,
        data: {
          error: err,
          type: shouldSupport ? (supportOwnClaim ? 'support_own' : 'support_others') : 'tip',
        },
      });

      if (errorCallback) {
        errorCallback(err);
      }
    };

    dispatch({
      type: ACTIONS.SUPPORT_TRANSACTION_STARTED,
    });

    Lbry.support_create({
      ...params,
      tip: !shouldSupport,
      blocking: true,
      amount: creditsToString(params.amount),
    }).then(success, error);
  };
}

export function doClearSupport() {
  return {
    type: ACTIONS.CLEAR_SUPPORT_TRANSACTION,
  };
}

export function doWalletEncrypt(newPassword) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.WALLET_ENCRYPT_START,
    });

    Lbry.wallet_encrypt({ new_password: newPassword }).then((result) => {
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
  return (dispatch) => {
    dispatch({
      type: ACTIONS.WALLET_UNLOCK_START,
    });

    Lbry.wallet_unlock({ password }).then((result) => {
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
  return (dispatch) => {
    dispatch({
      type: ACTIONS.WALLET_LOCK_START,
    });

    Lbry.wallet_lock().then((result) => {
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

// Collect all tips for a claim
export function doSupportAbandonForClaim(claimId, claimType, keep, preview) {
  return (dispatch) => {
    if (preview) {
      dispatch({
        type: ACTIONS.ABANDON_CLAIM_SUPPORT_PREVIEW,
      });
    } else {
      dispatch({
        type: ACTIONS.ABANDON_CLAIM_SUPPORT_STARTED,
      });
    }

    const params = { claim_id: claimId };
    if (preview) params['preview'] = true;
    if (keep) params['keep'] = keep;
    return Lbry.support_abandon(params)
      .then((res) => {
        if (!preview) {
          dispatch({
            type: ACTIONS.ABANDON_CLAIM_SUPPORT_COMPLETED,
            data: { claimId, txid: res.txid, effective: res.outputs[0].amount, type: claimType },
          });
          dispatch(doCheckPendingTxs());
        }
        return res;
      })
      .catch((e) => {
        dispatch({
          type: ACTIONS.ABANDON_CLAIM_SUPPORT_FAILED,
          data: e.message,
        });
      });
  };
}

export function doWalletReconnect() {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.WALLET_RESTART,
    });
    let failed = false;
    // this basically returns null when it's done. :(
    // might be good to  dispatch ACTIONS.WALLET_RESTARTED
    const walletTimeout = setTimeout(() => {
      failed = true;
      dispatch({
        type: ACTIONS.WALLET_RESTART_COMPLETED,
      });
      dispatch(
        doToast({
          message: __('Your servers were not available. Check your url and port, or switch back to defaults.'),
          isError: true,
        })
      );
    }, FIFTEEN_SECONDS);
    Lbry.wallet_reconnect().then(() => {
      clearTimeout(walletTimeout);
      if (!failed) dispatch({ type: ACTIONS.WALLET_RESTART_COMPLETED });
    });
  };
}

export function doWalletDecrypt() {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.WALLET_DECRYPT_START,
    });

    Lbry.wallet_decrypt().then((result) => {
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
  return (dispatch) => {
    dispatch({
      type: ACTIONS.WALLET_STATUS_START,
    });

    Lbry.wallet_status().then((status) => {
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
  return (dispatch) =>
    Lbry.status().then((status) => {
      if (status.wallet) {
        dispatch({
          type: ACTIONS.UPDATE_CURRENT_HEIGHT,
          data: status.wallet.blocks,
        });
      }
    });
}

// Calls transaction_show on txes until any pending txes are confirmed
export const doCheckPendingTxs = () => (dispatch, getState) => {
  const state = getState();
  const pendingTxsById = selectPendingSupportTransactions(state); // {}
  const pendingOtherTxes = selectPendingOtherTransactions(state);

  if (!Object.keys(pendingTxsById).length && !pendingOtherTxes.length) {
    return;
  }
  let txCheckInterval;
  const checkTxList = () => {
    const state = getState();
    const pendingSupportTxs = selectPendingSupportTransactions(state); // {}
    const pendingConsolidateTxes = selectPendingOtherTransactions(state);
    const pendingConsTxid = selectPendingConsolidateTxid(state);
    const pendingMassCLaimTxid = selectPendingMassClaimTxid(state);

    const promises = [];
    const newPendingTxes = {};
    const noLongerPendingConsolidate = [];
    const types = new Set([]);
    // { claimId: {txid: 123, amount 12.3}, }
    const entries = Object.entries(pendingSupportTxs);
    entries.forEach(([claim, data]) => {
      promises.push(Lbry.transaction_show({ txid: data.txid }));
      types.add(data.type);
    });
    if (pendingConsolidateTxes.length) {
      pendingConsolidateTxes.forEach((txid) => promises.push(Lbry.transaction_show({ txid })));
    }

    Promise.all(promises).then((txShows) => {
      let changed = false;
      txShows.forEach((result) => {
        if (pendingConsolidateTxes.includes(result.txid)) {
          if (result.height > 0) {
            noLongerPendingConsolidate.push(result.txid);
          }
        } else {
          if (result.height <= 0) {
            const match = entries.find((entry) => entry[1].txid === result.txid);
            newPendingTxes[match[0]] = match[1];
          } else {
            changed = true;
          }
        }
      });

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
      if (noLongerPendingConsolidate.length) {
        if (noLongerPendingConsolidate.includes(pendingConsTxid)) {
          dispatch(
            doToast({
              message: __('Your wallet is finished consolidating'),
            })
          );
        }
        if (noLongerPendingConsolidate.includes(pendingMassCLaimTxid)) {
          dispatch(
            doToast({
              message: __('Your tips have been collected'),
            })
          );
        }
        dispatch({
          type: ACTIONS.PENDING_CONSOLIDATED_TXOS_UPDATED,
          data: { txids: noLongerPendingConsolidate, remove: true },
        });
      }

      if (!Object.keys(pendingTxsById).length && !pendingOtherTxes.length) {
        clearInterval(txCheckInterval);
      }
    });
  };

  txCheckInterval = setInterval(() => {
    checkTxList();
  }, 30000);
};

export const doSendCashTip = (
  tipParams,
  anonymous,
  userParams,
  claimId,
  stripeEnvironment,
  preferredCurrency,
  successCallback
) => (dispatch) => {
  Lbryio.call(
    'customer',
    'tip',
    {
      // round to fix issues with floating point numbers
      amount: Math.round(100 * tipParams.tipAmount), // convert from dollars to cents
      creator_channel_name: tipParams.tipChannelName, // creator_channel_name
      creator_channel_claim_id: tipParams.channelClaimId,
      tipper_channel_name: anonymous ? '' : userParams.activeChannelName,
      tipper_channel_claim_id: anonymous ? '' : userParams.activeChannelId,
      currency: preferredCurrency || 'USD',
      anonymous: anonymous,
      source_claim_id: claimId,
      environment: stripeEnvironment,
    },
    'post'
  )
    .then((customerTipResponse) => {
      const fiatSymbol = preferredCurrency === 'USD' ? '$' : '€';

      dispatch(
        doToast({
          message: __('Tip successfully sent.'),
          subMessage: __("I'm sure they appreciate it!"),
          linkText: `${fiatSymbol}${tipParams.tipAmount} ⇒ ${tipParams.tipChannelName}`,
          linkTarget: '/wallet',
        })
      );

      if (successCallback) successCallback(customerTipResponse);
    })
    .catch((error) => {
      // show error message from Stripe if one exists (being passed from backend by Beamer's API currently)
      dispatch(
        doToast({
          message: error.message || __('Sorry, there was an error in processing your payment!'),
          isError: true,
        })
      );
    });
};

export const preOrderPurchase = (
  tipParams,
  anonymous,
  userParams,
  claimId,
  stripeEnvironment,
  preferredCurrency,
  successCallback,
  failureCallback
) => (dispatch) => {
  Lbryio.call(
    'customer',
    'tip',
    {
      // round to fix issues with floating point numbers
      amount: Math.round(100 * tipParams.tipAmount), // convert from dollars to cents
      creator_channel_name: tipParams.tipChannelName, // creator_channel_name
      creator_channel_claim_id: tipParams.channelClaimId,
      tipper_channel_name: userParams.activeChannelName,
      tipper_channel_claim_id: userParams.activeChannelId,
      currency: preferredCurrency || 'USD',
      anonymous: anonymous,
      source_claim_id: claimId,
      environment: stripeEnvironment,
    },
    'post'
  )
    .then((customerTipResponse) => {
      dispatch(
        doToast({
          message: __('Preorder completed successfully'),
          subMessage: __("You will be able to see the content as soon as it's available!"),
          // linkText: `${fiatSymbol}${tipParams.tipAmount} ⇒ ${tipParams.tipChannelName}`,
          // linkTarget: '/wallet',
        })
      );

      if (successCallback) successCallback(customerTipResponse);
    })
    .catch((error) => {
      // show error message from Stripe if one exists (being passed from backend by Beamer's API currently)
      dispatch(
        doToast({
          message: error.message || __('Sorry, there was an error in processing your payment!'),
          isError: true,
        })
      );

      if (failureCallback) failureCallback(error);
    });
};
