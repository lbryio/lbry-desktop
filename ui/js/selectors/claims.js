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
  (uri, byUri) => byUri[uri]
)

export const selectCurrentUriClaimOutpoint = createSelector(
  selectCurrentUriClaim,
  (claim) => {
    return claim ? `${claim.txid}:${claim.nout}` : null
  }
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
