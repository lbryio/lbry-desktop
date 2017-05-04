import React from 'react'
import {
  connect
} from 'react-redux'
import {
  selectBalance
} from 'selectors/wallet'
import {
  doNavigate,
  doHistoryBack,
} from 'actions/app'
import Header from './view'

const select = (state) => ({
  balance: lbry.formatCredits(selectBalance(state), 1)
})

const perform = (dispatch) => ({
  navigate: (path) => dispatch(doNavigate(path)),
  back: () => dispatch(doHistoryBack()),
})

export default connect(select, perform)(Header)
