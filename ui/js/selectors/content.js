import { createSelector } from 'reselect'
import {
  selectDaemonReady,
  selectCurrentPage,
  selectCurrentUri,
} from 'selectors/app'

export const _selectState = state => state.content || {}

export const selectFeaturedUris = createSelector(
  _selectState,
  (state) => state.featuredUris
)

export const selectFetchingFeaturedUris = createSelector(
  _selectState,
  (state) => !!state.fetchingFeaturedContent
)

export const selectFetchingFileInfos = createSelector(
  _selectState,
  (state) => state.fetchingFileInfos || {}
)

export const selectFetchingDownloadedContent = createSelector(
  _selectState,
  (state) => !!state.fetchingDownloadedContent
)

export const selectDownloadedContent = createSelector(
  _selectState,
  (state) => state.downloadedContent || {}
)

export const selectDownloadedContentFileInfos = createSelector(
  selectDownloadedContent,
  (downloadedContent) => downloadedContent.fileInfos || []
)

export const selectFetchingPublishedContent = createSelector(
  _selectState,
  (state) => !!state.fetchingPublishedContent
)

export const selectPublishedContent = createSelector(
  _selectState,
  (state) => state.publishedContent || {}
)


export const selectResolvingUris = createSelector(
  _selectState,
  (state) => state.resolvingUris || []
)

const selectResolvingUri = (state, props) => {
  return selectResolvingUris(state).indexOf(props.uri) != -1
}

export const makeSelectResolvingUri = () => {
  return createSelector(
    selectResolvingUri,
    (resolving) => resolving
  )
}
