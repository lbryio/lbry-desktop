import React from 'react'
import {
  connect
} from 'react-redux'
import {
  selectCurrentModal,
  selectError,
} from 'selectors/app'
import {
  doCloseModal,
} from 'actions/app'
import ErrorModal from './view'

const select = (state) => ({
  modal: selectCurrentModal(state),
  error: selectError(state),
})

const perform = (dispatch) => ({
  closeModal: () => dispatch(doCloseModal())
})

export default connect(select, perform)(ErrorModal)
