// @flow
import * as actions from "constants/action_types";
import type { Action, Dispatch } from "redux/reducers/upload";
import lbry from "lbry";
import fs from "fs";
import path from "path";
import { error } from "util";

export const beginUpload = (filePath: string) => (dispatch: Dispatch) => {
  const thumbnail = fs.readFileSync(filePath);
  const givenName = path.basename(filePath, path.extname(filePath));
  const safeName = givenName.replace(/\s+/g, "-").toLowerCase();
  let claimName = safeName;

  let status = checkName(safeName);
  let count = 0;
  console.log("status1:", status);
  while (!status && count < 5) {
    claimName = `safeName-${makeid()}`;
    console.log("claimName", claimName);
    status = checkName(claimName);
    console.log("while.status:", status);
    count++;
  }

  // dispatch({ type: actions.SPEECH_UPLOAD_BEGIN });
  // console.log("claimName:", claimName);
  // return fetch("https://httpbin.org/post", {
  //   method: "POST",
  //   name: claimName,
  //   file: thumbnail,
  // })
  //   .then(response => response.json())
  //   .then(json => console.log("2nd then:", json))
  //   .catch(err => console.log("beginUpload fetch catch, err:", err));

  return;

  function checkName(name) {
    let nameStatus: Boolean = false;

    // const response = fetch(`https://spee.ch/api/claim-is-available/${name}`);
    // const json = response.json();
    // return json;

    fetch(`https://spee.ch/api/claim-is-available/${name}`)
      .then(response => response.json())
      .then(json => {
        console.log("2nd then, json:", json);
        nameStatus = json;
        // return json;
      })
      .catch(err => console.log("ERROR:", err));

    console.log("nameStatus:", nameStatus);
    return nameStatus;
  }

  function makeid() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 7; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
};
