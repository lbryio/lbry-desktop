import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  selectFetchingRewards,
  selectRewards,
} from 'selectors/rewards'
import RewardsPage from './view'

const select = (state) => ({
  fetching: selectFetchingRewards(state),
  rewards: selectRewards(state),
})

const perform = (dispatch) => ({
})

export default connect(select, perform)(RewardsPage)
