import React from 'react'
import {
  connect
} from 'react-redux'
import {
  selectFeaturedContentByCategory
} from 'selectors/content'
import {
  doSearchContent,
} from 'actions/search'
import {
  selectIsSearching,
  selectSearchQuery,
  selectCurrentSearchResults,
} from 'selectors/search'
import DiscoverPage from './view'

const select = (state) => ({
  featuredContentByCategory: selectFeaturedContentByCategory(state),
  isSearching: selectIsSearching(state),
  query: selectSearchQuery(state),
  results: selectCurrentSearchResults(state),
})

const perform = (dispatch) => ({
})

export default connect(select, perform)(DiscoverPage)
