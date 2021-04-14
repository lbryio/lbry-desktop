// @flow
import { ENABLE_NO_SOURCE_CLAIMS, SIMPLE_SITE } from 'config';
import * as CS from 'constants/claim_search';
import type { Node } from 'react';
import React from 'react';
import { createNormalizedClaimSearchKey, MATURE_TAGS } from 'lbry-redux';
import ClaimPreviewTile from 'component/claimPreviewTile';
import { useHistory } from 'react-router';
import { getLivestreamOnlyOptions } from 'util/search';

/**
 * Updates 'uris' by adding and/or moving active livestreams to the front of
 * list.
 * 'liveUris' is also updated with any entries that were moved to the
 * front, for convenience.
 *
 * @param uris [Ref]
 * @param liveUris [Ref]
 * @param livestreamMap
 * @param claimsByUri
 * @param claimSearchByQuery
 * @param options
 */
export function prioritizeActiveLivestreams(
  uris: Array<string>,
  liveUris: Array<string>,
  livestreamMap: { [string]: any },
  claimsByUri: { [string]: any },
  claimSearchByQuery: { [string]: Array<string> },
  options: any
) {
  if (!livestreamMap || !uris) return;

  const claimIsLive = (claim, liveChannelIds) => {
    // This function relies on:
    // 1. Only 1 actual livestream per channel (i.e. all other livestream-claims
    //    for that channel actually point to the same source).
    // 2. 'liveChannelIds' needs to be pruned after being accounted for,
    //    otherwise all livestream-claims will be "live" (we'll only take the
    //    latest one as "live").
    return (
      claim &&
      claim.value_type === 'stream' &&
      claim.value.source === undefined &&
      claim.signing_channel &&
      liveChannelIds.includes(claim.signing_channel.claim_id)
    );
  };

  let liveChannelIds = Object.keys(livestreamMap);

  // 1. Collect active livestreams from the primary search to put in front.
  uris.forEach((uri) => {
    const claim = claimsByUri[uri];
    if (claimIsLive(claim, liveChannelIds)) {
      liveUris.push(uri);
      // This live channel has been accounted for, so remove it.
      liveChannelIds.splice(liveChannelIds.indexOf(claim.signing_channel.claim_id), 1);
    }
  });

  // 2. Now, repeat on the secondary search.
  if (options) {
    const livestreamsOnlySearchCacheQuery = createNormalizedClaimSearchKey(getLivestreamOnlyOptions(options));
    const livestreamsOnlyUris = claimSearchByQuery[livestreamsOnlySearchCacheQuery];
    if (livestreamsOnlyUris) {
      livestreamsOnlyUris.forEach((uri) => {
        const claim = claimsByUri[uri];
        if (!uris.includes(uri) && claimIsLive(claim, liveChannelIds)) {
          liveUris.push(uri);
          // This live channel has been accounted for, so remove it.
          liveChannelIds.splice(liveChannelIds.indexOf(claim.signing_channel.claim_id), 1);
        }
      });
    }
  }

  // 3. Finalize uris by putting live livestreams in front.
  const newUris = liveUris.concat(uris.filter((uri) => !liveUris.includes(uri)));
  uris.splice(0, uris.length, ...newUris);
}

// ****************************************************************************
// ClaimTilesDiscover
// ****************************************************************************

type Props = {
  prefixUris?: Array<string>,
  uris: Array<string>,
  doClaimSearch: ({}) => void,
  showNsfw: boolean,
  hideReposts: boolean,
  history: { action: string, push: (string) => void, replace: (string) => void },
  claimSearchByQuery: { [string]: Array<string> },
  fetchingClaimSearchByQuery: { [string]: boolean },
  claimsByUri: { [string]: any },
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
  hasSource?: boolean,
  hasNoSource?: boolean,
  renderProperties?: (Claim) => ?Node,
  liveLivestreamsFirst?: boolean,
  livestreamMap?: { [string]: any },
  pin?: boolean,
};

function ClaimTilesDiscover(props: Props) {
  const {
    doClaimSearch,
    claimSearchByQuery,
    claimsByUri,
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
    timestamp,
    feeAmount,
    limitClaimsPerChannel,
    fetchingClaimSearchByQuery,
    hasSource,
    hasNoSource,
    renderProperties,
    blockedUris,
    mutedUris,
    liveLivestreamsFirst,
    livestreamMap,
    pin,
    prefixUris,
  } = props;

  const { location } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const feeAmountInUrl = urlParams.get('fee_amount');
  const feeAmountParam = feeAmountInUrl || feeAmount || CS.FEE_AMOUNT_ONLY_FREE;
  const mutedAndBlockedChannelIds = Array.from(new Set(mutedUris.concat(blockedUris).map((uri) => uri.split('#')[1])));
  const liveUris = [];

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
    stream_types:
      streamTypes === null ? undefined : SIMPLE_SITE && !hasNoSource ? [CS.FILE_VIDEO, CS.FILE_AUDIO] : undefined,
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

  const claimSearchCacheQuery = createNormalizedClaimSearchKey(options);
  const uris = (prefixUris || []).concat(claimSearchByQuery[claimSearchCacheQuery] || []);

  const isLoading = fetchingClaimSearchByQuery[claimSearchCacheQuery];
  if (liveLivestreamsFirst && livestreamMap && !isLoading) {
    prioritizeActiveLivestreams(uris, liveUris, livestreamMap, claimsByUri, claimSearchByQuery, options);
  }

  // Don't use the query from createNormalizedClaimSearchKey for the effect since that doesn't include page & release_time
  const optionsStringForEffect = JSON.stringify(options);
  const shouldPerformSearch = !isLoading && uris.length === 0;

  const fixUris = [
    'lbry://@Destiny#6/richard-wolff-responds-to-destiny-debate#7',
  ];
  if (pin && uris && uris.length > 2 && window.location.pathname === '/') {
    fixUris.forEach((fixUri) => {
      if (uris.indexOf(fixUri) !== -1) {
        uris.splice(uris.indexOf(fixUri), 1);
      } else {
        uris.pop();
      }
    });
    uris.splice(2, 0, ...fixUris);
  }

  React.useEffect(() => {
    if (shouldPerformSearch) {
      const searchOptions = JSON.parse(optionsStringForEffect);
      doClaimSearch(searchOptions);

      if (liveLivestreamsFirst) {
        doClaimSearch(getLivestreamOnlyOptions(searchOptions));
      }
    }
  }, [doClaimSearch, shouldPerformSearch, optionsStringForEffect, liveLivestreamsFirst]);
  const resolveLive = (index) => {
    if (liveLivestreamsFirst && livestreamMap && index < liveUris.length) {
      return true;
    }
    return undefined;
  };

  return (
    <ul className="claim-grid">
      {uris && uris.length
        ? uris.map((uri, index) => (
            <ClaimPreviewTile key={uri} uri={uri} properties={renderProperties} live={resolveLive(index)} />
          ))
        : new Array(pageSize).fill(1).map((x, i) => <ClaimPreviewTile key={i} placeholder />)}
    </ul>
  );
}
export default ClaimTilesDiscover;
