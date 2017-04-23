import React from 'react'
import {
  connect
} from 'react-redux'
import {
  selectFeaturedContentByCategory
} from 'selectors/content'
import DiscoverPage from './view'

const select = (state) => ({
  featuredContentByCategory: selectFeaturedContentByCategory(state),
})

const perform = (dispatch) => ({
})

export default connect(select, perform)(DiscoverPage)
