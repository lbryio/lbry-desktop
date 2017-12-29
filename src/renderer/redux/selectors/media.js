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
    // console.log("select positions:", state.positions);
    // const videoId = lbryuri.parse(uri).claimId;
    // console.log("videoId:", videoId);
    // const position = state.positions[videoId];
    // console.log("position:", position);
    // console.log("positions:", state.positions);
    const obj = lbryuri.parse(uri);
    console.log("state.positions:\n", state.positions);
    return state.positions[obj.claimId] || null;
  });
