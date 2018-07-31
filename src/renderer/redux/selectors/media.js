import { createSelector } from 'reselect';

const selectState = state => state.media || {};

export const selectMediaPaused = createSelector(selectState, state => state.paused);
