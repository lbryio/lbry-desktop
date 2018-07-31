// @flow
import * as actions from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

export type MediaState = {
  paused: Boolean,
};

export type Action = any;
export type Dispatch = (action: Action) => any;

const defaultState = { paused: true, positions: {} };

export default handleActions(
  {
    [actions.MEDIA_PLAY]: (state: MediaState, action: Action) => ({
      ...state,
      paused: false,
    }),

    [actions.MEDIA_PAUSE]: (state: MediaState, action: Action) => ({
      ...state,
      paused: true,
    }),
  },
  defaultState
);
