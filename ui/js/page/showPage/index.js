import React from 'react'
import {
  connect
} from 'react-redux'
import {
  selectCurrentUri,
} from 'selectors/app'
import {
  selectCurrentUriIsDownloaded,
} from 'selectors/file_info'
import {
  selectCurrentUriClaim,
} from 'selectors/claims'
import {
  selectCurrentUriFileInfo,
} from 'selectors/file_info'
import {
  selectCurrentUriCostInfo,
} from 'selectors/cost_info'
import ShowPage from './view'

const select = (state) => ({
  claim: selectCurrentUriClaim(state),
  uri: selectCurrentUri(state),
  isDownloaded: selectCurrentUriIsDownloaded(state),
  fileInfo: selectCurrentUriFileInfo(state),
  costInfo: selectCurrentUriCostInfo(state),
  isFailed: false,
  claimType: 'file',
})

const perform = (dispatch) => ({
})

export default connect(select, perform)(ShowPage)
