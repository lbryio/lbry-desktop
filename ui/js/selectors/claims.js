import {
  createSelector,
} from 'reselect'
import lbryuri from 'lbryuri'
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

const selectClaimForUri = (state, props) => {
  const uri = lbryuri.normalize(props.uri)
  return selectClaimsByUri(state)[uri]
}

export const makeSelectClaimForUri = () => {
  return createSelector(
    selectClaimForUri,
    (claim) => claim
  )
}

const selectMetadataForUri = (state, props) => {
  const claim = selectClaimForUri(state, props)
  const metadata = claim && claim.value && claim.value.stream && claim.value.stream.metadata

  return metadata ? metadata : undefined
}

export const makeSelectMetadataForUri = () => {
  return createSelector(
    selectMetadataForUri,
    (metadata) => metadata
  )
}

const selectSourceForUri = (state, props) => {
  const claim = selectClaimForUri(state, props)
  const source = claim && claim.value && claim.value.stream && claim.value.stream.source

  return source ? source : undefined
}

export const makeSelectSourceForUri = () => {
  return createSelector(
    selectSourceForUri,
    (source) => source
  )
}
