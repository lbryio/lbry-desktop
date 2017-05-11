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
  doOpenModal,
  doCloseModal,
} from 'actions/app'
import App from './view'

const select = (state) => ({
  currentPage: selectCurrentPage(state),
  modal: selectCurrentModal(state),
  headerLinks: selectHeaderLinks(state),
  searchTerm: selectSearchTerm(state)
})

const perform = (dispatch) => ({
  checkUpgradeAvailable: () => dispatch(doCheckUpgradeAvailable()),
  openModal: () => dispatch(doOpenModal()),
  closeModal: () => dispatch(doCloseModal()),
})

export default connect(select, perform)(App)
