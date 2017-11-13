import * as types from "constants/action_types";
import lbryuri from "lbryuri";

const reducers = {};
const defaultState = {};

reducers[types.FILE_LIST_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    isFetchingFileList: true,
  });
};

reducers[types.FILE_LIST_SUCCEEDED] = function(state, action) {
  const { fileInfos } = action.data;
  const newBySdHash = Object.assign({}, state.bySdHash);
  const pendingBySdHash = Object.assign({}, state.pendingBySdHash);

  fileInfos.forEach(fileInfo => {
    const { sd_hash } = fileInfo;

    if (sd_hash) newBySdHash[fileInfo.sd_hash] = fileInfo;
  });

  return Object.assign({}, state, {
    isFetchingFileList: false,
    bySdHash: newBySdHash,
    pendingBySdHash,
  });
};

reducers[types.FETCH_FILE_INFO_STARTED] = function(state, action) {
  const { sd_hash } = action.data;
  const newFetching = Object.assign({}, state.fetching);

  newFetching[sd_hash] = true;

  return Object.assign({}, state, {
    fetching: newFetching,
  });
};

reducers[types.FETCH_FILE_INFO_COMPLETED] = function(state, action) {
  const { fileInfo, sd_hash } = action.data;

  const newBySdHash = Object.assign({}, state.bySdHash);
  const newFetching = Object.assign({}, state.fetching);

  newBySdHash[sd_hash] = fileInfo;
  delete newFetching[sd_hash];

  return Object.assign({}, state, {
    bySdHash: newBySdHash,
    fetching: newFetching,
  });
};

reducers[types.DOWNLOADING_STARTED] = function(state, action) {
  const { uri, sd_hash, fileInfo } = action.data;

  const newBySdHash = Object.assign({}, state.bySdHash);
  const newDownloading = Object.assign({}, state.downloadingBySdHash);
  const newLoading = Object.assign({}, state.urisLoading);

  newDownloading[sd_hash] = true;
  newBySdHash[sd_hash] = fileInfo;
  delete newLoading[uri];

  return Object.assign({}, state, {
    downloadingBySdHash: newDownloading,
    urisLoading: newLoading,
    bySdHash: newBySdHash,
  });
};

reducers[types.DOWNLOADING_PROGRESSED] = function(state, action) {
  const { uri, sd_hash, fileInfo } = action.data;

  const newBySdHash = Object.assign({}, state.bySdHash);
  const newDownloading = Object.assign({}, state.downloadingBySdHash);

  newBySdHash[sd_hash] = fileInfo;
  newDownloading[sd_hash] = true;

  return Object.assign({}, state, {
    bySdHash: newBySdHash,
    downloadingBySdHash: newDownloading,
  });
};

reducers[types.DOWNLOADING_COMPLETED] = function(state, action) {
  const { uri, sd_hash, fileInfo } = action.data;

  const newBySdHash = Object.assign({}, state.bySdHash);
  const newDownloading = Object.assign({}, state.downloadingBySdHash);

  newBySdHash[sd_hash] = fileInfo;
  delete newDownloading[sd_hash];

  return Object.assign({}, state, {
    bySdHash: newBySdHash,
    downloadingBySdHash: newDownloading,
  });
};

reducers[types.FILE_DELETE] = function(state, action) {
  const { sd_hash } = action.data;

  const newBySdHash = Object.assign({}, state.bySdHash);
  const downloadingBySdHash = Object.assign({}, state.downloadingBySdHash);

  delete newBySdHash[sd_hash];
  delete downloadingBySdHash[sd_hash];

  return Object.assign({}, state, {
    bySdHash: newBySdHash,
    downloadingBySdHash,
  });
};

reducers[types.LOADING_VIDEO_STARTED] = function(state, action) {
  const { uri } = action.data;

  const newLoading = Object.assign({}, state.urisLoading);

  newLoading[uri] = true;

  return Object.assign({}, state, {
    urisLoading: newLoading,
  });
};

reducers[types.LOADING_VIDEO_FAILED] = function(state, action) {
  const { uri } = action.data;

  const newLoading = Object.assign({}, state.urisLoading);

  delete newLoading[uri];

  return Object.assign({}, state, {
    urisLoading: newLoading,
  });
};

reducers[types.FETCH_DATE] = function(state, action) {
  const { time } = action.data;
  if (time) {
    return Object.assign({}, state, {
      publishedDate: time,
    });
  }
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
