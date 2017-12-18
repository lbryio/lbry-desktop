// @flow
import * as actions from "constants/action_types";
import { handleActions } from "util/redux-utils";

export type VideoState = { videoPause: boolean };

type setVideoPause = {
  type: actions.SET_VIDEO_PAUSE,
  data: boolean,
};

export type Action = setVideoPause;
export type Dispatch = (action: Action) => any;

const defaultState = { videoPause: false };

export default handleActions(
  {
    [actions.SET_VIDEO_PAUSE]: (
      state: VideoState,
      action: setVideoPause
    ): VideoState => {
      console.log("VIDEO REDUCER STATE", state);
      console.log("VIDEO REDUCER ACTION", action);
      return { ...state, videoPause: action.data };
    },
  },
  defaultState
);
