import React from 'react'
import {
  connect
} from 'react-redux'
import {
  doFetchClaimsByChannel
} from 'actions/content'
import {
  makeSelectClaimForUri,
  makeSelectClaimsInChannelForUri
} from 'selectors/claims'
import ChannelPage from './view'

import FilePage from './view'

const makeSelect = () => {
  const selectClaim = makeSelectClaimForUri(),
        selectClaimsInChannel = makeSelectClaimsInChannelForUri()

  const select = (state, props) => ({
    claim: selectClaim(state, props),
    claimsInChannel: selectClaimsInChannel(state, props)
  })

  return select
}

const perform = (dispatch) => ({
  // fetchClaims: () => { console.log('fetch claims') }
  fetchClaims: (uri) => dispatch(doFetchClaimsByChannel(uri))
})

export default connect(makeSelect, perform)(ChannelPage)
