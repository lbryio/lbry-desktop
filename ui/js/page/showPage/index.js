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
  selectCurrentUriClaim,
  selectCurrentUriChannelClaim,
} from 'selectors/claims'
import {
  selectCurrentUriIsResolving,
} from 'selectors/content'
import ShowPage from './view'

const select = (state, props) => ({
  channelClaim: selectCurrentUriChannelClaim(state),
  claim: selectCurrentUriClaim(state),
  uri: selectCurrentUri(state),
  isResolvingUri: selectCurrentUriIsResolving(state)
})

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri))
})

export default connect(select, perform)(ShowPage)
