import { createSelector } from 'reselect';

const selectState = (state) => state.web || {};

export const selectCurrentUploads = (state) => selectState(state).currentUploads;

export const selectUploadCount = createSelector(
  selectCurrentUploads,
  (currentUploads) => currentUploads && Object.keys(currentUploads).length
);
