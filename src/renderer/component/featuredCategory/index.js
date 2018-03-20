import React from 'react';
import { connect } from 'react-redux';
import { selectAllClaimsByChannel, selectClaimsById } from 'redux/selectors/claims';
import { doFetchClaimsByChannel } from 'redux/actions/content';
import FeaturedCategory from './view';

const select = state => ({
  claimsByChannel: selectAllClaimsByChannel(state),
  claimsById: selectClaimsById(state)
});

const perform = dispatch => ({
  fetchChannel: channel => dispatch(doFetchClaimsByChannel(channel, 1))
});

export default connect(select, perform)(FeaturedCategory);
