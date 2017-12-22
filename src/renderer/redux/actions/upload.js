// @flow
import * as actions from "constants/action_types";
import type { Action, Dispatch } from "redux/reducers/upload";
import lbry from "lbry";
import fs from "fs";

export const beginUpload = (thumbnailPath: string) => (dispatch: Dispatch) => {
  // dispatch({ type: actions.SPEECH_UPLOAD_BEGIN });
  // const thumbnail = fs.readFileSync(thumbnailPath);
  // console.log("THUMBNAIL:", thumbnail);
  return dispatch({ type: actions.SPEECH_UPLOAD_BEGIN });
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
