// @flow
import type { Node } from 'react';
import React from 'react';
import { createNormalizedClaimSearchKey } from 'lbry-redux';
import ClaimPreviewTile from 'component/claimPreviewTile';

type SearchOptions = {
  page_size: number,
  no_totals: boolean,
  any_tags: Array<string>,
  channel_ids: Array<string>,
  claim_ids?: Array<string>,
  not_channel_ids: Array<string>,
  not_tags: Array<string>,
  order_by: Array<string>,
  languages?: Array<string>,
  release_time?: string,
  claim_type?: string | Array<string>,
  timestamp?: string,
  fee_amount?: string,
  limit_claims_per_channel?: number,
  stream_types?: Array<string>,
  has_source?: boolean,
  has_no_source?: boolean,
};

// ****************************************************************************
// ClaimTilesDiscover
// ****************************************************************************

type Props = {
  prefixUris?: Array<string>,
  pinUrls?: Array<string>,
  uris: Array<string>,
  showNoSourceClaims?: boolean,
  renderProperties?: (Claim) => ?Node,
  fetchViewCount?: boolean,
  // claim search options are below
  tags: Array<string>,
  claimIds?: Array<string>,
  channelIds?: Array<string>,
  pageSize: number,
  orderBy?: Array<string>,
  releaseTime?: string,
  languages?: Array<string>,
  claimType?: string | Array<string>,
  streamTypes?: Array<string>,
  timestamp?: string,
  feeAmount?: string,
  limitClaimsPerChannel?: number,
  hasSource?: boolean,
  hasNoSource?: boolean,
  // --- select ---
  location: { search: string },
  claimSearchByQuery: { [string]: Array<string> },
  claimsByUri: { [string]: any },
  fetchingClaimSearchByQuery: { [string]: boolean },
  showNsfw: boolean,
  hideReposts: boolean,
  mutedUris: Array<string>,
  blockedUris: Array<string>,
  options: SearchOptions,
  // --- perform ---
  doClaimSearch: ({}) => void,
  doFetchViewCount: (claimIdCsv: string) => void,
};

function ClaimTilesDiscover(props: Props) {
  const {
    doClaimSearch,
    claimSearchByQuery,
    claimsByUri,
    fetchViewCount,
    fetchingClaimSearchByQuery,
    hasNoSource,
    renderProperties,
    pinUrls,
    prefixUris,
    showNoSourceClaims,
    doFetchViewCount,
    pageSize = 8,
    options,
  } = props;

  const searchKey = createNormalizedClaimSearchKey(options);
  const fetchingClaimSearch = fetchingClaimSearchByQuery[searchKey];
  const claimSearchUris = claimSearchByQuery[searchKey] || [];

  // Don't use the query from createNormalizedClaimSearchKey for the effect since that doesn't include page & release_time
  const optionsStringForEffect = JSON.stringify(options);
  const shouldPerformSearch = !fetchingClaimSearch && claimSearchUris.length === 0;

  const uris = (prefixUris || []).concat(claimSearchUris);

  if (pinUrls && uris && uris.length > 2 && window.location.pathname === '/') {
    pinUrls.forEach((pin) => {
      if (uris.indexOf(pin) !== -1) {
        uris.splice(uris.indexOf(pin), 1);
      } else {
        uris.pop();
      }
    });
    uris.splice(2, 0, ...pinUrls);
  }

  // Run `doClaimSearch`
  React.useEffect(() => {
    if (shouldPerformSearch) {
      const searchOptions = JSON.parse(optionsStringForEffect);
      doClaimSearch(searchOptions);
    }
  }, [doClaimSearch, shouldPerformSearch, optionsStringForEffect]);

  // Fetch view count for uris
  React.useEffect(() => {
    if (fetchViewCount && uris && uris.length > 0) {
      const claimIds = [];

      uris.forEach((uri) => {
        if (claimsByUri[uri]) {
          claimIds.push(claimsByUri[uri].claim_id);
        }
      });

      if (claimIds.length > 0) {
        // TODO: this is a rough port. Need to only do this when necessary.
        const TODO = true;
        if (!TODO) {
          doFetchViewCount(claimIds.join(','));
        }
      }
    }
  }, [uris, fetchViewCount]);

  return (
    <ul className="claim-grid">
      {uris && uris.length
        ? uris.map((uri) => (
            <ClaimPreviewTile
              showNoSourceClaims={hasNoSource || showNoSourceClaims}
              key={uri}
              uri={uri}
              properties={renderProperties}
            />
          ))
        : new Array(pageSize)
            .fill(1)
            .map((x, i) => (
              <ClaimPreviewTile showNoSourceClaims={hasNoSource || showNoSourceClaims} key={i} placeholder />
            ))}
    </ul>
  );
}

export default ClaimTilesDiscover;
