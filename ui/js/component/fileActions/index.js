import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  selectObscureNsfw,
  selectHidePrice,
  selectHasSignature,
  selectPlatform,
} from 'selectors/app'
import {
  makeSelectFileInfoForUri,
  makeSelectDownloadingForUri,
  makeSelectLoadingForUri,
} from 'selectors/file_info'
import {
  makeSelectAvailabilityForUri,
} from 'selectors/availability'
import {
  selectCurrentModal,
} from 'selectors/app'
import {
  doCloseModal,
  doOpenModal,
} from 'actions/app'
import {
  doOpenFileInShell,
  doOpenFileInFolder,
  doDeleteFile,
} from 'actions/file_info'
import {
  doWatchVideo,
} from 'actions/content'
import FileActions from './view'

const makeSelect = () => {
  const selectFileInfoForUri = makeSelectFileInfoForUri()
  const selectAvailabilityForUri = makeSelectAvailabilityForUri()
  const selectDownloadingForUri = makeSelectDownloadingForUri()
  const selectLoadingForUri = makeSelectLoadingForUri()

  const select = (state, props) => ({
    obscureNsfw: selectObscureNsfw(state),
    hidePrice: selectHidePrice(state),
    hasSignature: selectHasSignature(state),
    fileInfo: selectFileInfoForUri(state, props),
    availability: selectAvailabilityForUri(state, props),
    platform: selectPlatform(state),
    modal: selectCurrentModal(state),
    downloading: selectDownloadingForUri(state, props),
    loading: selectLoadingForUri(state, props),
  })

  return select
}

const perform = (dispatch) => ({
  closeModal: () => dispatch(doCloseModal()),
  openInFolder: (fileInfo) => dispatch(doOpenFileInFolder(fileInfo)),
  openInShell: (fileInfo) => dispatch(doOpenFileInShell(fileInfo)),
  affirmPurchase: () => console.log('affirm purchase'),
  deleteFile: (fileInfo, deleteFromComputer) => dispatch(doDeleteFile(fileInfo, deleteFromComputer)),
  openModal: (modal) => dispatch(doOpenModal(modal)),
  downloadClick: () => dispatch(doWatchVideo()),
})

export default connect(makeSelect, perform)(FileActions)
