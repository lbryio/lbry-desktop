import React from 'react';
import { connect } from 'react-redux';
import { doFetchFeaturedUris } from 'redux/actions/content';
import { selectFeaturedUris, selectFetchingFeaturedUris } from 'redux/selectors/content';
import {
  selectSubscriptionsFromClaims,
  selectSubscriptions,
  selectHasFetchedSubscriptions,
} from 'redux/selectors/subscriptions';
import { doFetchClaimsByChannel } from 'redux/actions/content';
import { setHasFetchedSubscriptions } from 'redux/actions/subscriptions';
import DiscoverPage from './view';



const select = state => ({
  featuredUris: selectFeaturedUris(state),
  fetchingFeaturedUris: selectFetchingFeaturedUris(state),
  hasFetchedSubscriptions: state.subscriptions.hasFetchedSubscriptions,
  savedSubscriptions: selectSubscriptions(state),
  subscriptions: selectSubscriptionsFromClaims(state),
});

const perform = dispatch => ({
  fetchFeaturedUris: () => dispatch(doFetchFeaturedUris()),
  doFetchClaimsByChannel: channel => doFetchClaimsByChannel(channel),
  setHasFetchedSubscriptions: () => setHasFetchedSubscriptions(),
});

export default connect(select, perform)(DiscoverPage);
