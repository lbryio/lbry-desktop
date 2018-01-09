// @flow
import * as actions from "constants/action_types";
import type { Action, Dispatch } from "redux/reducers/upload";
import lbry from "lbry";
import fs from "fs";

export const beginUpload = (path: string) => (dispatch: Dispatch) => {
  dispatch({ type: actions.SPEECH_UPLOAD_BEGIN });
  const thumbnail = fs.readFileSync(path);
  console.log("beginUpload ACTION, thumbnail:", thumbnail);
  fetch("https://httpbin.org/post", {
    method: "POST",
    body: thumbnail,
  })
    .then(response =>
      console.log("beginUpload fetch then, response:", response.json())
    )
    .catch(err => console.log("beginUpload fetch catch, err:", err));
};

// export const doChannelSubscribe = (subscription: Subscription) => (
//   dispatch: Dispatch
// ) => {
//   return dispatch({
//     type: actions.CHANNEL_SUBSCRIBE,
//     data: subscription,
//   });
// };

// export const doChannelUnsubscribe = (subscription: Subscription) => (
//   dispatch: Dispatch
// ) => {
//   return dispatch({
//     type: actions.CHANNEL_UNSUBSCRIBE,
//     data: subscription,
//   });
// };

// export const setHasFetchedSubscriptions = () => (dispatch: Dispatch) => {
//   return dispatch({ type: actions.HAS_FETCHED_SUBSCRIPTIONS })
// }
