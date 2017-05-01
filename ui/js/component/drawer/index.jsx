import React from 'react'
import {
  connect
} from 'react-redux'
import Drawer from './view'
import {
  doNavigate,
  doCloseDrawer,
  doLogoClick,
} from 'actions/app'
import {
  doUpdateBalance,
} from 'actions/wallet'
import {
  selectCurrentPage,
} from 'selectors/app'
import {
  selectBalance,
} from 'selectors/wallet'

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
