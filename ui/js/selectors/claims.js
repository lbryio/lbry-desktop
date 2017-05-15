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

export const selectClaimsForChannel = (state, props) => {
  return selectAllClaimsByChannel(state)[props.uri]
}

export const makeSelectClaimsForChannel = () => {
  return createSelector(
    selectClaimsForChannel,
    (claim) => claim
  )
}

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

export const selectMyClaims = createSelector(
  _selectState,
  (state) => state.mine || {}
)

export const selectMyClaimsById = createSelector(
  selectMyClaims,
  (mine) => mine.byId || {}
)

export const selectMyClaimsOutpoints = createSelector(
  selectMyClaimsById,
  (byId) => {
    const outpoints = []
    Object.keys(byId).forEach(key => {
      const claim = byId[key]
      const outpoint = `${claim.txid}:${claim.nout}`
      outpoints.push(outpoint)
    })

    return outpoints
  }
)
