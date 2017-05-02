import React from 'react'
import {
  connect
} from 'react-redux'
import {
  doNavigate,
} from 'actions/app'
import {
  makeSelectClaimForUri,
  makeSelectSourceForUri,
  makeSelectMetadataForUri,
} from 'selectors/claims'
import {
  makeSelectFileInfoForUri,
} from 'selectors/file_info'
import {
  makeSelectFetchingAvailabilityForUri,
  makeSelectAvailabilityForUri,
} from 'selectors/availability'
import {
  selectObscureNsfw,
} from 'selectors/app'
import {
  makeSelectResolvingUri,
} from 'selectors/content'
import FileTileStream from './view'

const makeSelect = () => {
  const selectClaimForUri = makeSelectClaimForUri()
  const selectFileInfoForUri = makeSelectFileInfoForUri()
  const selectFetchingAvailabilityForUri = makeSelectFetchingAvailabilityForUri()
  const selectAvailabilityForUri = makeSelectAvailabilityForUri()
  const selectMetadataForUri = makeSelectMetadataForUri()
  const selectSourceForUri = makeSelectSourceForUri()
  const selectResolvingUri = makeSelectResolvingUri()

  const select = (state, props) => ({
    claim: selectClaimForUri(state, props),
    fileInfo: selectFileInfoForUri(state, props),
    fetchingAvailability: selectFetchingAvailabilityForUri(state, props),
    selectAvailabilityForUri: selectAvailabilityForUri(state, props),
    obscureNsfw: selectObscureNsfw(state),
    metadata: selectMetadataForUri(state, props),
    source: selectSourceForUri(state, props),
    isResolvingUri: selectResolvingUri(state, props),
  })

  return select
}

const perform = (dispatch) => ({
  navigate: (path) => dispatch(doNavigate(path))
})

export default connect(makeSelect, perform)(FileTileStream)
