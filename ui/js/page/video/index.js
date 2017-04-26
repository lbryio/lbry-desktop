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
  doPlayVideo,
} from 'actions/content'
import {
  selectCurrentUriCostInfo,
  selectCurrentUriFileInfo,
  selectLoadingCurrentUri,
  selectCurrentUriFileReadyToPlay,
  selectCurrentUriIsPlaying,
} from 'selectors/content'
import Video from './view'

const select = (state) => ({
  costInfo: selectCurrentUriCostInfo(state),
  fileInfo: selectCurrentUriFileInfo(state),
  modal: selectCurrentModal(state),
  isLoading: selectLoadingCurrentUri(state),
  readyToPlay: selectCurrentUriFileReadyToPlay(state),
  isPlaying: selectCurrentUriIsPlaying(state),
})

const perform = (dispatch) => ({
  play: () => dispatch(doPlayVideo()),
  onWatchClick: (elem) => dispatch(doWatchVideo()),
  closeModal: () => dispatch(doCloseModal()),
})

export default connect(select, perform)(Video)
