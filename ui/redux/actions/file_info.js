import * as ACTIONS from 'constants/action_types';
import Lbry from 'lbry';
import { selectClaimsByUri } from 'redux/selectors/claims';
import { selectIsFetchingFileList, selectUrisLoading } from 'redux/selectors/file_info';

export function doFetchFileInfo(uri) {
  return (dispatch, getState) => {
    const state = getState();
    const claim = selectClaimsByUri(state)[uri];
    const outpoint = claim ? `${claim.txid}:${claim.nout}` : null;
    const alreadyFetching = !!selectUrisLoading(state)[uri];

    if (!alreadyFetching) {
      dispatch({
        type: ACTIONS.FETCH_FILE_INFO_STARTED,
        data: {
          outpoint,
        },
      });

      Lbry.file_list({ outpoint, full_status: true, page: 1, page_size: 1 }).then((result) => {
        const { items: fileInfos } = result;
        const fileInfo = fileInfos[0];

        dispatch({
          type: ACTIONS.FETCH_FILE_INFO_COMPLETED,
          data: {
            outpoint,
            fileInfo: fileInfo || null,
          },
        });
      });
    }
  };
}

export function doFileList(page = 1, pageSize = 99999) {
  return (dispatch, getState) => {
    const state = getState();
    const isFetching = selectIsFetchingFileList(state);

    if (!isFetching) {
      dispatch({
        type: ACTIONS.FILE_LIST_STARTED,
      });

      Lbry.file_list({ page, page_size: pageSize }).then((result) => {
        const { items: fileInfos } = result;
        dispatch({
          type: ACTIONS.FILE_LIST_SUCCEEDED,
          data: {
            fileInfos: fileInfos,
          },
        });
      });
    }
  };
}

export function doFetchFileInfos() {
  return (dispatch, getState) => {
    const state = getState();
    const isFetchingFileInfo = selectIsFetchingFileList(state);
    if (!isFetchingFileInfo) dispatch(doFileList());
  };
}

export function doSetFileListSort(page, value) {
  return {
    type: ACTIONS.SET_FILE_LIST_SORT,
    data: { page, value },
  };
}
