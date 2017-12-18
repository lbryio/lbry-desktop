import * as settings from "constants/settings";
import { createSelector } from "reselect";

const _selectState = state => state.videoPause || false;

export const selectVideoPause = createSelector(
  _selectState,
  state => state.videoPause || false
);
