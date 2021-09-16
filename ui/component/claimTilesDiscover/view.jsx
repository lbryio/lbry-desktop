// @flow
import { ENABLE_NO_SOURCE_CLAIMS, SIMPLE_SITE } from 'config';
import * as CS from 'constants/claim_search';
import type { Node } from 'react';
import React from 'react';
import { createNormalizedClaimSearchKey, MATURE_TAGS, splitBySeparator } from 'lbry-redux';
import ClaimPreviewTile from 'component/claimPreviewTile';
import { useHistory } from 'react-router';

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
  claimSearchByQuery: { [string]: Array<string> },
  claimsByUri: { [string]: any },
  fetchingClaimSearchByQuery: { [string]: boolean },
  showNsfw: boolean,
  hideReposts: boolean,
  mutedUris: Array<string>,
  blockedUris: Array<string>,
  // --- perform ---
  doClaimSearch: ({}) => void,
  doFetchViewCount: (claimIdCsv: string) => void,
};

function ClaimTilesDiscover(props: Props) {
  const {
    doClaimSearch,
    claimSearchByQuery,
    claimsByUri,
    showNsfw,
    hideReposts,
    fetchViewCount,
    // Below are options to pass that are forwarded to claim_search
    tags,
    channelIds,
    claimIds,
    orderBy,
    pageSize = 8,
    releaseTime,
    languages,
    claimType,
    streamTypes,
    timestamp,
    feeAmount,
    limitClaimsPerChannel,
    fetchingClaimSearchByQuery,
    hasSource,
    hasNoSource,
    renderProperties,
    blockedUris,
    mutedUris,
    pinUrls,
    prefixUris,
    showNoSourceClaims,
    doFetchViewCount,
  } = props;

  const { location } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const feeAmountInUrl = urlParams.get('fee_amount');
  const feeAmountParam = feeAmountInUrl || feeAmount;
  const mutedAndBlockedChannelIds = Array.from(
    new Set(mutedUris.concat(blockedUris).map((uri) => splitBySeparator(uri)[1]))
  );

  let streamTypesParam;
  if (streamTypes) {
    streamTypesParam = streamTypes;
  } else if (SIMPLE_SITE && !hasNoSource && streamTypes !== null) {
    streamTypesParam = [CS.FILE_VIDEO, CS.FILE_AUDIO];
  }

  const options: {
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
  } = {
    page_size: pageSize,
    claim_type: claimType || ['stream', 'repost', 'channel'],
    // no_totals makes it so the sdk doesn't have to calculate total number pages for pagination
    // it's faster, but we will need to remove it if we start using total_pages
    no_totals: true,
    any_tags: tags || [],
    not_tags: !showNsfw ? MATURE_TAGS : [],
    any_languages: languages,
    channel_ids: channelIds || [],
    not_channel_ids: mutedAndBlockedChannelIds,
    order_by: orderBy || ['trending_group', 'trending_mixed'],
    stream_types: streamTypesParam,
  };

  if (ENABLE_NO_SOURCE_CLAIMS && hasNoSource) {
    options.has_no_source = true;
  } else if (hasSource || (!ENABLE_NO_SOURCE_CLAIMS && (!claimType || claimType === 'stream'))) {
    options.has_source = true;
  }

  if (releaseTime) {
    options.release_time = releaseTime;
  }

  if (feeAmountParam) {
    options.fee_amount = feeAmountParam;
  }

  if (limitClaimsPerChannel) {
    options.limit_claims_per_channel = limitClaimsPerChannel;
  }

  // https://github.com/lbryio/lbry-desktop/issues/3774
  if (hideReposts) {
    if (Array.isArray(options.claim_type)) {
      options.claim_type = options.claim_type.filter((claimType) => claimType !== 'repost');
    } else {
      options.claim_type = ['stream', 'channel'];
    }
  }

  if (claimType) {
    options.claim_type = claimType;
  }

  if (timestamp) {
    options.timestamp = timestamp;
  }

  if (claimIds) {
    options.claim_ids = claimIds;
  }

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

  // **************************************************************************
  // **************************************************************************

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
