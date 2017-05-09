import React from 'react'
import {
  connect
} from 'react-redux'
import {
  makeSelectClaimForUri,
} from 'selectors/claims'
import {
  makeSelectFileInfoForUri,
} from 'selectors/file_info'
import {
  makeSelectResolvingUri,
} from 'selectors/content'
import {
  doResolveUri,
} from 'actions/content'
import FileTile from './view'

const makeSelect = () => {
  const selectClaimForUri = makeSelectClaimForUri()
  const selectFileInfoForUri = makeSelectFileInfoForUri()
  const selectResolvingUri = makeSelectResolvingUri()

  const select = (state, props) => ({
    claim: selectClaimForUri(state, props),
    fileInfo: selectFileInfoForUri(state, props),
    resolvingUri: selectResolvingUri(state, props),
  })

  return select
}

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
})

export default connect(makeSelect, perform)(FileTile)
