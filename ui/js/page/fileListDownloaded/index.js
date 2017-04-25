import React from 'react'
import {
  connect
} from 'react-redux'
import {
  selectDownloadedContentFileInfos,
  selectFetchingDownloadedContent,
} from 'selectors/content'
import FileListDownloaded from './view'

const select = (state) => ({
  downloadedContent: selectDownloadedContentFileInfos(state),
  fetching: selectFetchingDownloadedContent(state),
})

const perform = (dispatch) => ({
})

export default connect(select, perform)(FileListDownloaded)
