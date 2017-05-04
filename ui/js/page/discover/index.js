import React from 'react'
import {
  connect
} from 'react-redux'
import {
  selectFeaturedUris
} from 'selectors/content'
import {
  doSearchContent,
} from 'actions/search'
import {
  selectIsSearching,
  selectSearchQuery,
  selectCurrentSearchResults,
  selectSearchActivated,
} from 'selectors/search'
import DiscoverPage from './view'

const select = (state) => ({
  featuredUris: selectFeaturedUris(state),
})

const perform = (dispatch) => ({
})

export default connect(select, perform)(DiscoverPage)
