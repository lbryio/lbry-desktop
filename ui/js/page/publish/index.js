import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  doNavigate,
} from 'actions/app'
import PublishPage from './view'

const select = (state) => ({
})

const perform = (dispatch) => ({
  navigate: (path) => dispatch(doNavigate(path)),
})

export default connect(select, perform)(PublishPage)
