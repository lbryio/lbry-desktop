import React from 'react'
import {
  connect
} from 'react-redux'
import {
  selectClaimsByUri,
} from 'selectors/claims'
import FileTile from './view'

const select = (state) => ({
  claims: (uri) => selectClaimsByUri(state)[uri],
})

const perform = (dispatch) => ({
})

export default connect(select, perform)(FileTile)
