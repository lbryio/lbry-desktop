import * as settings from "constants/settings";
import { createSelector } from "reselect";

const _selectState = state => state.video || {};

export const selectVideoPause = createSelector(_selectState, state => {
  console.log("VIDEO PAUSE SELECTOR", state);
  return state.videoPause;
});
