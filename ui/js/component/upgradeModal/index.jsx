import React from 'react'
import {
  connect
} from 'react-redux'
import {
  doDownloadUpgrade,
  doSkipUpgrade,
} from 'actions/app'
import UpgradeModal from './view'

const select = (state) => ({
})

const perform = (dispatch) => ({
  downloadUpgrade: () => dispatch(doDownloadUpgrade()),
  skipUpgrade: () => dispatch(doSkipUpgrade()),
})

export default connect(select, perform)(UpgradeModal)
