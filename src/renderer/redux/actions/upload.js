// @flow
import * as actions from "constants/action_types";
import type { Action, Dispatch } from "redux/reducers/upload";
import lbry from "lbry";
import fs from "fs";
import path from "path";
import { error } from "util";

export const beginUpload = (filePath: string) => (dispatch: Dispatch) => {
  const thumbnail = fs.readFileSync(filePath);
  const extName = path.extname(filePath);
  const fileName = path.basename(filePath, extName);
  const safeName = fileName.replace(/\s+/g, "-").toLowerCase();

  const getName = (name, count = 1, limit = 10) => {
    console.log("getName", name, count, limit);
    name = count > 1 ? `${name}-${makeid()}` : name;
    fetch(`https://spee.ch/api/claim-is-available/${name}`)
      .then(res => res.json())
      .then(status => {
        console.log("fetch1 then2 status:", status);
        if (status) {
          console.log("status:true, name:", name);
          let data = new FormData();
          data.append("name", name);
          const blob = new Blob(thumbnail, { type: ".jpeg" });
          data.append("file", blob, path.basename(filePath));
          // fetch("https://httpbin.org/post", {
          fetch("https://spee.ch/api/claim-publish", {
            method: "POST",
            body: data,
          })
            .then(response => response.json())
            .then(json => console.log("fetch2 then2:", json))
            .catch(err => console.log("beginUpload fetch catch, err:", err));
        } else return count >= limit ? false : getName(name, count + 1, limit);
      })
      .catch(err => false);
  };

  getName(safeName);

  // console.log("claimName:", claimName);

  // return;

  // let status = checkName(safeName);
  // let count = 0;
  // console.log("status1:", status);
  // while (!status && count < 5) {
  //   claimName = `safeName-${makeid()}`;
  //   console.log("claimName", claimName);
  //   status = checkName(claimName);
  //   console.log("while.status:", status);
  //   count++;
  // }

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

  // return;

  // function checkName(name, count=1, limit=10) {

  //   return fetch(`https://spee.ch/api/claim-is-available/${count > 1 ? `name-${makeid()}` : name}`)
  //          .then(res => res.json())
  //          .then(status => status       ? json  :
  //                          count>=limit ? false :
  //                          checkName(name, count+1, limit));

  // let nameStatus: Boolean = false;

  // const response = fetch(`https://spee.ch/api/claim-is-available/${name}`);
  // const json = response.json();
  // return json;

  // fetch(`https://spee.ch/api/claim-is-available/${name}`)
  //   .then(response => response.json())
  //   .then(json => {
  //     console.log("2nd then, json:", json);
  //     nameStatus = json;
  //     // return json;
  //   })
  //   .catch(err => console.log("ERROR:", err));

  // console.log("nameStatus:", nameStatus);
  // return nameStatus;
  // }

  function makeid() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 7; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
};
