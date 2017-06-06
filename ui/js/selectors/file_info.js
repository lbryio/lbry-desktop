import lbry from "lbry";
import { createSelector } from "reselect";
import {
  selectClaimsByUri,
  selectClaimListMineIsPending,
  selectMyClaimsOutpoints,
} from "selectors/claims";

export const _selectState = state => state.fileInfo || {};

export const selectAllFileInfos = createSelector(
  _selectState,
  state => state.fileInfos || {}
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
    fileInfos = selectAllFileInfos(state),
    outpoint = claim ? `${claim.txid}:${claim.nout}` : undefined;

  return outpoint && fileInfos ? fileInfos[outpoint] : undefined;
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

export const selectFileInfosDownloaded = createSelector(
  selectAllFileInfos,
  selectMyClaimsOutpoints,
  (fileInfos, myClaimOutpoints) => {
    const fileInfoList = [];
    Object.values(fileInfos).forEach(fileInfo => {
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

export const selectFileInfosPendingPublish = createSelector(
  _selectState,
  state => {
    return lbry.getPendingPublishes();
  }
);

export const selectFileInfosPublished = createSelector(
  selectAllFileInfos,
  selectFileInfosPendingPublish,
  selectMyClaimsOutpoints,
  (allFileInfos, pendingFileInfos, outpoints) => {
    const fileInfos = [];
    outpoints.forEach(outpoint => {
      if (allFileInfos[outpoint]) {
        fileInfos.push(allFileInfos[outpoint]);
      }
    });
    return [...fileInfos, ...pendingFileInfos];
  }
);
