import React from 'react';
import { connect } from 'react-redux'

import {
  selectCurrentPage,
  selectCurrentModal,
  selectDrawerOpen,
  selectHeaderLinks,
  selectSearchTerm,
} from 'selectors/app'
import {
  doCheckUpgradeAvailable,
  doOpenDrawer,
  doCloseDrawer,
  doOpenModal,
  doCloseModal,
  doSearch,
} from 'actions/app'
import App from './view'

const select = (state) => ({
  currentPage: selectCurrentPage(state),
  modal: selectCurrentModal(state),
  drawerOpen: selectDrawerOpen(state),
  headerLinks: selectHeaderLinks(state),
  searchTerm: selectSearchTerm(state)
})

const perform = (dispatch) => ({
  checkUpgradeAvailable: () => dispatch(doCheckUpgradeAvailable()),
  openDrawer: () => dispatch(doOpenDrawer()),
  closeDrawer: () => dispatch(doCloseDrawer()),
  openModal: () => dispatch(doOpenModal()),
  closeModal: () => dispatch(doCloseModal()),
})

export default connect(select, perform)(App)
