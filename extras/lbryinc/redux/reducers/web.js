// @flow
import * as ACTIONS from 'constants/action_types';
import { serializeFileObj } from 'util/file';

const CURRENT_UPLOADS = 'current_uploads';
const getKeyFromParam = (params) => `${params.name}#${params.channel || 'anonymous'}`;

export type TvState = {
  currentUploads: { [key: string]: FileUploadItem },
};

const reducers = {};

const defaultState: TvState = {
  currentUploads: {},
};

try {
  const uploads = JSON.parse(window.localStorage.getItem(CURRENT_UPLOADS));
  if (uploads) {
    defaultState.currentUploads = uploads;
    Object.keys(defaultState.currentUploads).forEach((key) => {
      delete defaultState.currentUploads[key].tusUploader;
    });
  }
} catch (e) {
  console.log(e);
}

reducers[ACTIONS.UPDATE_UPLOAD_ADD] = (state: TvState, action) => {
  const { file, params, tusUploader } = action.data;
  const key = getKeyFromParam(params);
  const currentUploads = Object.assign({}, state.currentUploads);

  currentUploads[key] = {
    file,
    fileFingerprint: serializeFileObj(file), // TODO: get hash instead?
    progress: '0',
    params,
    tusUploader,
  };

  window.localStorage.setItem(CURRENT_UPLOADS, JSON.stringify(currentUploads));
  return { ...state, currentUploads };
};

reducers[ACTIONS.UPDATE_UPLOAD_PROGRESS] = (state: TvState, action) => {
  const { params, progress, status } = action.data;
  const key = getKeyFromParam(params);
  const currentUploads = Object.assign({}, state.currentUploads);

  if (progress) {
    currentUploads[key].progress = progress;
    delete currentUploads[key].status;
  } else if (status) {
    currentUploads[key].status = status;
    if (status === 'error') {
      delete currentUploads[key].tusUploader;
    }
  }

  window.localStorage.setItem(CURRENT_UPLOADS, JSON.stringify(currentUploads));
  return { ...state, currentUploads };
};

reducers[ACTIONS.UPDATE_UPLOAD_REMOVE] = (state: TvState, action) => {
  const { params } = action.data;
  const key = getKeyFromParam(params);
  const currentUploads = Object.assign({}, state.currentUploads);

  delete currentUploads[key];

  window.localStorage.setItem(CURRENT_UPLOADS, JSON.stringify(currentUploads));
  return { ...state, currentUploads };
};

export function webReducer(state: TvState = defaultState, action: any) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
