import React from 'react'
import {
  connect
} from 'react-redux'
import {
  selectFeaturedUris,
  selectFetchingFeaturedUris,
} from 'selectors/content'
import DiscoverPage from './view'

const select = (state) => ({
  featuredUris: selectFeaturedUris(state),
  fetchingFeaturedUris: selectFetchingFeaturedUris(state),
})

const perform = (dispatch) => ({
})

export default connect(select, perform)(DiscoverPage)
