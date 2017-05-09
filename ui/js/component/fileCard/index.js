import React from 'react'
import {
  connect
} from 'react-redux'
import {
  doNavigate,
} from 'actions/app'
import {
  doResolveUri,
} from 'actions/content'
import {
  selectHidePrice,
  selectObscureNsfw,
} from 'selectors/app'
import {
  makeSelectClaimForUri,
  makeSelectSourceForUri,
  makeSelectMetadataForUri,
} from 'selectors/claims'
import {
  makeSelectFileInfoForUri,
} from 'selectors/file_info'
import {
  makeSelectResolvingUri,
} from 'selectors/content'
import FileCard from './view'

const makeSelect = () => {
  const selectClaimForUri = makeSelectClaimForUri()
  const selectFileInfoForUri = makeSelectFileInfoForUri()
  const selectMetadataForUri = makeSelectMetadataForUri()
  const selectSourceForUri = makeSelectSourceForUri()
  const selectResolvingUri = makeSelectResolvingUri()

  const select = (state, props) => ({
    claim: selectClaimForUri(state, props),
    fileInfo: selectFileInfoForUri(state, props),
    hidePrice: selectHidePrice(state),
    obscureNsfw: selectObscureNsfw(state),
    hasSignature: false,
    metadata: selectMetadataForUri(state, props),
    source: selectSourceForUri(state, props),
    isResolvingUri: selectResolvingUri(state, props),
  })

  return select
}

const perform = (dispatch) => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
})

export default connect(makeSelect, perform)(FileCard)
