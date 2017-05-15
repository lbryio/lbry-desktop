import React from 'react'
import {
  connect
} from 'react-redux'
import {
  doFetchClaimsByChannel
} from 'actions/content'
import {
  makeSelectClaimsForChannel
} from 'selectors/claims'
import ChannelPage from './view'
//
// const select = (state) => ({
//   uri: selectCurrentUri(state),
//   claim: selectCurrentUriClaim(state),
//   claims: selectCurrentUriClaims(state)
// })

const perform = (dispatch) => ({
  fetchClaims: (uri) => dispatch(doFetchClaimsByChannel(uri))
})

export default connect(null, perform)(ChannelPage)
