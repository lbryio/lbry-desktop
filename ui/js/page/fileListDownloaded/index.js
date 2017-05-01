import React from 'react'
import {
  connect
} from 'react-redux'
import {
  selectFetchingDownloadedContent,
} from 'selectors/content'
import {
  selectDownloadedFileInfo,
} from 'selectors/file_info'
import {
  doNavigate,
} from 'actions/app'
import FileListDownloaded from './view'

const select = (state) => ({
  downloadedContent: selectDownloadedFileInfo(state),
  fetching: selectFetchingDownloadedContent(state),
})

const perform = (dispatch) => ({
  navigate: (path) => dispatch(doNavigate(path)),
})

export default connect(select, perform)(FileListDownloaded)
