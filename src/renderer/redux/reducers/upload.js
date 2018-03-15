// @flow
import * as actions from "constants/action_types";
import { handleActions } from "util/redux-utils";
import * as status from "constants/upload";

export type UploadState = {
  status: ?string,
  url: ?string,
};

type beginSpeechUpload = {
  type: actions.SPEECH_UPLOAD_BEGIN,
};

type speechUploadSuccess = {
  type: actions.SPEECH_UPLOAD_SUCCESS,
  data: {
    url: string
  },
};

type speechUploadError = {
  type: actions.SPEECH_UPLOAD_ERROR,
};

type speechUploadReset = {
  type: actions.SPEECH_UPLOAD_RESET,
};

type setThumbnailStatusManual = {
  type: actions.THUMBNAIL_SET_MANUAL_STATUS,
};

type setManualThumbnailUrl = {
  type: actions.THUMBNAIL_MANUAL_URL_UPDATE,
  data: {
    url: string
  },
};

export type Action =
  | beginSpeechUpload
  | speechUploadSuccess
  | speechUploadError
  | speechUploadReset
  | setThumbnailStatusManual
  | setManualThumbnailUrl;
export type Dispatch = (action: Action) => any;

const defaultState = {
  status: status.UPLOAD,
  url: null,
};

export default handleActions(
  {
    [actions.SPEECH_UPLOAD_BEGIN]: (
      state: UploadState,
      action: beginSpeechUpload
    ): UploadState => ({
      ...state,
      status: status.SENDING,
      url: null,
    }),

    [actions.SPEECH_UPLOAD_SUCCESS]: (
      state: UploadState,
      action: speechUploadSuccess
    ): UploadState => ({
      ...state,
      status: status.COMPLETE,
      url: action.data.url,
    }),

    [actions.SPEECH_UPLOAD_ERROR]: (
      state: UploadState,
      action: speechUploadError
    ): UploadState => ({
      ...state,
      status: status.ERROR,
      url: null,
    }),

    [actions.SPEECH_UPLOAD_RESET]: (
      state: UploadState,
      action: speechUploadReset
    ): UploadState => ({
      ...state,
      status: status.UPLOAD,
      url: null,
    }),

    [actions.THUMBNAIL_SET_MANUAL_STATUS]: (
      state: UploadState,
      action: setThumbnailStatusManual
    ): UploadState => ({
      ...state,
      status: status.MANUAL,
      url: null,
    }),

    [actions.THUMBNAIL_MANUAL_URL_UPDATE]: (
      state: UploadState,
      action: setManualThumbnailUrl
    ): UploadState => ({
      ...state,
      url: action.data.url,
    }),
  },

  defaultState
);
