// @flow
import * as actions from "constants/action_types";
import type { Action, Dispatch } from "redux/reducers/media";
import lbry from "lbry";

export const doPlay = () => (dispatch: Dispatch) =>
  dispatch({
    type: actions.MEDIA_PLAY,
  });

export const doPause = (id: String, position: String) => (
  dispatch: Dispatch
) => {
  if (id && position) {
    dispatch({
      type: actions.MEDIA_POSITION,
      id,
      position,
    });
  }
  dispatch({ type: actions.MEDIA_PAUSE });
};

export const savePosition = (id: String, position: String) => (
  dispatch: Dispatch
) =>
  dispatch({
    type: actions.MEDIA_POSITION,
    id,
    position,
  });
