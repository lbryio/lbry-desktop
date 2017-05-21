import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  doNavigate,
  doHistoryBack,
} from 'actions/app'
import {
  selectMyClaims
} from 'selectors/claims'
import PublishPage from './view'

const select = (state) => ({
  myClaims: selectMyClaims(state)
})

const perform = (dispatch) => ({
  back: () => dispatch(doHistoryBack()),
  navigate: (path) => dispatch(doNavigate(path)),
})

export default connect(select, perform)(PublishPage)
