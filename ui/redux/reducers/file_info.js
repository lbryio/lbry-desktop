import * as ACTIONS from 'constants/action_types';
import * as SORT_OPTIONS from 'constants/sort_options';
import * as PAGES from 'constants/pages';

const reducers = {};
const defaultState = {
  fileListPublishedSort: SORT_OPTIONS.DATE_NEW,
  fileListDownloadedSort: SORT_OPTIONS.DATE_NEW,
  fetchingOutpoints: [],
};

reducers[ACTIONS.FILE_LIST_STARTED] = (state) =>
  Object.assign({}, state, {
    isFetchingFileList: true,
  });

reducers[ACTIONS.FILE_LIST_SUCCEEDED] = (state, action) => {
  const { fileInfos } = action.data;
  const newByOutpoint = Object.assign({}, state.byOutpoint);
  const pendingByOutpoint = Object.assign({}, state.pendingByOutpoint);

  fileInfos.forEach((fileInfo) => {
    const { outpoint } = fileInfo;

    if (outpoint) newByOutpoint[fileInfo.outpoint] = fileInfo;
  });

  return Object.assign({}, state, {
    isFetchingFileList: false,
    byOutpoint: newByOutpoint,
    pendingByOutpoint,
  });
};

reducers[ACTIONS.FETCH_FILE_INFO_STARTED] = (state, action) => {
  const { outpoint } = action.data;

  const newFetchingOutpoints = new Set(state.fetchingOutpoints);
  newFetchingOutpoints.add(outpoint);

  return { ...state, fetchingOutpoints: Array.from(newFetchingOutpoints) };
};

reducers[ACTIONS.FETCH_FILE_INFO_COMPLETED] = (state, action) => {
  const { fileInfo, outpoint } = action.data;

  const newFetchingOutpoints = new Set(state.fetchingOutpoints);
  newFetchingOutpoints.delete(outpoint);

  const newByOutpoint = Object.assign({}, state.byOutpoint);
  newByOutpoint[outpoint] = fileInfo;

  return { ...state, fetchingOutpoints: Array.from(newFetchingOutpoints), byOutpoint: newByOutpoint };
};

reducers[ACTIONS.FETCH_FILE_INFO_FAILED] = (state, action) => {
  const { outpoint } = action.data;

  const newFetchingOutpoints = new Set(state.fetchingOutpoints);
  newFetchingOutpoints.delete(outpoint);

  return { ...state, fetchingOutpoints: Array.from(newFetchingOutpoints) };
};

reducers[ACTIONS.DOWNLOADING_STARTED] = (state, action) => {
  const { outpoint, fileInfo } = action.data;

  const newByOutpoint = Object.assign({}, state.byOutpoint);
  const newDownloading = Object.assign({}, state.downloadingByOutpoint);

  newDownloading[outpoint] = true;
  newByOutpoint[outpoint] = fileInfo;

  return Object.assign({}, state, {
    downloadingByOutpoint: newDownloading,
    byOutpoint: newByOutpoint,
  });
};

reducers[ACTIONS.DOWNLOADING_PROGRESSED] = (state, action) => {
  const { outpoint, fileInfo } = action.data;

  const newByOutpoint = Object.assign({}, state.byOutpoint);
  const newDownloading = Object.assign({}, state.downloadingByOutpoint);

  newByOutpoint[outpoint] = fileInfo;
  newDownloading[outpoint] = true;

  return Object.assign({}, state, {
    byOutpoint: newByOutpoint,
    downloadingByOutpoint: newDownloading,
  });
};

reducers[ACTIONS.DOWNLOADING_CANCELED] = (state, action) => {
  const { outpoint } = action.data;

  const newDownloading = Object.assign({}, state.downloadingByOutpoint);
  delete newDownloading[outpoint];

  return Object.assign({}, state, {
    downloadingByOutpoint: newDownloading,
  });
};

reducers[ACTIONS.DOWNLOADING_COMPLETED] = (state, action) => {
  const { outpoint, fileInfo } = action.data;

  const newByOutpoint = Object.assign({}, state.byOutpoint);
  const newDownloading = Object.assign({}, state.downloadingByOutpoint);

  newByOutpoint[outpoint] = fileInfo;
  delete newDownloading[outpoint];

  return Object.assign({}, state, {
    byOutpoint: newByOutpoint,
    downloadingByOutpoint: newDownloading,
  });
};

reducers[ACTIONS.FILE_DELETE] = (state, action) => {
  const { outpoint } = action.data;

  const newByOutpoint = Object.assign({}, state.byOutpoint);
  const downloadingByOutpoint = Object.assign({}, state.downloadingByOutpoint);

  delete newByOutpoint[outpoint];
  delete downloadingByOutpoint[outpoint];

  return Object.assign({}, state, {
    byOutpoint: newByOutpoint,
    downloadingByOutpoint,
  });
};

reducers[ACTIONS.SET_FILE_LIST_SORT] = (state, action) => {
  const pageSortStates = {
    [PAGES.DEPRECATED__PUBLISH]: 'fileListPublishedSort',
    [PAGES.DEPRECATED__DOWNLOADED]: 'fileListDownloadedSort',
  };
  const pageSortState = pageSortStates[action.data.page];
  const { value } = action.data;

  return Object.assign({}, state, {
    [pageSortState]: value,
  });
};

export function fileInfoReducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
