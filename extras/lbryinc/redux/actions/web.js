// @flow
import * as ACTIONS from 'constants/action_types';

export function doUpdateUploadAdd(file: File, params: { [key: string]: any }, tusUploader: any) {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: ACTIONS.UPDATE_UPLOAD_ADD,
      data: { file, params, tusUploader },
    });
  };
}

export const doUpdateUploadProgress = (props: {
  params: { [key: string]: any },
  progress?: string,
  status?: string,
}) => (dispatch: Dispatch) =>
  dispatch({
    type: ACTIONS.UPDATE_UPLOAD_PROGRESS,
    data: props,
  });

export function doUpdateUploadRemove(params: { [key: string]: any }) {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: ACTIONS.UPDATE_UPLOAD_REMOVE,
      data: { params },
    });
  };
}
