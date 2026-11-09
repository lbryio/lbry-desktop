//@ts-nocheck
import * as ACTIONS from 'constants/action_types';
import * as SORT_OPTIONS from 'constants/sort_options';
import * as PAGES from 'constants/pages';

const reducers: Record<string, any> = {};
const defaultState = {
  fileListPublishedSort: SORT_OPTIONS.DATE_NEW,
  fileListDownloadedSort: SORT_OPTIONS.DATE_NEW,
} as const;

reducers[ACTIONS.FILE_LIST_STARTED] = (state: unknown) =>
  Object.assign({}, state, {
    isFetchingFileList: true,
  });

reducers[ACTIONS.FILE_LIST_SUCCEEDED] = (state: unknown, action: unknown) => {
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

reducers[ACTIONS.FETCH_FILE_INFO_STARTED] = (state: unknown, action: unknown) => {
  const { outpoint } = action.data;
  const newFetching = Object.assign({}, state.fetching);

  newFetching[outpoint] = true;

  return Object.assign({}, state, {
    fetching: newFetching,
  });
};

reducers[ACTIONS.FETCH_FILE_INFO_COMPLETED] = (state: unknown, action: unknown) => {
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

reducers[ACTIONS.FETCH_FILE_INFO_FAILED] = (state: unknown, action: unknown) => {
  const { outpoint } = action.data;
  const newFetching = Object.assign({}, state.fetching);
  delete newFetching[outpoint];

  return Object.assign({}, state, {
    fetching: newFetching,
  });
};

reducers[ACTIONS.DOWNLOADING_STARTED] = (state: unknown, action: unknown) => {
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

reducers[ACTIONS.DOWNLOADING_PROGRESSED] = (state: unknown, action: unknown) => {
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

reducers[ACTIONS.DOWNLOADING_CANCELED] = (state: unknown, action: unknown) => {
  const { outpoint } = action.data;

  const newDownloading = Object.assign({}, state.downloadingByOutpoint);
  delete newDownloading[outpoint];

  return Object.assign({}, state, {
    downloadingByOutpoint: newDownloading,
  });
};

reducers[ACTIONS.DOWNLOADING_COMPLETED] = (state: unknown, action: unknown) => {
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

reducers[ACTIONS.FILE_DELETE] = (state: unknown, action: unknown) => {
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

reducers[ACTIONS.SET_FILE_LIST_SORT] = (state: unknown, action: unknown) => {
  const pageSortStates = {
    [PAGES.PUBLISHED]: 'fileListPublishedSort',
    [PAGES.DOWNLOADED]: 'fileListDownloadedSort',
  } as const;
  const pageSortState = pageSortStates[action.data.page];
  const { value } = action.data;

  return Object.assign({}, state, {
    [pageSortState]: value,
  });
};

export function fileInfoReducer(state = defaultState, action: unknown) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
