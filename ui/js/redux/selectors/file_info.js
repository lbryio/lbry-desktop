import lbry from "lbry";
import { createSelector } from "reselect";
import {
  selectClaimsByUri,
  selectIsFetchingClaimListMine,
  selectMyClaims,
  selectMyClaimSdHashesByOutpoint,
} from "redux/selectors/claims";

export const _selectState = state => state.fileInfo || {};

export const selectFileInfosBySdHash = createSelector(
  _selectState,
  state => state.bySdHash || {}
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

export const makeSelectFileInfoForUri = uri => {
  return createSelector(
    selectClaimsByUri,
    selectFileInfosBySdHash,
    (claims, bySdHash) => {
      const claim = claims[uri];
      const sd_hash = claim ? claim.value.stream.source.source : undefined;

      return sd_hash ? bySdHash[sd_hash] : undefined;
    }
  );
};

export const selectDownloadingBySdHash = createSelector(
  _selectState,
  state => state.downloadingBySdHash || {}
);

export const makeSelectDownloadingForUri = uri => {
  return createSelector(
    selectDownloadingBySdHash,
    makeSelectFileInfoForUri(uri),
    (bySdHash, fileInfo) => {
      if (!fileInfo) return false;
      return bySdHash[fileInfo.sd_hash];
    }
  );
};

export const selectUrisLoading = createSelector(
  _selectState,
  state => state.urisLoading || {}
);

export const makeSelectLoadingForUri = uri => {
  return createSelector(selectUrisLoading, byUri => byUri && byUri[uri]);
};

export const selectFetchingSdHash = createSelector(
  _selectState,
  state => state.fetching || {}
);

export const selectFileInfosPendingPublish = createSelector(
  _selectState,
  state => Object.values(state.pendingBySdHash || {})
);

export const selectFileInfosDownloaded = createSelector(
  selectFileInfosBySdHash,
  selectMyClaims,
  (bySdHash, myClaims) => {
    return Object.values(bySdHash).filter(fileInfo => {
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
  selectFileInfosBySdHash,
  selectMyClaimSdHashesByOutpoint,
  selectFileInfosPendingPublish,
  (bySdHash, sdHashesByOutpoint, pendingPublish) => {
    const fileInfos = [];

    Object.keys(sdHashesByOutpoint).forEach(outpoint => {
      const fileInfo = bySdHash[sdHashesByOutpoint[outpoint]];
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
  selectFileInfosBySdHash,
  (claimsByUri, bySdHash) => {
    const fileInfos = {};
    const uris = Object.keys(claimsByUri);

    uris.forEach(uri => {
      const claim = claimsByUri[uri];
      if (claim) {
        const sd_hash = claim.value.stream.source.source;
        const fileInfo = bySdHash[sd_hash];

        if (fileInfo) fileInfos[uri] = fileInfo;
      }
    });
    return fileInfos;
  }
);

export const selectDownloadingFileInfos = createSelector(
  selectDownloadingBySdHash,
  selectFileInfosBySdHash,
  (downloadingBySdHash, fileInfosBySdHash) => {
    const sd_hashes = Object.keys(downloadingBySdHash);
    const fileInfos = [];

    sd_hashes.forEach(sd_hash => {
      const fileInfo = fileInfosBySdHash[sd_hash];

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
