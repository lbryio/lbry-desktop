import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  selectObscureNsfw,
  selectHidePrice,
  selectHasSignature,
} from 'selectors/app'
import FileActions from './view'

const select = (state) => ({
  obscureNsfw: selectObscureNsfw(state),
  hidePrice: selectHidePrice(state),
  hasSignature: selectHasSignature(state),
})

const perform = {
}

export default connect(select, perform)(FileActions)
