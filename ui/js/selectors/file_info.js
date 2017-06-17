import lbry from "lbry";
import { createSelector } from "reselect";
import {
  selectClaimsByUri,
  selectClaimListMineIsPending,
  selectMyClaimsOutpoints,
} from "selectors/claims";

export const _selectState = state => state.fileInfo || {};

export const selectFileInfosByOutpoint = createSelector(
  _selectState,
  state => state.byOutpoint || {}
);

export const selectFileListIsPending = createSelector(
  _selectState,
  state => state.isFileListPending
);

export const selectFileListDownloadedOrPublishedIsPending = createSelector(
  selectFileListIsPending,
  selectClaimListMineIsPending,
  (isFileListPending, isClaimListMinePending) =>
    isFileListPending || isClaimListMinePending
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

export const selectUrisDownloading = createSelector(
  _selectState,
  state => state.urisDownloading || {}
);

const selectDownloadingForUri = (state, props) => {
  const byUri = selectUrisDownloading(state);
  return byUri[props.uri];
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
  selectMyClaimsOutpoints,
  (byOutpoint, myClaimOutpoints) => {
    const fileInfoList = [];
    Object.values(byOutpoint).forEach(fileInfo => {
      if (
        fileInfo &&
        myClaimOutpoints.indexOf(fileInfo.outpoint) === -1 &&
        (fileInfo.completed || fileInfo.written_bytes)
      ) {
        fileInfoList.push(fileInfo);
      }
    });
    return fileInfoList;
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
    return fileInfos;
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
  selectUrisDownloading,
  selectFileInfosByUri,
  (urisDownloading, byUri) => {
    const uris = Object.keys(urisDownloading);
    const fileInfos = [];

    uris.forEach(uri => {
      const fileInfo = byUri[uri];

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
