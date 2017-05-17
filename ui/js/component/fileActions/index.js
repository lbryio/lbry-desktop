import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  selectPlatform,
} from 'selectors/app'
import {
  makeSelectFileInfoForUri,
  makeSelectDownloadingForUri,
  makeSelectLoadingForUri,
} from 'selectors/file_info'
import {
  makeSelectIsAvailableForUri,
} from 'selectors/availability'
import {
  selectCurrentModal,
} from 'selectors/app'
import {
  doCloseModal,
  doOpenModal,
} from 'actions/app'
import {
  doFetchAvailability
} from 'actions/availability'
import {
  doOpenFileInShell,
  doOpenFileInFolder,
  doDeleteFile,
} from 'actions/file_info'
import {
  doPurchaseUri,
  doLoadVideo,
} from 'actions/content'
import FileActions from './view'

const makeSelect = () => {
  const selectFileInfoForUri = makeSelectFileInfoForUri()
  const selectIsAvailableForUri = makeSelectIsAvailableForUri()
  const selectDownloadingForUri = makeSelectDownloadingForUri()

  const select = (state, props) => ({
    fileInfo: selectFileInfoForUri(state, props),
    isAvailable: selectIsAvailableForUri(state, props),
    platform: selectPlatform(state),
    modal: selectCurrentModal(state),
    downloading: selectDownloadingForUri(state, props),
  })

  return select
}

const perform = (dispatch) => ({
  checkAvailability: (uri) => dispatch(doFetchAvailability(uri)),
  closeModal: () => dispatch(doCloseModal()),
  openInFolder: (fileInfo) => dispatch(doOpenFileInFolder(fileInfo)),
  openInShell: (fileInfo) => dispatch(doOpenFileInShell(fileInfo)),
  deleteFile: (fileInfo, deleteFromComputer) => dispatch(doDeleteFile(fileInfo, deleteFromComputer)),
  openModal: (modal) => dispatch(doOpenModal(modal)),
  startDownload: (uri) => dispatch(doPurchaseUri(uri)),
  loadVideo: (uri) => dispatch(doLoadVideo(uri))
})

export default connect(makeSelect, perform)(FileActions)