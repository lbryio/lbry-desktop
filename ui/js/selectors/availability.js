import { createSelector } from "reselect";

const _selectState = state => state.availability;

export const selectAvailabilityByUri = createSelector(
  _selectState,
  state => state.byUri || {}
);

export const makeSelectIsAvailableForUri = uri => {
  return createSelector(
    selectAvailabilityByUri,
    byUri => (!byUri || byUri[uri] === undefined ? undefined : byUri[uri] > 0)
  );
};

export const selectFetchingAvailability = createSelector(
  _selectState,
  state => state.fetching || {}
);

export const makeSelectFetchingAvailabilityForUri = uri => {
  return createSelector(
    selectFetchingAvailability,
    byUri => byUri && byUri[uri]
  );
};
