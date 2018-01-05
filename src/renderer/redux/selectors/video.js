import { createSelector } from 'reselect';

const selectState = state => state.video || {};

// eslint-disable-next-line import/prefer-default-export
export const selectVideoPause = createSelector(selectState, state => state.videoPause);
