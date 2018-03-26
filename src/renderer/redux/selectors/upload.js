import * as settings from "constants/settings";
import { createSelector } from "reselect";

const selectState = state => state.upload || {};

export const selectUploadUrl = createSelector(selectState, state => state.url);

export const selectUploadStatus = createSelector(
  selectState,
  state => state.status
);

export const selectUploadApiStatus = createSelector(
  selectState,
  state => state.api
);
