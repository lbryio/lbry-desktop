import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  selectFetchingRewards,
  selectClaimedRewardsByType,
  makeSelectRewardByType,
} from 'selectors/rewards'
import AuthOverlay from './view'

const makeSelect = () => {
  const selectRewardByType = makeSelectRewardByType()

  const select = (state) => ({
    fetchingRewards: selectFetchingRewards(state),
    claimedRewardsByType: selectClaimedRewardsByType(state),
    newUserReward: selectRewardByType(state, { reward_type: 'new_user' }),
  })

  return select
}

const perform = (dispatch) => ({
})

export default connect(makeSelect, perform)(AuthOverlay)
