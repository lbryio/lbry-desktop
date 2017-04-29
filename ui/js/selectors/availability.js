import {
  createSelector,
} from 'reselect'

const _selectState = state => state.availability

export const selectAvailabilityByUri = createSelector(
  _selectState,
  (state) => state.byUri || {}
)

export const selectFetchingAvailability = createSelector(
  _selectState,
  (state) => state.fetching || {}
)

export const selectFetchingAvailabilityByUri = createSelector(
  selectFetchingAvailability,
  (fetching) => fetching.byUri || {}
)

const selectAvailabilityForUri = (state, props) => {
  return selectAvailabilityByUri(state)[props.uri]
}

export const makeSelectAvailabilityForUri = () => {
  return createSelector(
    selectAvailabilityForUri,
    (availability) => availability
  )
}

const selectFetchingAvailabilityForUri = (state, props) => {
  return selectFetchingAvailabilityByUri(state)[props.uri]
}

export const makeSelectFetchingAvailabilityForUri = () => {
  return createSelector(
    selectFetchingAvailabilityForUri,
    (fetching) => fetching
  )
}
