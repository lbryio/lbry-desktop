import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  makeSelectHasClaimedReward,
} from 'selectors/rewards'
import {
  doClaimReward,
} from 'actions/rewards'
import RewardLink from './view'

const makeSelect = () => {
  const selectHasClaimedReward = makeSelectHasClaimedReward()

  const select = (state, props) => ({
    claimed: selectHasClaimedReward(state, props)
  })

  return select
}

const perform = (dispatch) => ({
  claimReward: (reward) => dispatch(doClaimReward(reward)),
})

export default connect(makeSelect, perform)(RewardLink)
