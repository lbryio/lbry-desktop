import React from 'react'
import {
  connect
} from 'react-redux'
import {
  doNavigate,
} from 'actions/app'
import HelpPage from './view'

const perform = (dispatch) => ({
  navigate: (path) => dispatch(doNavigate(path)),
})

export default connect(null, perform)(HelpPage)
