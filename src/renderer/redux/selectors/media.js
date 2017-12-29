import * as settings from "constants/settings";
import { createSelector } from "reselect";
import lbryuri from "lbryuri";

const _selectState = state => state.media || {};

export const selectMediaPaused = createSelector(
  _selectState,
  state => state.paused
);

export const makeSelectMediaPositionForUri = uri =>
  createSelector(_selectState, state => {
    const obj = lbryuri.parse(uri);
    return state.positions[obj.claimId] || null;
  });
