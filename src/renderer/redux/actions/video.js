// @flow
import * as actions from "constants/action_types";
import type { Action, Dispatch } from "redux/reducers/video";
import lbry from "lbry";

// export const doVideoPause = (
//   dispatch: Dispatch
// ) => {
//   console.log("diVideoPause helllllo");
//   console.log(dispatch);
//   return dispatch({type: actions.VIDEO_PAUSE_STARTED});
// }

// export const confirmVideoPause = (
//   dispatch: Dispatch
// ) => dispatch({type: actions.VIDEO_PAUSE_COMPLETED});

export const setVideoPause = (data: boolean) => (dispatch: Dispatch) => {
  console.log("VIDEO ACTION data:", data);
  return dispatch({
    type: actions.SET_VIDEO_PAUSE,
    data,
  });
};
