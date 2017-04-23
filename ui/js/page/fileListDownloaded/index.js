import React from 'react'
import {
  connect
} from 'react-redux'
import {
  selectDownloadedContent,
} from 'selectors/content'
import FileListDownloaded from './view'

const select = (state) => ({
  downloadedContent: selectDownloadedContent(state),
})

const perform = (dispatch) => ({
})

export default connect(select, perform)(FileListDownloaded)
