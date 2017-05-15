import React from 'react';
import { connect } from 'react-redux'

import {
  selectCurrentModal,
} from 'selectors/app'
import {
  doCheckUpgradeAvailable,
} from 'actions/app'
import App from './view'

const select = (state) => ({
  modal: selectCurrentModal(state),
})

const perform = (dispatch) => ({
  checkUpgradeAvailable: () => dispatch(doCheckUpgradeAvailable()),
})

export default connect(select, perform)(App)
