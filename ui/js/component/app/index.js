import React from 'react';
import { connect } from 'react-redux'

import {
  selectCurrentModal,
} from 'selectors/app'
import {
  doCheckUpgradeAvailable,
} from 'actions/app'
import {
  doUpdateBalance,
} from 'actions/wallet'
import App from './view'

const select = (state) => ({
  modal: selectCurrentModal(state),
})

const perform = (dispatch) => ({
  checkUpgradeAvailable: () => dispatch(doCheckUpgradeAvailable()),
  updateBalance: (balance) => dispatch(doUpdateBalance(balance))
})

export default connect(select, perform)(App)
