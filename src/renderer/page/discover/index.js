import React from 'react';
import { connect } from 'react-redux';
import { doFetchFeaturedUris } from 'redux/actions/content';
import { selectFetchingFeaturedUris } from 'redux/selectors/content';
import { selectDiscover } from 'redux/selectors/discover';
import DiscoverPage from './view';

const select = state => ({
  fetchingFeaturedUris: selectFetchingFeaturedUris(state),
  categories: selectDiscover(state),
});

const perform = dispatch => ({
  fetchFeaturedUris: () => dispatch(doFetchFeaturedUris()),
});

export default connect(select, perform)(DiscoverPage);
