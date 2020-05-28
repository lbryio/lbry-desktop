// @flow
import { normalizeURI, buildURI, parseURI } from 'lbryURI';
import {
  selectResolvedSearchResultsByQuery,
  selectSearchUrisByQuery,
} from 'redux/selectors/search';
import { selectSupportsByOutpoint } from 'redux/selectors/wallet';
import { createSelector } from 'reselect';
import { isClaimNsfw, createNormalizedClaimSearchKey, filterClaims } from 'util/claim';
import { getSearchQueryString } from 'util/query-params';
import { PAGE_SIZE } from 'constants/claim';

const selectState = state => state.claims || {};

export const selectClaimsById = createSelector(
  selectState,
  state => state.byId || {}
);

export const selectClaimIdsByUri = createSelector(
  selectState,
  state => state.claimsByUri || {}
);

export const selectCurrentChannelPage = createSelector(
  selectState,
  state => state.currentChannelPage || 1
);

export const selectCreatingChannel = createSelector(
  selectState,
  state => state.creatingChannel
);

export const selectCreateChannelError = createSelector(
  selectState,
  state => state.createChannelError
);

export const selectRepostLoading = createSelector(
  selectState,
  state => state.repostLoading
);

export const selectRepostError = createSelector(
  selectState,
  state => state.repostError
);

export const selectClaimsByUri = createSelector(
  selectState,
  selectClaimsById,
  (state, byId) => {
    const byUri = state.claimsByUri || {};
    const claims = {};

    Object.keys(byUri).forEach(uri => {
      const claimId = byUri[uri];

      // NOTE returning a null claim allows us to differentiate between an
      // undefined (never fetched claim) and one which just doesn't exist. Not
      // the cleanest solution but couldn't think of anything better right now
      if (claimId === null) {
        claims[uri] = null;
      } else {
        claims[uri] = byId[claimId];
      }
    });

    return claims;
  }
);

export const selectAllClaimsByChannel = createSelector(
  selectState,
  state => state.paginatedClaimsByChannel || {}
);

export const selectPendingById = createSelector(
  selectState,
  state => state.pendingById || {}
);

export const selectPendingClaims = createSelector(
  selectState,
  state => Object.values(state.pendingById || [])
);

export const makeSelectClaimIsPending = (uri: string) =>
  createSelector(
    selectPendingById,
    pendingById => {
      let claimId;

      try {
        const { isChannel, channelClaimId, streamClaimId } = parseURI(uri);
        claimId = isChannel ? channelClaimId : streamClaimId;
      } catch (e) {}

      if (claimId) {
        return Boolean(pendingById[claimId]);
      }
    }
  );

export const makeSelectPendingByUri = (uri: string) =>
  createSelector(
    selectPendingById,
    pendingById => {
      const { isChannel, channelClaimId, streamClaimId } = parseURI(uri);
      const claimId = isChannel ? channelClaimId : streamClaimId;
      return pendingById[claimId];
    }
  );
export const selectReflectingById = createSelector(
  selectState,
  state => state.reflectingById
);

export const makeSelectClaimForUri = (uri: string, returnRepost: boolean = true) =>
  createSelector(
    selectClaimsByUri,
    selectPendingById,
    (byUri, pendingById) => {
      // Check if a claim is pending first
      // It won't be in claimsByUri because resolving it will return nothing

      let valid;
      let channelClaimId;
      let streamClaimId;
      let isChannel;
      try {
        ({ isChannel, channelClaimId, streamClaimId } = parseURI(uri));
        valid = true;
      } catch (e) {}

      if (valid && byUri) {
        const claimId = isChannel ? channelClaimId : streamClaimId;
        const pendingClaim = pendingById[claimId];

        if (pendingClaim) {
          return pendingClaim;
        }

        const claim = byUri[normalizeURI(uri)];
        if (claim === undefined || claim === null) {
          // Make sure to return the claim as is so apps can check if it's been resolved before (null) or still needs to be resolved (undefined)
          return claim;
        }

        const repostedClaim = claim.reposted_claim;
        if (repostedClaim && returnRepost) {
          const channelUrl = claim.signing_channel && claim.signing_channel.canonical_url;

          return {
            ...repostedClaim,
            repost_url: uri,
            repost_channel_url: channelUrl,
          };
        } else {
          return claim;
        }
      }
    }
  );

export const selectMyClaimsRaw = createSelector(
  selectState,
  selectClaimsById,
  (state, byId) => {
    const ids = state.myClaims;
    if (!ids) {
      return ids;
    }

    const claims = [];
    ids.forEach(id => {
      if (byId[id]) {
        // I'm not sure why this check is necessary, but it ought to be a quick fix for https://github.com/lbryio/lbry-desktop/issues/544
        claims.push(byId[id]);
      }
    });
    return claims;
  }
);

export const selectAbandoningIds = createSelector(
  selectState,
  state => Object.keys(state.abandoningById || {})
);

export const selectMyActiveClaims = createSelector(
  selectMyClaimsRaw,
  selectAbandoningIds,
  (claims, abandoningIds) =>
    new Set(
      claims &&
        claims
          .map(claim => claim.claim_id)
          .filter(claimId => Object.keys(abandoningIds).indexOf(claimId) === -1)
    )
);

export const makeSelectClaimIsMine = (rawUri: string) => {
  let uri;
  try {
    uri = normalizeURI(rawUri);
  } catch (e) {}

  return createSelector(
    selectClaimsByUri,
    selectMyActiveClaims,
    (claims, myClaims) => {
      try {
        parseURI(uri);
      } catch (e) {
        return false;
      }

      return (
        claims &&
        claims[uri] &&
        (claims[uri].is_my_output || (claims[uri].claim_id && myClaims.has(claims[uri].claim_id)))
      );
    }
  );
};

export const selectMyPurchases = createSelector(
  selectState,
  state => state.myPurchases
);

export const selectPurchaseUriSuccess = createSelector(
  selectState,
  state => state.purchaseUriSuccess
);

export const selectMyPurchasesCount = createSelector(
  selectState,
  state => state.myPurchasesPageTotalResults
);

export const selectIsFetchingMyPurchases = createSelector(
  selectState,
  state => state.fetchingMyPurchases
);

export const selectFetchingMyPurchasesError = createSelector(
  selectState,
  state => state.fetchingMyPurchasesError
);

export const makeSelectMyPurchasesForPage = (query: ?string, page: number = 1) =>
  createSelector(
    selectMyPurchases,
    selectClaimsByUri,
    (myPurchases: Array<string>, claimsByUri: { [string]: Claim }) => {
      if (!myPurchases) {
        return undefined;
      }

      const fileInfos = myPurchases.map(uri => claimsByUri[uri]);
      const matchingFileInfos = filterClaims(fileInfos, query);
      const start = (Number(page) - 1) * Number(PAGE_SIZE);
      const end = Number(page) * Number(PAGE_SIZE);
      return matchingFileInfos && matchingFileInfos.length
        ? matchingFileInfos
          .slice(start, end)
          .map(fileInfo => fileInfo.canonical_url || fileInfo.permanent_url)
        : [];
    }
  );

export const makeSelectClaimWasPurchased = (uri: string) =>
  createSelector(
    makeSelectClaimForUri(uri),
    claim => {
      return claim && claim.purchase_receipt !== undefined;
    }
  );

export const selectAllFetchingChannelClaims = createSelector(
  selectState,
  state => state.fetchingChannelClaims || {}
);

export const makeSelectFetchingChannelClaims = (uri: string) =>
  createSelector(
    selectAllFetchingChannelClaims,
    fetching => fetching && fetching[uri]
  );

export const makeSelectClaimsInChannelForPage = (uri: string, page?: number) =>
  createSelector(
    selectClaimsById,
    selectAllClaimsByChannel,
    (byId, allClaims) => {
      const byChannel = allClaims[uri] || {};
      const claimIds = byChannel[page || 1];

      if (!claimIds) return claimIds;

      return claimIds.map(claimId => byId[claimId]);
    }
  );

export const makeSelectTotalClaimsInChannelSearch = (uri: string) =>
  createSelector(
    selectClaimsById,
    selectAllClaimsByChannel,
    (byId, allClaims) => {
      const byChannel = allClaims[uri] || {};
      return byChannel['itemCount'];
    }
  );

export const makeSelectTotalPagesInChannelSearch = (uri: string) =>
  createSelector(
    selectClaimsById,
    selectAllClaimsByChannel,
    (byId, allClaims) => {
      const byChannel = allClaims[uri] || {};
      return byChannel['pageCount'];
    }
  );

export const makeSelectClaimsInChannelForCurrentPageState = (uri: string) =>
  createSelector(
    selectClaimsById,
    selectAllClaimsByChannel,
    selectCurrentChannelPage,
    (byId, allClaims, page) => {
      const byChannel = allClaims[uri] || {};
      const claimIds = byChannel[page || 1];

      if (!claimIds) return claimIds;

      return claimIds.map(claimId => byId[claimId]);
    }
  );

export const makeSelectMetadataForUri = (uri: string) =>
  createSelector(
    makeSelectClaimForUri(uri),
    claim => {
      const metadata = claim && claim.value;
      return metadata || (claim === undefined ? undefined : null);
    }
  );

export const makeSelectMetadataItemForUri = (uri: string, key: string) =>
  createSelector(
    makeSelectMetadataForUri(uri),
    (metadata: ChannelMetadata | StreamMetadata) => {
      return metadata ? metadata[key] : undefined;
    }
  );

export const makeSelectTitleForUri = (uri: string) =>
  createSelector(
    makeSelectMetadataForUri(uri),
    metadata => metadata && metadata.title
  );

export const makeSelectDateForUri = (uri: string) =>
  createSelector(
    makeSelectClaimForUri(uri),
    claim => {
      const timestamp =
        claim &&
        claim.value &&
        (claim.value.release_time
          ? claim.value.release_time * 1000
          : claim.meta && claim.meta.creation_timestamp
            ? claim.meta.creation_timestamp * 1000
            : null);
      if (!timestamp) {
        return undefined;
      }
      const dateObj = new Date(timestamp);
      return dateObj;
    }
  );

export const makeSelectAmountForUri = (uri: string) =>
  createSelector(
    makeSelectClaimForUri(uri),
    claim => {
      return claim && claim.amount;
    }
  );

export const makeSelectContentTypeForUri = (uri: string) =>
  createSelector(
    makeSelectClaimForUri(uri),
    claim => {
      const source = claim && claim.value && claim.value.source;
      return source ? source.media_type : undefined;
    }
  );

export const makeSelectThumbnailForUri = (uri: string) =>
  createSelector(
    makeSelectClaimForUri(uri),
    claim => {
      const thumbnail = claim && claim.value && claim.value.thumbnail;
      return thumbnail && thumbnail.url
        ? thumbnail.url.trim().replace(/^http:\/\//i, 'https://')
        : undefined;
    }
  );

export const makeSelectCoverForUri = (uri: string) =>
  createSelector(
    makeSelectClaimForUri(uri),
    claim => {
      const cover = claim && claim.value && claim.value.cover;
      return cover && cover.url ? cover.url.trim().replace(/^http:\/\//i, 'https://') : undefined;
    }
  );

export const selectIsFetchingClaimListMine = createSelector(
  selectState,
  state => state.isFetchingClaimListMine
);

export const selectMyClaimsPage = createSelector(
  selectState,
  state => state.myClaimsPageResults || []
);

export const selectMyClaimsPageNumber = createSelector(
  selectState,
  state => (state.claimListMinePage && state.claimListMinePage.items) || [],

  state => (state.txoPage && state.txoPage.page) || 1
);

export const selectMyClaimsPageItemCount = createSelector(
  selectState,
  state => state.myClaimsPageTotalResults || 1
);

export const selectFetchingMyClaimsPageError = createSelector(
  selectState,
  state => state.fetchingClaimListMinePageError
);

export const selectMyClaims = createSelector(
  selectMyActiveClaims,
  selectClaimsById,
  selectAbandoningIds,
  selectPendingClaims,
  (myClaimIds, byId, abandoningIds, pendingClaims) => {
    const claims = [];

    myClaimIds.forEach(id => {
      const claim = byId[id];

      if (claim && abandoningIds.indexOf(id) === -1) claims.push(claim);
    });

    return [...claims, ...pendingClaims];
  }
);

export const selectMyClaimsWithoutChannels = createSelector(
  selectMyClaims,
  myClaims =>
    myClaims.filter(claim => !claim.name.match(/^@/)).sort((a, b) => a.timestamp - b.timestamp)
);

export const selectMyClaimUrisWithoutChannels = createSelector(
  selectMyClaimsWithoutChannels,
  myClaims => {
    return myClaims
      .sort((a, b) => {
        if (a.height < 1) {
          return -1;
        } else if (b.height < 1) {
          return 1;
        } else {
          return b.timestamp - a.timestamp;
        }
      })
      .map(claim => {
        return claim.canonical_url || claim.permanent_url;
      });
  }
);

export const selectAllMyClaimsByOutpoint = createSelector(
  selectMyClaimsRaw,
  claims =>
    new Set(claims && claims.length ? claims.map(claim => `${claim.txid}:${claim.nout}`) : null)
);

export const selectMyClaimsOutpoints = createSelector(
  selectMyClaims,
  myClaims => {
    const outpoints = [];

    myClaims.forEach(claim => outpoints.push(`${claim.txid}:${claim.nout}`));

    return outpoints;
  }
);

export const selectFetchingMyChannels = createSelector(
  selectState,
  state => state.fetchingMyChannels
);

export const selectMyChannelClaims = createSelector(
  selectState,
  selectClaimsById,
  (state, byId) => {
    const ids = state.myChannelClaims;
    if (!ids) {
      return ids;
    }

    const claims = [];
    ids.forEach(id => {
      if (byId[id]) {
        // I'm not sure why this check is necessary, but it ought to be a quick fix for https://github.com/lbryio/lbry-desktop/issues/544
        claims.push(byId[id]);
      }
    });

    return claims;
  }
);

export const selectResolvingUris = createSelector(
  selectState,
  state => state.resolvingUris || []
);

export const selectChannelImportPending = createSelector(
  selectState,
  state => state.pendingChannelImport
);

export const makeSelectIsUriResolving = (uri: string) =>
  createSelector(
    selectResolvingUris,
    resolvingUris => resolvingUris && resolvingUris.indexOf(uri) !== -1
  );

export const selectPlayingUri = createSelector(
  selectState,
  state => state.playingUri
);

export const selectChannelClaimCounts = createSelector(
  selectState,
  state => state.channelClaimCounts || {}
);

export const makeSelectTotalItemsForChannel = (uri: string) =>
  createSelector(
    selectChannelClaimCounts,
    byUri => byUri && byUri[uri]
  );

export const makeSelectTotalPagesForChannel = (uri: string, pageSize: number = 10) =>
  createSelector(
    selectChannelClaimCounts,
    byUri => byUri && byUri[uri] && Math.ceil(byUri[uri] / pageSize)
  );

export const makeSelectNsfwCountFromUris = (uris: Array<string>) =>
  createSelector(
    selectClaimsByUri,
    claims =>
      uris.reduce((acc, uri) => {
        const claim = claims[uri];
        if (claim && isClaimNsfw(claim)) {
          return acc + 1;
        }
        return acc;
      }, 0)
  );

export const makeSelectNsfwCountForChannel = (uri: string) =>
  createSelector(
    selectClaimsById,
    selectAllClaimsByChannel,
    selectCurrentChannelPage,
    (byId, allClaims, page) => {
      const byChannel = allClaims[uri] || {};
      const claimIds = byChannel[page || 1];

      if (!claimIds) return 0;

      return claimIds.reduce((acc, claimId) => {
        const claim = byId[claimId];
        if (isClaimNsfw(claim)) {
          return acc + 1;
        }
        return acc;
      }, 0);
    }
  );

export const makeSelectOmittedCountForChannel = (uri: string) =>
  createSelector(
    makeSelectTotalItemsForChannel(uri),
    makeSelectTotalClaimsInChannelSearch(uri),
    (claimsInChannel, claimsInSearch) => {
      if (claimsInChannel && typeof claimsInSearch === 'number' && claimsInSearch >= 0) {
        return claimsInChannel - claimsInSearch;
      } else return 0;
    }
  );

export const makeSelectClaimIsNsfw = (uri: string): boolean =>
  createSelector(
    makeSelectClaimForUri(uri),
    // Eventually these will come from some list of tags that are considered adult
    // Or possibly come from users settings of what tags they want to hide
    // For now, there is just a hard coded list of tags inside `isClaimNsfw`
    // selectNaughtyTags(),
    (claim: Claim) => {
      if (!claim) {
        return false;
      }

      return isClaimNsfw(claim);
    }
  );

export const makeSelectRecommendedContentForUri = (uri: string) =>
  createSelector(
    makeSelectClaimForUri(uri),
    selectSearchUrisByQuery,
    makeSelectClaimIsNsfw(uri),
    (claim, searchUrisByQuery, isMature) => {
      const atVanityURI = !uri.includes('#');

      let recommendedContent;
      if (claim) {
        // always grab full URL - this can change once search returns canonical
        const currentUri = buildURI({ streamClaimId: claim.claim_id, streamName: claim.name });

        const { title } = claim.value;

        if (!title) {
          return;
        }

        const options: {
          related_to?: string,
          nsfw?: boolean,
          isBackgroundSearch?: boolean,
        } = { related_to: claim.claim_id, isBackgroundSearch: true };

        if (!isMature) {
          options['nsfw'] = false;
        }
        const searchQuery = getSearchQueryString(title.replace(/\//, ' '), options);

        let searchUris = searchUrisByQuery[searchQuery];
        if (searchUris) {
          searchUris = searchUris.filter(searchUri => searchUri !== currentUri);
          recommendedContent = searchUris;
        }
      }

      return recommendedContent;
    }
  );

export const makeSelectFirstRecommendedFileForUri = (uri: string) =>
  createSelector(
    makeSelectRecommendedContentForUri(uri),
    recommendedContent => (recommendedContent ? recommendedContent[0] : null)
  );

// Returns the associated channel uri for a given claim uri
// accepts a regular claim uri lbry://something
// returns the channel uri that created this claim lbry://@channel
export const makeSelectChannelForClaimUri = (uri: string, includePrefix: boolean = false) =>
  createSelector(
    makeSelectClaimForUri(uri),
    (claim: ?Claim) => {
      if (!claim || !claim.signing_channel || !claim.is_channel_signature_valid) {
        return null;
      }

      const { canonical_url: canonicalUrl, permanent_url: permanentUrl } = claim.signing_channel;

      if (canonicalUrl) {
        return includePrefix ? canonicalUrl : canonicalUrl.slice('lbry://'.length);
      } else {
        return includePrefix ? permanentUrl : permanentUrl.slice('lbry://'.length);
      }
    }
  );

export const makeSelectTagsForUri = (uri: string) =>
  createSelector(
    makeSelectMetadataForUri(uri),
    (metadata: ?GenericMetadata) => {
      return (metadata && metadata.tags) || [];
    }
  );

export const selectFetchingClaimSearchByQuery = createSelector(
  selectState,
  state => state.fetchingClaimSearchByQuery || {}
);

export const selectFetchingClaimSearch = createSelector(
  selectFetchingClaimSearchByQuery,
  fetchingClaimSearchByQuery => Boolean(Object.keys(fetchingClaimSearchByQuery).length)
);

export const selectClaimSearchByQuery = createSelector(
  selectState,
  state => state.claimSearchByQuery || {}
);

export const selectClaimSearchByQueryLastPageReached = createSelector(
  selectState,
  state => state.claimSearchByQueryLastPageReached || {}
);

export const makeSelectShortUrlForUri = (uri: string) =>
  createSelector(
    makeSelectClaimForUri(uri),
    claim => claim && claim.short_url
  );

export const makeSelectCanonicalUrlForUri = (uri: string) =>
  createSelector(
    makeSelectClaimForUri(uri),
    claim => claim && claim.canonical_url
  );

export const makeSelectPermanentUrlForUri = (uri: string) =>
  createSelector(
    makeSelectClaimForUri(uri),
    claim => claim && claim.permanent_url
  );

export const makeSelectSupportsForUri = (uri: string) =>
  createSelector(
    selectSupportsByOutpoint,
    makeSelectClaimForUri(uri),
    (byOutpoint, claim: ?StreamClaim) => {
      if (!claim || !claim.is_my_output) {
        return null;
      }

      const { claim_id: claimId } = claim;
      let total = 0;

      Object.values(byOutpoint).forEach(support => {
        // $FlowFixMe
        const { claim_id, amount } = support;
        total = claim_id === claimId && amount ? total + parseFloat(amount) : total;
      });

      return total;
    }
  );

export const selectUpdatingChannel = createSelector(
  selectState,
  state => state.updatingChannel
);

export const selectUpdateChannelError = createSelector(
  selectState,
  state => state.updateChannelError
);

export const makeSelectReflectingClaimForUri = (uri: string) =>
  createSelector(
    makeSelectClaimForUri(uri),
    selectReflectingById,
    (claim, reflectingById) => {
      const claimId = claim && claim.claimId;
      return reflectingById[claimId];
    }
  );

export const makeSelectMyStreamUrlsForPage = (page: number = 1) =>
  createSelector(
    selectMyClaimUrisWithoutChannels,
    urls => {
      const start = (Number(page) - 1) * Number(PAGE_SIZE);
      const end = Number(page) * Number(PAGE_SIZE);

      return urls && urls.length ? urls.slice(start, end) : [];
    }
  );

export const selectMyStreamUrlsCount = createSelector(
  selectMyClaimUrisWithoutChannels,
  channels => channels.length
);

export const makeSelectResolvedRecommendedContentForUri = (
  uri: string,
  size: number,
  claimId: string,
  claimName: string,
  claimTitle: string
) =>
  createSelector(
    makeSelectClaimForUri(uri),
    selectResolvedSearchResultsByQuery,
    makeSelectClaimIsNsfw(uri),
    (claim, resolvedResultsByQuery, isMature) => {
      const atVanityURI = !uri.includes('#');

      let currentUri;
      let recommendedContent;
      let title;
      if (claim) {
        // always grab full URL - this can change once search returns canonical
        currentUri = buildURI({ streamClaimId: claim.claim_id, streamName: claim.name });
        title = claim.value ? claim.value.title : null;
      } else {
        // for cases on mobile where the claim may not have been resolved ()
        currentUri = buildURI({ streamClaimId: claimId, streamName: claimName });
        title = claimTitle;
      }

      if (!title) {
        return;
      }

      const options: {
        related_to?: string,
        nsfw?: boolean,
        isBackgroundSearch?: boolean,
      } = { related_to: claim ? claim.claim_id : claimId, size, isBackgroundSearch: false };

      const searchQuery = getSearchQueryString(title.replace(/\//, ' '), options);
      let results = resolvedResultsByQuery[searchQuery];
      if (results) {
        results = results.filter(
          result =>
            buildURI({ streamClaimId: result.claimId, streamName: result.name }) !== currentUri
        );
        recommendedContent = results;
      }

      return recommendedContent;
    }
  );
