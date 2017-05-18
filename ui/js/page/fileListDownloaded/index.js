import React from 'react'
import {
  connect
} from 'react-redux'
import {
  doFetchFileInfosAndPublishedClaims,
} from 'actions/file_info'
import {
  selectFileInfosDownloaded,
  selectFileListDownloadedOrPublishedIsPending,
} from 'selectors/file_info'
import {
  doNavigate,
} from 'actions/app'
import FileListDownloaded from './view'

const select = (state) => ({
  fileInfos: selectFileInfosDownloaded(state),
  isPending: selectFileListDownloadedOrPublishedIsPending(state),
})

const perform = (dispatch) => ({
  navigate: (path) => dispatch(doNavigate(path)),
  fetchFileInfosDownloaded: () => dispatch(doFetchFileInfosAndPublishedClaims()),
})

export default connect(select, perform)(FileListDownloaded)
