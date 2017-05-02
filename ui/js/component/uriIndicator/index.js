import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  makeSelectClaimForUri,
} from 'selectors/claims'
import UriIndicator from './view'

const makeSelect = () => {
  const selectClaimForUri = makeSelectClaimForUri()

  const select = (state, props) => ({
    claim: selectClaimForUri(state, props),
  })

  return select
}

export default connect(makeSelect, null)(UriIndicator)
