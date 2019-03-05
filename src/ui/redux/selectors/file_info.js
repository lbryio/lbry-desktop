import {
  selectClaimsByUri,
  selectIsFetchingClaimListMine,
  selectMyClaims,
  selectClaimsById,
  buildURI,
} from 'lbry-redux';
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

      return (
        fileInfo &&
        myClaimIds.indexOf(fileInfo.claim_id) === -1 &&
        (fileInfo.completed || fileInfo.written_bytes)
      );
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

export const selectSearchDownloadUris = query =>
  createSelector(
    selectFileInfosDownloaded,
    selectClaimsById,
    (fileInfos, claimsById) => {
      if (!query || !fileInfos.length) {
        return null;
      }

      const queryParts = query.toLowerCase().split(' ');
      const searchQueryDictionary = {};
      queryParts.forEach(subQuery => {
        searchQueryDictionary[subQuery] = subQuery;
      });

      const arrayContainsQueryPart = array => {
        for (let i = 0; i < array.length; i += 1) {
          const subQuery = array[i];
          if (searchQueryDictionary[subQuery]) {
            return true;
          }
        }
        return false;
      };

      const downloadResultsFromQuery = [];
      fileInfos.forEach(fileInfo => {
        const { channel_name: channelName, claim_name: claimName, metadata } = fileInfo;
        const { author, description, title } = metadata;

        if (channelName) {
          const lowerCaseChannel = channelName.toLowerCase();
          const strippedOutChannelName = lowerCaseChannel.slice(1); // trim off the @
          if (searchQueryDictionary[channelName] || searchQueryDictionary[strippedOutChannelName]) {
            downloadResultsFromQuery.push(fileInfo);
            return;
          }
        }

        const nameParts = claimName.toLowerCase().split('-');
        if (arrayContainsQueryPart(nameParts)) {
          downloadResultsFromQuery.push(fileInfo);
          return;
        }

        const titleParts = title.toLowerCase().split(' ');
        if (arrayContainsQueryPart(titleParts)) {
          downloadResultsFromQuery.push(fileInfo);
          return;
        }

        if (author) {
          const authorParts = author.toLowerCase().split(' ');
          if (arrayContainsQueryPart(authorParts)) {
            downloadResultsFromQuery.push(fileInfo);
            return;
          }
        }

        if (description) {
          const descriptionParts = description.toLowerCase().split(' ');
          if (arrayContainsQueryPart(descriptionParts)) {
            downloadResultsFromQuery.push(fileInfo);
          }
        }
      });

      return downloadResultsFromQuery.length
        ? downloadResultsFromQuery.map(fileInfo => {
            const {
              channel_name: channelName,
              claim_id: claimId,
              claim_name: claimName,
            } = fileInfo;

            const uriParams = {};

            if (channelName) {
              const claim = claimsById[claimId];
              if (claim && claim.value) {
                uriParams.claimId = claim.value.publisherSignature.certificateId;
              } else {
                uriParams.claimId = claimId;
              }
              uriParams.channelName = channelName;
              uriParams.contentName = claimName;
            } else {
              uriParams.claimId = claimId;
              uriParams.claimName = claimName;
            }

            const uri = buildURI(uriParams);
            return uri;
          })
        : null;
    }
  );

export const selectFileInfoErrors = createSelector(
  selectState,
  state => state.errors || {}
);
