// @flow
import * as ACTIONS from 'constants/action_types';
import Lbry from 'lbry';
import { doToast } from 'redux/actions/notifications';
import { selectBalance } from 'redux/selectors/wallet';
import {
  makeSelectFileInfoForUri,
  selectDownloadingByOutpoint,
  makeSelectStreamingUrlForUri,
} from 'redux/selectors/file_info';
import { makeSelectClaimForUri } from 'redux/selectors/claims';

type Dispatch = (action: any) => any;
type GetState = () => { file: FileState };

export function doFileGet(uri: string, saveFile: boolean = true, onSuccess?: GetResponse => any) {
  return (dispatch: Dispatch, getState: () => any) => {
    const state = getState();
    const { nout, txid } = makeSelectClaimForUri(uri)(state);
    const outpoint = `${txid}:${nout}`;

    dispatch({
      type: ACTIONS.FETCH_FILE_INFO_STARTED,
      data: {
        outpoint,
      },
    });

    // set save_file argument to True to save the file (old behaviour)
    Lbry.get({ uri, save_file: saveFile })
      .then((streamInfo: GetResponse) => {
        const timeout =
          streamInfo === null || typeof streamInfo !== 'object' || streamInfo.error === 'Timeout';
        if (timeout) {
          dispatch({
            type: ACTIONS.FETCH_FILE_INFO_FAILED,
            data: { outpoint },
          });

          dispatch(doToast({ message: `File timeout for uri ${uri}`, isError: true }));
        } else {
          if (streamInfo.purchase_receipt || streamInfo.content_fee) {
            dispatch({
              type: ACTIONS.PURCHASE_URI_COMPLETED,
              data: { uri, purchaseReceipt: streamInfo.purchase_receipt || streamInfo.content_fee },
            });
          }
          dispatch({
            type: ACTIONS.FETCH_FILE_INFO_COMPLETED,
            data: {
              fileInfo: streamInfo,
              outpoint: streamInfo.outpoint,
            },
          });

          if (onSuccess) {
            onSuccess(streamInfo);
          }
        }
      })
      .catch(error => {
        dispatch({
          type: ACTIONS.PURCHASE_URI_FAILED,
          data: { uri, error },
        });

        dispatch({
          type: ACTIONS.FETCH_FILE_INFO_FAILED,
          data: { outpoint },
        });

        dispatch(
          doToast({
            message: `Failed to view ${uri}, please try again. If this problem persists, visit https://lbry.com/faq/support for support.`,
            isError: true,
          })
        );
      });
  };
}

export function doPurchaseUri(
  uri: string,
  costInfo: { cost: number },
  saveFile: boolean = true,
  onSuccess?: GetResponse => any
) {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: ACTIONS.PURCHASE_URI_STARTED,
      data: { uri },
    });

    const state = getState();
    const balance = selectBalance(state);
    const fileInfo = makeSelectFileInfoForUri(uri)(state);
    const downloadingByOutpoint = selectDownloadingByOutpoint(state);
    const alreadyDownloading = fileInfo && !!downloadingByOutpoint[fileInfo.outpoint];
    const alreadyStreaming = makeSelectStreamingUrlForUri(uri)(state);

    if (!saveFile && (alreadyDownloading || alreadyStreaming)) {
      dispatch({
        type: ACTIONS.PURCHASE_URI_FAILED,
        data: { uri, error: `Already fetching uri: ${uri}` },
      });

      Promise.resolve();
      return;
    }

    const { cost } = costInfo;
    if (parseFloat(cost) > balance) {
      dispatch({
        type: ACTIONS.PURCHASE_URI_FAILED,
        data: { uri, error: 'Insufficient credits' },
      });

      Promise.resolve();
      return;
    }

    dispatch(doFileGet(uri, saveFile, onSuccess));
  };
}

export function doClearPurchasedUriSuccess() {
  return {
    type: ACTIONS.CLEAR_PURCHASED_URI_SUCCESS,
  };
}
