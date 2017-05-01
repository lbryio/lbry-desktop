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
import FileTile from './view'

const makeSelect = () => {
  const selectClaimForUri = makeSelectClaimForUri()
  const selectFileInfoForUri = makeSelectFileInfoForUri()
  const select = (state, props) => ({
    claim: selectClaimForUri(state, props),
    fileInfo: selectFileInfoForUri(state, props),
  })

  return select
}

const perform = (dispatch) => ({
})

export default connect(makeSelect, perform)(FileTile)
