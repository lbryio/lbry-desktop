import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  makeSelectHasClaimedReward,
  makeSelectClaimRewardError,
  makeSelectIsRewardClaimPending
} from 'selectors/rewards'
import {
  doClaimReward,
  doClaimRewardClearError
} from 'actions/rewards'
import RewardLink from './view'

const makeSelect = () => {
  const selectHasClaimedReward = makeSelectHasClaimedReward()
  const selectIsPending = makeSelectIsRewardClaimPending()
  const selectError = makeSelectClaimRewardError()

  const select = (state, props) => ({
    isClaimed: selectHasClaimedReward(state, props),
    errorMessage: selectError(state, props),
    isPending: selectIsPending(state, props)
  })

  return select
}

const perform = (dispatch) => ({
  claimReward: (reward) => dispatch(doClaimReward(reward)),
  clearError: (reward) => dispatch(doClaimRewardClearError(reward))
})

export default connect(makeSelect, perform)(RewardLink)
