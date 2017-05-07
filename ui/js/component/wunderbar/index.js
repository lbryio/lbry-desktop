import React from 'react'
import {
  connect
} from 'react-redux'
import {
  selectWunderBarAddress,
  selectWunderBarIcon
} from 'selectors/app'
import {
  doNavigate,
} from 'actions/app'
import {
  doSearchContent,
  doActivateSearch,
  doDeactivateSearch,
} from 'actions/search'
import Wunderbar from './view'

const select = (state) => ({
  address: selectWunderBarAddress(state),
  icon: selectWunderBarIcon(state)
})

const perform = (dispatch) => ({
  // navigate: (path) => dispatch(doNavigate(path)),
  // onSearch: (query) => dispatch(doSearchContent(query)),
  // onSubmit: (query) => dispatch(doSearchContent(query)),
  // activateSearch: () => dispatch(doActivateSearch()),
  // deactivateSearch: () => setTimeout(() => { dispatch(doDeactivateSearch()) }, 50),
  onSearch: (query) => dispatch(doNavigate('/search', { query })),
  onSubmit: (query) => console.debug('you submitted'),
})

export default connect(select, perform)(Wunderbar)
