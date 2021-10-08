// @flow
import * as ACTIONS from 'constants/action_types';

/*
test mock:
  currentUploads: {
    'test#upload': {
      progress: 50,
      params: {
        name: 'steve',
        thumbnail_url: 'https://dev2.spee.ch/4/KMNtoSZ009fawGz59VG8PrID.jpeg',
      },
    },
  },
 */

export type Params = {
  channel?: string,
  name: string,
  thumbnail_url: ?string,
  title: ?string,
};

export type UploadItem = {
  progess: string,
  params: Params,
  xhr?: any,
};

export type TvState = {
  currentUploads: { [key: string]: UploadItem },
};

const reducers = {};

const defaultState: TvState = {
  currentUploads: {},
};

reducers[ACTIONS.UPDATE_UPLOAD_PROGRESS] = (state: TvState, action) => {
  const { progress, params, xhr } = action.data;
  const key = params.channel ? `${params.name}#${params.channel}` : `${params.name}#anonymous`;
  let currentUploads;
  if (!progress) {
    currentUploads = Object.assign({}, state.currentUploads);
    Object.keys(currentUploads).forEach(k => {
      if (k === key) {
        delete currentUploads[key];
      }
    });
  } else {
    currentUploads = Object.assign({}, state.currentUploads);
    currentUploads[key] = { progress, params, xhr };
  }
  return { ...state, currentUploads };
};

export function webReducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
