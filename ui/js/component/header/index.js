import React from 'react'
import {
  connect
} from 'react-redux'
import {
  selectCurrentPage,
  selectHeaderLinks,
} from 'selectors/app'
import {
  doNavigate,
} from 'actions/app'
import {
  doSearchContent,
  doActivateSearch,
  doDeactivateSearch,
} from 'actions/search'
import Header from './view'

const select = (state) => ({
  currentPage: selectCurrentPage(state),
  subLinks: selectHeaderLinks(state),
})

const perform = (dispatch) => ({
  navigate: (path) => dispatch(doNavigate(path)),
  search: (query) => dispatch(doSearchContent(query)),
  activateSearch: () => dispatch(doActivateSearch()),
  deactivateSearch: () => setTimeout(() => { dispatch(doDeactivateSearch()) }, 10),
})

export default connect(select, perform)(Header)
