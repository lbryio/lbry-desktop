import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  doCloseModal,
} from 'actions/app'
import {
  selectCurrentModal,
} from 'selectors/app'
import {
  doWatchVideo,
  doLoadVideo,
} from 'actions/content'
import {
  selectCurrentUriCostInfo,
  selectCurrentUriFileInfo,
  selectLoadingCurrentUri,
  selectCurrentUriFileReadyToPlay,
  selectCurrentUriIsPlaying,
  selectDownloadingCurrentUri,
} from 'selectors/content'
import Video from './view'

const select = (state) => ({
  costInfo: selectCurrentUriCostInfo(state),
  fileInfo: selectCurrentUriFileInfo(state),
  modal: selectCurrentModal(state),
  isLoading: selectLoadingCurrentUri(state),
  readyToPlay: selectCurrentUriFileReadyToPlay(state),
  isDownloading: selectDownloadingCurrentUri(state),
})

const perform = (dispatch) => ({
  loadVideo: () => dispatch(doLoadVideo()),
  watchVideo: (elem) => dispatch(doWatchVideo()),
  closeModal: () => dispatch(doCloseModal()),
})

export default connect(select, perform)(Video)
