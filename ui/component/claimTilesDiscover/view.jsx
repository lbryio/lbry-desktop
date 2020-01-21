// @flow
import React from 'react';
import { createNormalizedClaimSearchKey, MATURE_TAGS } from 'lbry-redux';
import ClaimPreviewTile from 'component/claimPreviewTile';

type Props = {
  uris: Array<string>,
  doClaimSearch: ({}) => void,
  loading: boolean,
  showNsfw: boolean,
  history: { action: string, push: string => void, replace: string => void },
  claimSearchByQuery: {
    [string]: Array<string>,
  },
  // claim search options are below
  tags: Array<string>,
  hiddenUris: Array<string>,
  channelIds?: Array<string>,
  pageSize: number,
  orderBy?: Array<string>,
  releaseTime?: string,
  claimType?: string,
  timestamp?: string,
};

function ClaimTilesDiscover(props: Props) {
  const {
    doClaimSearch,
    claimSearchByQuery,
    loading,
    showNsfw,
    hiddenUris,
    // Below are options to pass that are forwarded to claim_search
    tags,
    channelIds,
    orderBy,
    pageSize = 8,
    releaseTime,
    claimType,
    timestamp,
  } = props;

  const options: {
    page_size: number,
    no_totals: boolean,
    any_tags: Array<string>,
    channel_ids: Array<string>,
    channel_ids: Array<string>,
    not_channel_ids: Array<string>,
    not_tags: Array<string>,
    order_by: Array<string>,
    release_time?: string,
    claim_type?: string,
    timestamp?: string,
  } = {
    page_size: pageSize,
    // no_totals makes it so the sdk doesn't have to calculate total number pages for pagination
    // it's faster, but we will need to remove it if we start using total_pages
    no_totals: true,
    any_tags: tags || [],
    not_tags: !showNsfw ? MATURE_TAGS : [],
    channel_ids: channelIds || [],
    not_channel_ids: hiddenUris && hiddenUris.length ? hiddenUris.map(hiddenUri => hiddenUri.split('#')[1]) : [],
    order_by: orderBy || ['trending_group', 'trending_mixed'],
  };

  if (releaseTime) {
    options.release_time = releaseTime;
  }

  if (claimType) {
    options.claim_type = claimType;
  }
  if (timestamp) {
    options.timestamp = timestamp;
  }

  const claimSearchCacheQuery = createNormalizedClaimSearchKey(options);
  const uris = claimSearchByQuery[claimSearchCacheQuery] || [];
  const shouldPerformSearch = uris.length === 0 || (!loading && uris.length < pageSize);
  // Don't use the query from createNormalizedClaimSearchKey for the effect since that doesn't include page & release_time
  const optionsStringForEffect = JSON.stringify(options);

  React.useEffect(() => {
    if (shouldPerformSearch) {
      const searchOptions = JSON.parse(optionsStringForEffect);
      doClaimSearch(searchOptions);
    }
  }, [doClaimSearch, shouldPerformSearch, optionsStringForEffect]);

  return (
    <ul className="claim-grid">
      {uris && uris.length
        ? uris.map(uri => <ClaimPreviewTile key={uri} uri={uri} />)
        : new Array(pageSize).fill(1).map((x, i) => <ClaimPreviewTile key={i} placeholder />)}
    </ul>
  );
}
export default ClaimTilesDiscover;
