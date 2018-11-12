import { createSelector } from 'reselect';

const selectState = state => state.shapeShift;

export const selectShapeShift = createSelector(selectState, state => ({
  ...state,
}));

export { selectShapeShift as default };
