import { createSelector } from 'reselect';
import {
  selectClaimsByUri,
  selectIsFetchingClaimListMine,
  selectMyClaims,
  makeSelectContentTypeForUri,
  makeSelectClaimForUri,
} from 'redux/selectors/claims';
import { buildURI } from 'util/lbryURI';
import Lbry from 'lbry';
import { PAGE_SIZE } from 'constants/claim';

export const selectState = (state) => state.fileInfo || {};

export const selectFileInfosByOutpoint = createSelector(selectState, (state) => state.byOutpoint || {});

export const selectIsFetchingFileList = (state) => selectState(state).isFetchingFileList;

export const selectIsFetchingFileListDownloadedOrPublished = createSelector(
  selectIsFetchingFileList,
  selectIsFetchingClaimListMine,
  (isFetchingFileList, isFetchingClaimListMine) => isFetchingFileList || isFetchingClaimListMine
);

export const makeSelectFileInfoForUri = (uri) =>
  createSelector(selectClaimsByUri, selectFileInfosByOutpoint, (claims, byOutpoint) => {
    const claim = claims[uri];
    const outpoint = claim ? `${claim.txid}:${claim.nout}` : undefined;
    return outpoint ? byOutpoint[outpoint] : undefined;
  });

export const selectDownloadingByOutpoint = createSelector(selectState, (state) => state.downloadingByOutpoint || {});

export const makeSelectDownloadingForUri = (uri) =>
  createSelector(selectDownloadingByOutpoint, makeSelectFileInfoForUri(uri), (byOutpoint, fileInfo) => {
    if (!fileInfo) return false;
    return byOutpoint[fileInfo.outpoint];
  });

export const selectUrisLoading = createSelector(selectState, (state) => state.urisLoading || {});

export const makeSelectLoadingForUri = (uri) =>
  createSelector(selectUrisLoading, makeSelectClaimForUri(uri), (fetchingByOutpoint, claim) => {
    if (!claim) {
      return false;
    }

    const { txid, nout } = claim;
    const outpoint = `${txid}:${nout}`;
    const isFetching = fetchingByOutpoint[outpoint];
    return isFetching;
  });

export const selectFileInfosDownloaded = createSelector(
  selectFileInfosByOutpoint,
  selectMyClaims,
  (byOutpoint, myClaims) =>
    Object.values(byOutpoint).filter((fileInfo) => {
      const myClaimIds = myClaims.map((claim) => claim.claim_id);

      return fileInfo && myClaimIds.indexOf(fileInfo.claim_id) === -1 && (fileInfo.completed || fileInfo.written_bytes);
    })
);

export const selectDownloadingFileInfos = createSelector(
  selectDownloadingByOutpoint,
  selectFileInfosByOutpoint,
  (downloadingByOutpoint, fileInfosByOutpoint) => {
    const outpoints = Object.keys(downloadingByOutpoint);
    const fileInfos = [];

    outpoints.forEach((outpoint) => {
      const fileInfo = fileInfosByOutpoint[outpoint];

      if (fileInfo) fileInfos.push(fileInfo);
    });

    return fileInfos;
  }
);

export const selectTotalDownloadProgress = createSelector(selectDownloadingFileInfos, (fileInfos) => {
  const progress = [];

  fileInfos.forEach((fileInfo) => {
    progress.push((fileInfo.written_bytes / fileInfo.total_bytes) * 100);
  });

  const totalProgress = progress.reduce((a, b) => a + b, 0);

  if (fileInfos.length > 0) return totalProgress / fileInfos.length / 100.0;
  return -1;
});

export const selectFileInfoErrors = createSelector(selectState, (state) => state.errors || {});

export const selectFileListPublishedSort = (state) => selectState(state).fileListPublishedSort;
export const selectFileListDownloadedSort = (state) => selectState(state).fileListDownloadedSort;

export const selectDownloadedUris = createSelector(
  selectFileInfosDownloaded,
  // We should use permament_url but it doesn't exist in file_list
  (info) => info.slice().map((claim) => `lbry://${claim.claim_name}#${claim.claim_id}`)
);

export const makeSelectMediaTypeForUri = (uri) =>
  createSelector(makeSelectFileInfoForUri(uri), makeSelectContentTypeForUri(uri), (fileInfo, contentType) => {
    if (!fileInfo && !contentType) {
      return undefined;
    }

    const fileName = fileInfo && fileInfo.file_name;
    return Lbry.getMediaType(contentType, fileName);
  });

export const makeSelectUriIsStreamable = (uri) =>
  createSelector(makeSelectMediaTypeForUri(uri), (mediaType) => {
    const isStreamable = ['audio', 'video', 'image'].indexOf(mediaType) !== -1;
    return isStreamable;
  });

export const makeSelectDownloadPathForUri = (uri) =>
  createSelector(makeSelectFileInfoForUri(uri), (fileInfo) => {
    return fileInfo && fileInfo.download_path;
  });

export const makeSelectFilePartlyDownloaded = (uri) =>
  createSelector(makeSelectFileInfoForUri(uri), (fileInfo) => {
    if (!fileInfo) {
      return false;
    }

    return fileInfo.written_bytes > 0 || fileInfo.blobs_completed > 0;
  });

export const makeSelectFileNameForUri = (uri) =>
  createSelector(makeSelectFileInfoForUri(uri), (fileInfo) => {
    return fileInfo && fileInfo.file_name;
  });

export const selectDownloadUrlsCount = createSelector(selectDownloadedUris, (uris) => uris.length);

function filterFileInfos(fileInfos, query) {
  if (query) {
    const queryMatchRegExp = new RegExp(query, 'i');
    return fileInfos.filter((fileInfo) => {
      const { metadata } = fileInfo;

      return (
        (metadata.title && metadata.title.match(queryMatchRegExp)) ||
        (fileInfo.channel_name && fileInfo.channel_name.match(queryMatchRegExp)) ||
        (fileInfo.claim_name && fileInfo.claim_name.match(queryMatchRegExp))
      );
    });
  }

  return fileInfos;
}

export const makeSelectSearchDownloadUrlsForPage = (query, page = 1) =>
  createSelector(selectFileInfosDownloaded, (fileInfos) => {
    const matchingFileInfos = filterFileInfos(fileInfos, query);
    const start = (Number(page) - 1) * Number(PAGE_SIZE);
    const end = Number(page) * Number(PAGE_SIZE);

    return matchingFileInfos && matchingFileInfos.length
      ? matchingFileInfos.slice(start, end).map((fileInfo) =>
          buildURI({
            streamName: fileInfo.claim_name,
            channelName: fileInfo.channel_name,
            channelClaimId: fileInfo.channel_claim_id,
          })
        )
      : [];
  });

export const makeSelectSearchDownloadUrlsCount = (query) =>
  createSelector(selectFileInfosDownloaded, (fileInfos) => {
    return fileInfos && fileInfos.length ? filterFileInfos(fileInfos, query).length : 0;
  });

export const makeSelectStreamingUrlForUri = (uri) =>
  createSelector(makeSelectFileInfoForUri(uri), (fileInfo) => {
    return fileInfo && fileInfo.streaming_url;
  });
