import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  doNavigate
} from 'actions/app'
import {
  selectFetchingRewards,
  selectIsRewardEligible,
  selectRewards,
} from 'selectors/rewards'
import {
  selectUserIsRewardEligible
} from 'selectors/user'
import RewardsPage from './view'

const select = (state) => ({
  fetching: selectFetchingRewards(state),
  rewards: selectRewards(state),
  isEligible: selectUserIsRewardEligible(state)
})

const perform = (dispatch) => ({
  navigateToAuth: () => dispatch(doNavigate('/account-verification'))
})

export default connect(select, perform)(RewardsPage)
