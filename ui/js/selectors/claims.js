import {
  createSelector,
} from 'reselect'
import lbryuri from 'lbryuri'

export const _selectState = state => state.claims || {}

export const selectClaimsByUri = createSelector(
  _selectState,
  (state) => state.claimsByUri || {}
)

export const selectAllClaimsByChannel = createSelector(
  _selectState,
  (state) => state.claimsByChannel || {}
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

export const selectClaimsInChannelForUri = (state, props) => {
  return selectAllClaimsByChannel(state)[props.uri]
}

export const makeSelectClaimsInChannelForUri = () => {
  return createSelector(
    selectClaimsInChannelForUri,
    (claims) => claims
  )
}

const selectMetadataForUri = (state, props) => {
  const claim = selectClaimForUri(state, props)
  const metadata = claim && claim.value && claim.value.stream && claim.value.stream.metadata

  return metadata ? metadata : (claim === undefined ? undefined : null)
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

  return source ? source : (claim === undefined ? undefined : null)
}

export const makeSelectSourceForUri = () => {
  return createSelector(
    selectSourceForUri,
    (source) => source
  )
}

export const makeSelectContentTypeForUri = () => {
  return createSelector(
    selectSourceForUri,
    (source) => source ? source.contentType : source
  )
}

export const selectClaimListMineIsPending = createSelector(
  _selectState,
  (state) => state.isClaimListMinePending
)

export const selectMyClaims = createSelector(
  _selectState,
  (state) => state.myClaims || {}
)

export const selectMyClaimsOutpoints = createSelector(
  selectMyClaims,
  (claims) => {
    if (!claims) {
      return []
    }

    return Object.values(claims).map((claim) => {
      return `${claim.txid}:${claim.nout}`
    })
  }
)
