import React from 'react';
import { connect } from 'react-redux';
import { doFetchFeaturedUris } from 'redux/actions/content';
import { selectFeaturedUris, selectFetchingFeaturedUris } from 'redux/selectors/content';
import { selectAllClaimsByChannel, selectClaimsById } from 'redux/selectors/claims'
import DiscoverPage from './view';

const select = state => ({
  featuredUris: selectFeaturedUris(state),
  fetchingFeaturedUris: selectFetchingFeaturedUris(state),
  claimsByChannel: selectAllClaimsByChannel(state),
  claimsById: selectClaimsById(state),
});

const perform = dispatch => ({
  fetchFeaturedUris: () => dispatch(doFetchFeaturedUris()),
});

export default connect(select, perform)(DiscoverPage);