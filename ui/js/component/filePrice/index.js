import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  makeSelectCostInfoForUri,
} from 'selectors/cost_info'
import FilePrice from './view'

const makeSelect = () => {
  const selectCostInfoForUri = makeSelectCostInfoForUri()
  const select = (state, props) => ({
    costInfo: selectCostInfoForUri(state, props),
  })

  return select
}

const perform = (dispatch) => ({
})

export default connect(makeSelect, perform)(FilePrice)
