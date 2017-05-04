import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  selectCurrentPage,
} from 'selectors/app'
import {
  doNavigate,
} from 'actions/app'
import NavMain from './view'

const select = (state) => ({
  currentPage: selectCurrentPage(state)
})

const perform = (dispatch) => ({
  navigate: (path) => dispatch(doNavigate(path))
})

export default connect(select, perform)(NavMain)
