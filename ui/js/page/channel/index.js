import React from 'react'
import {
  connect
} from 'react-redux'
import {
  selectCurrentUriTitle,
} from 'selectors/app'
import ChannelPage from './view'

const select = (state) => ({
  title: selectCurrentUriTitle(state)
})

const perform = (dispatch) => ({
})

export default connect(select, perform)(ChannelPage)
