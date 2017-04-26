import React from 'react'
import {
  connect
} from 'react-redux'
import {
  selectResolvedUris,
} from 'selectors/content'
import FileTile from './view'

const select = (state) => ({
  resolvedUris: (uri) => selectResolvedUris(state)[uri],
})

const perform = (dispatch) => ({
})

export default connect(select, perform)(FileTile)
