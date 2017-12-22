// @flow
import * as actions from 'constants/action_types';
import type { Dispatch } from 'redux/reducers/video';

// eslint-disable-next-line import/prefer-default-export
export const setVideoPause = (data: boolean) => (dispatch: Dispatch) =>
  dispatch({
    type: actions.SET_VIDEO_PAUSE,
    data,
  });
