import React from 'react'
import {
  connect
} from 'react-redux'
import {
  selectResolvedUris,
} from 'selectors/content'
import FileTile from './view'

const select = (state) => ({
  resolvedUris: selectResolvedUris(state),
})

const perform = (dispatch) => ({
})

export default connect(select, perform)(FileTile)
