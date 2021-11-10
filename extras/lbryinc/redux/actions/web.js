// @flow
import * as ACTIONS from 'constants/action_types';

export const doUpdateUploadProgress = (
  progress: string,
  params: { [key: string]: any },
  xhr: any
) => (dispatch: Dispatch) =>
  dispatch({
    type: ACTIONS.UPDATE_UPLOAD_PROGRESS,
    data: { progress, params, xhr },
  });
