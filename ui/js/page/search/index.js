import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  doSearchContent,
} from 'actions/search'
import {
  selectIsSearching,
  selectCurrentSearchResults,
  selectSearchActivated,
} from 'selectors/search'
import {
  selectSearchQuery,
} from 'selectors/app'
import {
  doNavigate,
} from 'actions/app'
import SearchPage from './view'

const select = (state) => ({
  isSearching: selectIsSearching(state),
  query: selectSearchQuery(state),
  results: selectCurrentSearchResults(state),
  searchActive: selectSearchActivated(state),
})

const perform = (dispatch) => ({
  navigate: (path) => dispatch(doNavigate(path)),
})

export default connect(select, perform)(SearchPage)
