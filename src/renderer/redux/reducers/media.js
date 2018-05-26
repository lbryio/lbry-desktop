// @flow
import * as actions from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

export type MediaState = {
  showOverlay: Boolean,
  paused: Boolean,
  positions: {
    [string]: number,
  },
};

export type Action = any;
export type Dispatch = (action: Action) => any;

const defaultState = { paused: true, positions: {}, showOverlay: false };

export default handleActions(
  {
    // if parameters: state: MediaState, action: Action
    [actions.MEDIA_PLAY]: (state: MediaState) => ({
      ...state,
      paused: false,
    }),

    [actions.MEDIA_PAUSE]: (state: MediaState) => ({
      ...state,
      paused: true,
    }),

    [actions.MEDIA_POSITION]: (state: MediaState) => {
      const { outpoint, position } = action.data;
      return {
        ...state,
        positions: {
          ...state.positions,
          [outpoint]: position,
        },
      };
    },

    [actions.SHOW_OVERLAY_MEDIA]: (state: MediaState) => ({
      ...state,
      showOverlay: true,
    }),

    [actions.HIDE_OVERLAY_MEDIA]: (state: MediaState) => ({
      ...state,
      showOverlay: false,
    }),
  },
  defaultState
);
