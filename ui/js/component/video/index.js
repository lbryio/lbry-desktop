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
  makeSelectMetadataForUri
} from 'selectors/claims'
import {
  makeSelectFileInfoForUri,
  makeSelectLoadingForUri,
  makeSelectDownloadingForUri,
} from 'selectors/file_info'
import {
  makeSelectCostInfoForUri,
} from 'selectors/cost_info'
import Video from './view'


const makeSelect = () => {
  const selectCostInfo = makeSelectCostInfoForUri()
  const selectFileInfo = makeSelectFileInfoForUri()
  const selectIsLoading = makeSelectLoadingForUri()
  const selectIsDownloading = makeSelectDownloadingForUri()
  const selectMetadata = makeSelectMetadataForUri()

  const select = (state, props) => ({
    costInfo: selectCostInfo(state, props),
    fileInfo: selectFileInfo(state, props),
    metadata: selectMetadata(state, props),
    modal: selectCurrentModal(state),
    isLoading: selectIsLoading(state, props),
    isDownloading: selectIsDownloading(state, props),
  })

  return select
}

const perform = (dispatch) => ({
  loadVideo: (uri) => dispatch(doLoadVideo(uri)),
  watchVideo: (uri) => dispatch(doWatchVideo(uri)),
  closeModal: () => dispatch(doCloseModal()),
})

export default connect(makeSelect, perform)(Video)