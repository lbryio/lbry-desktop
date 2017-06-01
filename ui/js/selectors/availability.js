import { createSelector } from "reselect";

const _selectState = state => state.availability;

export const selectAvailabilityByUri = createSelector(
  _selectState,
  state => state.byUri || {}
);

const selectAvailabilityForUri = (state, props) => {
  return selectAvailabilityByUri(state)[props.uri];
};

export const makeSelectIsAvailableForUri = () => {
  return createSelector(
    selectAvailabilityForUri,
    availability => (availability === undefined ? undefined : availability > 0)
  );
};

export const selectFetchingAvailability = createSelector(
  _selectState,
  state => state.fetching || {}
);

const selectFetchingAvailabilityForUri = (state, props) => {
  return selectFetchingAvailability(state)[props.uri];
};

export const makeSelectFetchingAvailabilityForUri = () => {
  return createSelector(selectFetchingAvailabilityForUri, fetching => fetching);
};
