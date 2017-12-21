import React from 'react';
import { connect } from 'react-redux';
import { selectClaimedRewards } from 'redux/selectors/rewards';
import RewardListClaimed from './view';

const select = state => ({
  rewards: selectClaimedRewards(state),
});

export default connect(select, null)(RewardListClaimed);
