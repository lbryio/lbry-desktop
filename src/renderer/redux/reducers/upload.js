// @flow
import * as actions from "constants/action_types";
import { handleActions } from "util/redux-utils";

export type UploadState = {
  status: string,
  url: string | null,
};

type beginSpeechUpload = {
  type: actions.SPEECH_UPLOAD_BEGIN,
};

type speechUploadSuccess = {
  type: actions.SPEECH_UPLOAD_SUCCESS,
  url: string,
};

type speechUploadError = {
  type: actions.SPEECH_UPLOAD_ERROR,
};

export type Action =
  | beginSpeechUpload
  | speechUploadSuccess
  | speechUploadError;
export type Dispatch = (action: Action) => any;

const defaultState = {
  url: "",
  status: null,
};

export default handleActions(
  {
    [actions.SPEECH_UPLOAD_BEGIN]: (
      state: UploadState,
      action: beginSpeechUpload
    ): UploadState => {
      return {
        ...state,
        status: "upload",
        url: null,
      };
    },

    [actions.SPEECH_UPLOAD_SUCCESS]: (
      state: UploadState,
      action: speechUploadSuccess
    ): UploadState => {
      return {
        ...state,
        status: "success",
        url: action.url,
      };
    },

    [actions.SPEECH_UPLOAD_ERROR]: (
      state: UploadState,
      action: speechUploadError
    ): UploadState => {
      return {
        ...state,
        status: "upload",
        url: null,
      };
    },
  },
  defaultState
);
