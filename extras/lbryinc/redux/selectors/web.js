import { createSelector } from 'reselect';

const selectState = state => state.web || {};

export const selectCurrentUploads = createSelector(selectState, state => state.currentUploads);

export const selectUploadCount = createSelector(
  selectCurrentUploads,
  currentUploads => currentUploads && Object.keys(currentUploads).length
);
