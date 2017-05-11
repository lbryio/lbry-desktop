import React from 'react'
import {
  connect
} from 'react-redux'
import {
  doFetchPublishedContent,
} from 'actions/content'
import {
  selectFetchingPublishedContent,
} from 'selectors/content'
import {
  selectPublishedFileInfo,
} from 'selectors/file_info'
import {
  doNavigate,
} from 'actions/app'
import FileListPublished from './view'

const select = (state) => ({
  publishedContent: selectPublishedFileInfo(state),
  fetching: selectFetchingPublishedContent(state),
})

const perform = (dispatch) => ({
  navigate: (path) => dispatch(doNavigate(path)),
  fetchFileListPublished: () => dispatch(doFetchPublishedContent()),
})

export default connect(select, perform)(FileListPublished)
