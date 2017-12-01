import { createSelector } from "reselect";

const _selectState = state => state.shapeShift;

export const selectShapeShift = createSelector(_selectState, state => ({
  ...state,
}));
