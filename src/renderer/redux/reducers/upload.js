// @flow
import * as actions from "constants/action_types";
import { handleActions } from "util/redux-utils";

export type UploadState = {
  status: string | null,
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

type speechUploadReset = {
  type: actions.SPEECH_UPLOAD_RESET,
};

export type Action =
  | beginSpeechUpload
  | speechUploadSuccess
  | speechUploadError
  | speechUploadReset;
export type Dispatch = (action: Action) => any;

const defaultState = {
  status: "upload",
  url: null,
};

export default handleActions(
  {
    [actions.SPEECH_UPLOAD_BEGIN]: (
      state: UploadState,
      action: beginSpeechUpload
    ): UploadState => ({
      ...state,
      status: "sending",
      url: null,
    }),

    [actions.SPEECH_UPLOAD_SUCCESS]: (
      state: UploadState,
      action: speechUploadSuccess
    ): UploadState => ({
      ...state,
      status: "complete",
      url: action.data.url,
    }),

    [actions.SPEECH_UPLOAD_ERROR]: (
      state: UploadState,
      action: speechUploadError
    ): UploadState => ({
      ...state,
      status: "error",
      url: null,
    }),

    [actions.SPEECH_UPLOAD_RESET]: (
      state: UploadState,
      action: speechUploadReset
    ): UploadState => ({
      ...state,
      status: "upload",
      url: null,
    }),
  },

  defaultState
);
