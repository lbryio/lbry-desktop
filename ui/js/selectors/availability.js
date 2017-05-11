import {
  createSelector,
} from 'reselect'
import {
  selectDaemonReady,
  selectCurrentPage,
  selectCurrentUri,
} from 'selectors/app'

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

export const selectFetchingAvailabilityForCurrentUri = createSelector(
  selectCurrentUri,
  selectFetchingAvailabilityByUri,
  (uri, byUri) => byUri[uri]
)

export const selectAvailabilityForCurrentUri = createSelector(
  selectCurrentUri,
  selectAvailabilityByUri,
  (uri, byUri) => byUri[uri]
)