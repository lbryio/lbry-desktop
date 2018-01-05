import { createSelector } from 'reselect';

const selectState = state => state.availability;

const selectFetchingAvailability = createSelector(selectState, state => state.fetching || {});

export { selectFetchingAvailability as default };
