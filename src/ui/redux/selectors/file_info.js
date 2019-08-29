import { selectClaimsByUri, selectIsFetchingClaimListMine, selectMyClaims, selectClaimsById } from 'lbry-redux';
import { createSelector } from 'reselect';

export const selectState = state => state.fileInfo || {};

export const selectFileInfosByOutpoint = createSelector(
  selectState,
  state => state.byOutpoint || {}
);

export const selectIsFetchingFileList = createSelector(
  selectState,
  state => state.isFetchingFileList
);

export const selectIsFetchingFileListDownloadedOrPublished = createSelector(
  selectIsFetchingFileList,
  selectIsFetchingClaimListMine,
  (isFetchingFileList, isFetchingClaimListMine) => isFetchingFileList || isFetchingClaimListMine
);

export const makeSelectFileInfoForUri = uri =>
  createSelector(
    selectClaimsByUri,
    selectFileInfosByOutpoint,
    (claims, byOutpoint) => {
      const claim = claims[uri];
      const outpoint = claim ? `${claim.txid}:${claim.nout}` : undefined;
      return outpoint ? byOutpoint[outpoint] : undefined;
    }
  );

export const selectDownloadingByOutpoint = createSelector(
  selectState,
  state => state.downloadingByOutpoint || {}
);

export const makeSelectDownloadingForUri = uri =>
  createSelector(
    selectDownloadingByOutpoint,
    makeSelectFileInfoForUri(uri),
    (byOutpoint, fileInfo) => {
      if (!fileInfo) return false;
      return byOutpoint[fileInfo.outpoint];
    }
  );

export const selectUrisLoading = createSelector(
  selectState,
  state => state.urisLoading || {}
);

export const makeSelectLoadingForUri = uri =>
  createSelector(
    selectUrisLoading,
    byUri => byUri && byUri[uri]
  );

export const selectFileInfosDownloaded = createSelector(
  selectFileInfosByOutpoint,
  selectMyClaims,
  (byOutpoint, myClaims) =>
    Object.values(byOutpoint).filter(fileInfo => {
      const myClaimIds = myClaims.map(claim => claim.claim_id);

      return fileInfo && myClaimIds.indexOf(fileInfo.claim_id) === -1 && (fileInfo.completed || fileInfo.written_bytes);
    })
);

// export const selectFileInfoForUri = (state, props) => {
//   const claims = selectClaimsByUri(state),
//     claim = claims[props.uri],
//     fileInfos = selectAllFileInfos(state),
//     outpoint = claim ? `${claim.txid}:${claim.nout}` : undefined;

//   return outpoint && fileInfos ? fileInfos[outpoint] : undefined;
// };

export const selectDownloadingFileInfos = createSelector(
  selectDownloadingByOutpoint,
  selectFileInfosByOutpoint,
  (downloadingByOutpoint, fileInfosByOutpoint) => {
    const outpoints = Object.keys(downloadingByOutpoint);
    const fileInfos = [];

    outpoints.forEach(outpoint => {
      const fileInfo = fileInfosByOutpoint[outpoint];

      if (fileInfo) fileInfos.push(fileInfo);
    });

    return fileInfos;
  }
);

export const selectTotalDownloadProgress = createSelector(
  selectDownloadingFileInfos,
  fileInfos => {
    const progress = [];

    fileInfos.forEach(fileInfo => {
      progress.push((fileInfo.written_bytes / fileInfo.total_bytes) * 100);
    });

    const totalProgress = progress.reduce((a, b) => a + b, 0);

    if (fileInfos.length > 0) return totalProgress / fileInfos.length / 100.0;
    return -1;
  }
);

export const selectFileInfoErrors = createSelector(
  selectState,
  state => state.errors || {}
);
