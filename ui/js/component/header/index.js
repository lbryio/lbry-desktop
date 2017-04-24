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
} from 'actions/search'
import Header from './view'

const select = (state) => ({
  currentPage: selectCurrentPage(state),
  subLinks: selectHeaderLinks(state),
})

const perform = (dispatch) => ({
  navigate: (path) => dispatch(doNavigate(path)),
  search: (query) => dispatch(doSearchContent(query)),
})

export default connect(select, perform)(Header)
