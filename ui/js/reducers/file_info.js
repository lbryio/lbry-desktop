import * as types from "constants/action_types";
import lbryuri from "lbryuri";

const reducers = {};
const defaultState = {};

reducers[types.FILE_LIST_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    isFileListPending: true,
  });
};

reducers[types.FILE_LIST_COMPLETED] = function(state, action) {
  const { fileInfos } = action.data;

  const newByOutpoint = Object.assign({}, state.byOutpoint);
  fileInfos.forEach(fileInfo => {
    const { outpoint } = fileInfo;

    if (outpoint) newByOutpoint[fileInfo.outpoint] = fileInfo;
  });

  return Object.assign({}, state, {
    isFileListPending: false,
    byOutpoint: newByOutpoint,
  });
};

reducers[types.FETCH_FILE_INFO_STARTED] = function(state, action) {
  const { outpoint } = action.data;
  const newFetching = Object.assign({}, state.fetching);

  newFetching[outpoint] = true;

  return Object.assign({}, state, {
    fetching: newFetching,
  });
};

reducers[types.FETCH_FILE_INFO_COMPLETED] = function(state, action) {
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

reducers[types.DOWNLOADING_STARTED] = function(state, action) {
  const { uri, outpoint, fileInfo } = action.data;

  const newByOutpoint = Object.assign({}, state.byOutpoint);
  const newDownloading = Object.assign({}, state.urisDownloading);
  const newLoading = Object.assign({}, state.urisLoading);

  newDownloading[uri] = true;
  newByOutpoint[outpoint] = fileInfo;
  delete newLoading[uri];

  return Object.assign({}, state, {
    urisDownloading: newDownloading,
    urisLoading: newLoading,
    byOutpoint: newByOutpoint,
  });
};

reducers[types.DOWNLOADING_PROGRESSED] = function(state, action) {
  const { uri, outpoint, fileInfo } = action.data;

  const newByOutpoint = Object.assign({}, state.byOutpoint);
  const newDownloading = Object.assign({}, state.urisDownloading);

  newByOutpoint[outpoint] = fileInfo;
  newDownloading[uri] = true;

  return Object.assign({}, state, {
    byOutpoint: newByOutpoint,
    urisDownloading: newDownloading,
  });
};

reducers[types.DOWNLOADING_COMPLETED] = function(state, action) {
  const { uri, outpoint, fileInfo } = action.data;

  const newByOutpoint = Object.assign({}, state.byOutpoint);
  const newDownloading = Object.assign({}, state.urisDownloading);

  newByOutpoint[outpoint] = fileInfo;
  delete newDownloading[uri];

  return Object.assign({}, state, {
    byOutpoint: newByOutpoint,
    urisDownloading: newDownloading,
  });
};

reducers[types.FILE_DELETE] = function(state, action) {
  const { outpoint } = action.data;

  const newByOutpoint = Object.assign({}, state.byOutpoint);

  delete newByOutpoint[outpoint];

  return Object.assign({}, state, {
    byOutpoint: newByOutpoint,
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

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
