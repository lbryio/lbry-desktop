// @flow
import * as actions from "constants/action_types";
import type { Action, Dispatch } from "redux/reducers/upload";
import lbry from "lbry";
import fs from "fs";
import path from "path";
import { disconnect } from "cluster";

export const resetSpeechUpload = () => (dispatch: Dispatch) =>
  dispatch({ type: actions.SPEECH_UPLOAD_RESET });

export const setThumbnailStatusManual = () => (dispatch: Dispatch) =>
  dispatch({ type: actions.THUMBNAIL_SET_MANUAL_STATUS });

export const setManualThumbnailUrl = (url: string) => (dispatch: Dispatch) =>
  dispatch({
    type: actions.THUMBNAIL_MANUAL_URL_UPDATE,
    data: { url },
  });

export const beginSpeechUpload = (filePath: string, nsfw: boolean = false) => (
  dispatch: Dispatch
) => {
  const thumbnail = fs.readFileSync(filePath);
  const fileExt = path.extname(filePath);
  const fileName = path.basename(filePath, fileExt);
  const safeName = fileName
    .slice(0, 24)
    .replace(/\s+/g, "-")
    .toLowerCase();

  dispatch({ type: actions.SPEECH_UPLOAD_BEGIN });

  let data = new FormData();
  const name = makeid();
  const blob = new Blob([thumbnail], { type: `image/${fileExt.slice(1)}` });
  data.append("name", name);
  data.append("file", blob);
  data.append("nsfw", nsfw);
  return fetch("https://spee.ch/api/claim-publish", {
    method: "POST",
    body: data,
  })
    .then(response => response.json())
    .then(
      json =>
        json.success
          ? dispatch({
              type: actions.SPEECH_UPLOAD_SUCCESS,
              data: { url: `${json.message.url}${fileExt}` },
            })
          : dispatch({ type: actions.SPEECH_UPLOAD_ERROR })
    )
    .catch(err =>
      dispatch({ type: actions.SPEECH_UPLOAD_ERROR, data: { err } })
    );

  function makeid() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 24; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
};
