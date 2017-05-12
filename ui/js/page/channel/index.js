import React from 'react'
import {
  connect
} from 'react-redux'
import {
  doFetchChannelClaims
} from 'actions/content'
import {
  selectCurrentUri,
} from 'selectors/app'
import {
  selectCurrentUriClaim,
  selectCurrentUriClaims,
} from 'selectors/claims'
import ChannelPage from './view'

const select = (state) => ({
  uri: selectCurrentUri(state),
  claim: selectCurrentUriClaim(state),
  claims: selectCurrentUriClaims(state)
})

const perform = (dispatch) => ({
  fetchClaims: (uri) => dispatch(doFetchChannelClaims(uri))
})

export default connect(select, perform)(ChannelPage)
