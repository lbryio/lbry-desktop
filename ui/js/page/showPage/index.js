import React from 'react'
import {
  connect
} from 'react-redux'
import {
  selectCurrentUri,
} from 'selectors/app'
import {
  selectCurrentResolvedUriClaim,
  selectCurrentUriIsDownloaded,
  selectCurrentUriFileInfo,
  selectCurrentUriCostInfo,
} from 'selectors/content'
import ShowPage from './view'

const select = (state) => ({
  claim: selectCurrentResolvedUriClaim(state),
  uri: selectCurrentUri(state),
  isDownloaded: selectCurrentUriIsDownloaded(state),
  fileInfo: selectCurrentUriFileInfo(state),
  costInfo: selectCurrentUriCostInfo(state),
})

const perform = (dispatch) => ({
})

export default connect(select, perform)(ShowPage)
