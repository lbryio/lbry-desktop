// @flow
import * as actions from 'constants/action_types';
import type { Dispatch } from 'redux/reducers/media';

export const doPlay = () => (dispatch: Dispatch) =>
  dispatch({
    type: actions.MEDIA_PLAY,
  });

export const doPause = () => (dispatch: Dispatch) =>
  dispatch({
    type: actions.MEDIA_PAUSE,
  });
