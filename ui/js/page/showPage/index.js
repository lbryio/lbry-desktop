import React from 'react'
import {
  connect
} from 'react-redux'
import {
  doResolveUri,
} from 'actions/content'
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
import {
  makeSelectResolvingUri,
} from 'selectors/content'
import ShowPage from './view'

const makeSelect = () => {
  const selectResolvingUri = makeSelectResolvingUri()

  const select = (state, props) => ({
    claim: selectCurrentUriClaim(state),
    uri: selectCurrentUri(state),
    isResolvingUri: selectResolvingUri(state, props),
    claimType: 'file',
  })

  return select
}

const perform = (dispatch) => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  resolveUri: (uri) => dispatch(doResolveUri(uri))
})

export default connect(makeSelect, perform)(ShowPage)
