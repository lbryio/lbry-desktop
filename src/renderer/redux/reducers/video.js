// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

export type VideoState = { videoPause: boolean };

type setVideoPause = {
  type: ACTIONS.SET_VIDEO_PAUSE,
  data: boolean,
};

export type Action = setVideoPause;
export type Dispatch = (action: Action) => any;

const defaultState = { videoPause: false };

export default handleActions(
  {
    [ACTIONS.SET_VIDEO_PAUSE]: (state: VideoState, action: setVideoPause): VideoState => ({
      ...state,
      videoPause: action.data,
    }),
  },
  defaultState
);
