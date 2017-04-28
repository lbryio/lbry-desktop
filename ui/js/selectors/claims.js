import {
  createSelector,
} from 'reselect'
import {
  selectCurrentUri,
} from 'selectors/app'

export const _selectState = state => state.claims || {}

export const selectClaimsByUri = createSelector(
  _selectState,
  (state) => state.byUri || {}
)

export const selectCurrentUriClaim = createSelector(
  selectCurrentUri,
  selectClaimsByUri,
  (uri, byUri) => byUri[uri] || {}
)

export const selectCurrentUriClaimOutpoint = createSelector(
  selectCurrentUriClaim,
  (claim) => `${claim.txid}:${claim.nout}`
)
