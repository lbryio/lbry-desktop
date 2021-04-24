// @flow
import { ENABLE_NO_SOURCE_CLAIMS, SIMPLE_SITE } from 'config';
import * as CS from 'constants/claim_search';
import type { Node } from 'react';
import React from 'react';
import { createNormalizedClaimSearchKey, MATURE_TAGS } from 'lbry-redux';
import ClaimPreviewTile from 'component/claimPreviewTile';
import { useHistory } from 'react-router';

type Props = {
  prefixUris?: Array<string>,
  uris: Array<string>,
  doClaimSearch: ({}) => void,
  showNsfw: boolean,
  hideReposts: boolean,
  history: { action: string, push: (string) => void, replace: (string) => void },
  claimSearchByQuery: {
    [string]: Array<string>,
  },
  fetchingClaimSearchByQuery: {
    [string]: boolean,
  },
  // claim search options are below
  tags: Array<string>,
  blockedUris: Array<string>,
  mutedUris: Array<string>,
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
  hasNoSource?: boolean,
  renderProperties?: (Claim) => ?Node,
};

function ClaimTilesDiscover(props: Props) {
  const {
    doClaimSearch,
    claimSearchByQuery,
    showNsfw,
    hideReposts,
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
    prefixUris,
    timestamp,
    feeAmount,
    limitClaimsPerChannel,
    fetchingClaimSearchByQuery,
    hasNoSource,
    renderProperties,
    blockedUris,
    mutedUris,
  } = props;

  const { location } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const feeAmountInUrl = urlParams.get('fee_amount');
  const feeAmountParam = feeAmountInUrl || feeAmount;
  const mutedAndBlockedChannelIds = Array.from(new Set(mutedUris.concat(blockedUris).map((uri) => uri.split('#')[1])));

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
    claim_type: claimType || undefined,
    // no_totals makes it so the sdk doesn't have to calculate total number pages for pagination
    // it's faster, but we will need to remove it if we start using total_pages
    no_totals: true,
    any_tags: tags || [],
    not_tags: !showNsfw ? MATURE_TAGS : [],
    any_languages: languages,
    channel_ids: channelIds || [],
    not_channel_ids: mutedAndBlockedChannelIds,
    order_by: orderBy || ['trending_group', 'trending_mixed'],
    stream_types: streamTypes === null ? undefined : SIMPLE_SITE ? [CS.FILE_VIDEO, CS.FILE_AUDIO] : undefined,
  };

  if (ENABLE_NO_SOURCE_CLAIMS && hasNoSource) {
    options.has_no_source = true;
  } else if (!ENABLE_NO_SOURCE_CLAIMS && (!claimType || claimType === 'stream')) {
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

  const claimSearchCacheQuery = createNormalizedClaimSearchKey(options);
  const uris = (prefixUris || []).concat(claimSearchByQuery[claimSearchCacheQuery] || []);
  // Don't use the query from createNormalizedClaimSearchKey for the effect since that doesn't include page & release_time
  const optionsStringForEffect = JSON.stringify(options);
  const isLoading = fetchingClaimSearchByQuery[claimSearchCacheQuery];
  const shouldPerformSearch = !isLoading && uris.length === 0;

  React.useEffect(() => {
    if (shouldPerformSearch) {
      const searchOptions = JSON.parse(optionsStringForEffect);
      doClaimSearch(searchOptions);
    }
  }, [doClaimSearch, shouldPerformSearch, optionsStringForEffect]);

  return (
    <ul className="claim-grid">
      {uris && uris.length
        ? uris.map((uri) => <ClaimPreviewTile key={uri} uri={uri} properties={renderProperties} />)
        : new Array(pageSize).fill(1).map((x, i) => <ClaimPreviewTile key={i} placeholder />)}
    </ul>
  );
}
export default ClaimTilesDiscover;
