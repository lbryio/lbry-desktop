import * as settings from "constants/settings";
import { createSelector } from "reselect";

const _selectState = state => state.upload || {};

export const selectUploadUrl = createSelector(_selectState, state => state.url);

export const selectUploadStatus = createSelector(
  _selectState,
  state => state.status
);
