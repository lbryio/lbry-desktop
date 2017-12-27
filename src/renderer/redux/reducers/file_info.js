import * as ACTIONS from 'constants/action_types';

const reducers = {};
const defaultState = {};

reducers[ACTIONS.FILE_LIST_STARTED] = function(state) {
  return Object.assign({}, state, {
    isFetchingFileList: true,
  });
};

reducers[ACTIONS.FILE_LIST_SUCCEEDED] = function(state, action) {
  const { fileInfos } = action.data;
  const newByOutpoint = Object.assign({}, state.byOutpoint);
  const pendingByOutpoint = Object.assign({}, state.pendingByOutpoint);

  fileInfos.forEach(fileInfo => {
    const { outpoint } = fileInfo;

    if (outpoint) newByOutpoint[fileInfo.outpoint] = fileInfo;
  });

  return Object.assign({}, state, {
    isFetchingFileList: false,
    byOutpoint: newByOutpoint,
    pendingByOutpoint,
  });
};

reducers[ACTIONS.FETCH_FILE_INFO_STARTED] = function(state, action) {
  const { outpoint } = action.data;
  const newFetching = Object.assign({}, state.fetching);

  newFetching[outpoint] = true;

  return Object.assign({}, state, {
    fetching: newFetching,
  });
};

reducers[ACTIONS.FETCH_FILE_INFO_COMPLETED] = function(state, action) {
  const { fileInfo, outpoint } = action.data;

  const newByOutpoint = Object.assign({}, state.byOutpoint);
  const newFetching = Object.assign({}, state.fetching);

  newByOutpoint[outpoint] = fileInfo;
  delete newFetching[outpoint];

  return Object.assign({}, state, {
    byOutpoint: newByOutpoint,
    fetching: newFetching,
  });
};

reducers[ACTIONS.DOWNLOADING_STARTED] = function(state, action) {
  const { uri, outpoint, fileInfo } = action.data;

  const newByOutpoint = Object.assign({}, state.byOutpoint);
  const newDownloading = Object.assign({}, state.downloadingByOutpoint);
  const newLoading = Object.assign({}, state.urisLoading);

  newDownloading[outpoint] = true;
  newByOutpoint[outpoint] = fileInfo;
  delete newLoading[uri];

  return Object.assign({}, state, {
    downloadingByOutpoint: newDownloading,
    urisLoading: newLoading,
    byOutpoint: newByOutpoint,
  });
};

reducers[ACTIONS.DOWNLOADING_PROGRESSED] = function(state, action) {
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

reducers[ACTIONS.DOWNLOADING_COMPLETED] = function(state, action) {
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

reducers[ACTIONS.FILE_DELETE] = function(state, action) {
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

reducers[ACTIONS.LOADING_VIDEO_STARTED] = function(state, action) {
  const { uri } = action.data;

  const newLoading = Object.assign({}, state.urisLoading);

  newLoading[uri] = true;

  return Object.assign({}, state, {
    urisLoading: newLoading,
  });
};

reducers[ACTIONS.LOADING_VIDEO_FAILED] = function(state, action) {
  const { uri } = action.data;

  const newLoading = Object.assign({}, state.urisLoading);

  delete newLoading[uri];

  return Object.assign({}, state, {
    urisLoading: newLoading,
  });
};

reducers[ACTIONS.FETCH_DATE] = function(state, action) {
  const { time } = action.data;
  if (time) {
    return Object.assign({}, state, {
      publishedDate: time,
    });
  }
  return null;
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
