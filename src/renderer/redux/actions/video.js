// @flow
import * as actions from "constants/action_types";
import type { Action, Dispatch } from "redux/reducers/video";
import lbry from "lbry";

export const setVideoPause = (data: boolean) => (dispatch: Dispatch) =>
  dispatch({
    type: actions.SET_VIDEO_PAUSE,
    data,
  });
