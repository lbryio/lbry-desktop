import lbry from "lbry";
import { createSelector } from "reselect";
import {
  selectClaimsByUri,
  selectIsFetchingClaimListMine,
  selectMyClaims,
  selectMyClaimsOutpoints,
} from "selectors/claims";

export const _selectState = state => state.fileInfo || {};

export const selectFileInfosByOutpoint = createSelector(
  _selectState,
  state => state.byOutpoint || {}
);

export const selectIsFetchingFileList = createSelector(
  _selectState,
  state => !!state.isFetchingFileList
);

export const selectIsFetchingFileListDownloadedOrPublished = createSelector(
  selectIsFetchingFileList,
  selectIsFetchingClaimListMine,
  (isFetchingFileList, isFetchingClaimListMine) =>
    isFetchingFileList || isFetchingClaimListMine
);

export const selectFileInfoForUri = (state, props) => {
  const claims = selectClaimsByUri(state),
    claim = claims[props.uri],
    byOutpoint = selectFileInfosByOutpoint(state),
    outpoint = claim ? `${claim.txid}:${claim.nout}` : undefined;

  return outpoint ? byOutpoint[outpoint] : undefined;
};

export const makeSelectFileInfoForUri = () => {
  return createSelector(selectFileInfoForUri, fileInfo => fileInfo);
};

export const selectDownloadingByOutpoint = createSelector(
  _selectState,
  state => state.downloadingByOutpoint || {}
);

const selectDownloadingForUri = (state, props) => {
  const byOutpoint = selectDownloadingByOutpoint(state);
  const fileInfo = selectFileInfoForUri(state, props);

  if (!fileInfo) return false;

  return byOutpoint[fileInfo.outpoint];
};

export const makeSelectDownloadingForUri = () => {
  return createSelector(
    selectDownloadingForUri,
    downloadingForUri => !!downloadingForUri
  );
};

export const selectUrisLoading = createSelector(
  _selectState,
  state => state.urisLoading || {}
);

const selectLoadingForUri = (state, props) => {
  const byUri = selectUrisLoading(state);
  return byUri[props.uri];
};

export const makeSelectLoadingForUri = () => {
  return createSelector(selectLoadingForUri, loading => !!loading);
};

export const selectFileInfosPendingPublish = createSelector(
  _selectState,
  state => Object.values(state.pendingByOutpoint || {})
);

export const selectFileInfosDownloaded = createSelector(
  selectFileInfosByOutpoint,
  selectMyClaims,
  (byOutpoint, myClaims) => {
    return Object.values(byOutpoint).filter(fileInfo => {
      const myClaimIds = myClaims.map(claim => claim.claim_id);

      return (
        fileInfo &&
        myClaimIds.indexOf(fileInfo.claim_id) === -1 &&
        (fileInfo.completed || fileInfo.written_bytes)
      );
    });
  }
);

export const selectFileInfosPublished = createSelector(
  selectFileInfosByOutpoint,
  selectMyClaimsOutpoints,
  selectFileInfosPendingPublish,
  (byOutpoint, outpoints, pendingPublish) => {
    const fileInfos = [];
    outpoints.forEach(outpoint => {
      const fileInfo = byOutpoint[outpoint];
      if (fileInfo) fileInfos.push(fileInfo);
    });
    return [...fileInfos, ...pendingPublish];
  }
);

// export const selectFileInfoForUri = (state, props) => {
//   const claims = selectClaimsByUri(state),
//     claim = claims[props.uri],
//     fileInfos = selectAllFileInfos(state),
//     outpoint = claim ? `${claim.txid}:${claim.nout}` : undefined;

//   return outpoint && fileInfos ? fileInfos[outpoint] : undefined;
// };

export const selectFileInfosByUri = createSelector(
  selectClaimsByUri,
  selectFileInfosByOutpoint,
  (claimsByUri, byOutpoint) => {
    const fileInfos = {};
    const uris = Object.keys(claimsByUri);

    uris.forEach(uri => {
      const claim = claimsByUri[uri];
      if (claim) {
        const outpoint = `${claim.txid}:${claim.nout}`;
        const fileInfo = byOutpoint[outpoint];

        if (fileInfo) fileInfos[uri] = fileInfo;
      }
    });
    return fileInfos;
  }
);

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
      progress.push(fileInfo.written_bytes / fileInfo.total_bytes * 100);
    });

    const totalProgress = progress.reduce((a, b) => a + b, 0);

    if (fileInfos.length > 0) return totalProgress / fileInfos.length / 100.0;
    else return -1;
  }
);
