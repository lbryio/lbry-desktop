import * as settings from "constants/settings";
import { createSelector } from "reselect";

const _selectState = state => state.media || {};

export const selectMediaPaused = createSelector(
  _selectState,
  state => state.paused
);

export const makeSelectMediaPositionForUri = uri =>
  createSelector(_selectState, state => {
    const id = uri.split("#")[1];
    return state.positions[id] || null;
  });
