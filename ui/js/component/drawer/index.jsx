import React from 'react'
import {
  connect
} from 'react-redux'
import Drawer from './view'
import {
  doNavigate,
  doCloseDrawer,
  doLogoClick,
  doUpdateBalance,
} from 'actions/app'
import {
  selectCurrentPage,
  selectBalance,
} from 'selectors/app'

const select = (state) => ({
  currentPage: selectCurrentPage(state),
  balance: selectBalance(state),
})

const perform = {
  linkClick: doNavigate,
  logoClick: doLogoClick,
  closeDrawerClick: doCloseDrawer,
  updateBalance: doUpdateBalance,
}

export default connect(select, perform)(Drawer)
