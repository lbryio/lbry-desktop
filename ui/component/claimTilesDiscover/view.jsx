// @flow
import type { Node } from 'react';
import React from 'react';
import { createNormalizedClaimSearchKey } from 'util/claim';
import ClaimPreviewTile from 'component/claimPreviewTile';
import useFetchViewCount from 'effects/use-fetch-view-count';
import usePrevious from 'effects/use-previous';

type SearchOptions = {
  page_size: number,
  page: number,
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

function urisEqual(prev: ?Array<string>, next: ?Array<string>) {
  if (!prev || !next) {
    // ClaimList: "null" and "undefined" have special meaning,
    // so we can't just compare array length here.
    //   - null = "timed out"
    //   - undefined = "no result".
    return prev === next;
  }

  // $FlowFixMe - already checked for null above.
  return prev.length === next.length && prev.every((value, index) => value === next[index]);
}

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
    // pinUrls,
    prefixUris,
    showNoSourceClaims,
    doFetchViewCount,
    pageSize = 8,
    options,
  } = props;

  const searchKey = createNormalizedClaimSearchKey(options);
  const fetchingClaimSearch = fetchingClaimSearchByQuery[searchKey];
  const claimSearchUris = claimSearchByQuery[searchKey] || [];
  const isUnfetchedClaimSearch = claimSearchByQuery[searchKey] === undefined;

  // Don't use the query from createNormalizedClaimSearchKey for the effect since that doesn't include page & release_time
  const optionsStringForEffect = JSON.stringify(options);
  const shouldPerformSearch = !fetchingClaimSearch && claimSearchUris.length === 0;

  const uris = (prefixUris || []).concat(claimSearchUris);
  // Not sure what to do with pinUrls
  // if (pinUrls && uris && uris.length > 2 && window.location.pathname === '/') {
  //   pinUrls.forEach((pin) => {
  //     if (uris.indexOf(pin) !== -1) {
  //       uris.splice(uris.indexOf(pin), 1);
  //     } else {
  //       uris.pop();
  //     }
  //   });
  //   uris.splice(2, 0, ...pinUrls);
  // }

  if (uris.length > 0 && uris.length < pageSize && shouldPerformSearch) {
    // prefixUri and pinUrls might already be present while waiting for the
    // remaining claim_search results. Fill the space to prevent layout shifts.
    uris.push(...Array(pageSize - uris.length).fill(''));
  }

  const prevUris = usePrevious(uris);

  useFetchViewCount(fetchViewCount, uris, claimsByUri, doFetchViewCount);

  // Run `doClaimSearch`
  React.useEffect(() => {
    if (shouldPerformSearch) {
      const searchOptions = JSON.parse(optionsStringForEffect);
      doClaimSearch(searchOptions);
    }
  }, [doClaimSearch, shouldPerformSearch, optionsStringForEffect]);

  // Show previous results while we fetch to avoid blinkies and poor CLS.
  const finalUris = isUnfetchedClaimSearch && prevUris ? prevUris : uris;

  return (
    <ul className="claim-grid">
      {finalUris && finalUris.length
        ? finalUris.map((uri, i) => {
            if (uri) {
              return (
                <ClaimPreviewTile
                  showNoSourceClaims={hasNoSource || showNoSourceClaims}
                  key={uri}
                  uri={uri}
                  properties={renderProperties}
                />
              );
            } else {
              return <ClaimPreviewTile showNoSourceClaims={hasNoSource || showNoSourceClaims} key={i} placeholder />;
            }
          })
        : new Array(pageSize)
            .fill(1)
            .map((x, i) => (
              <ClaimPreviewTile showNoSourceClaims={hasNoSource || showNoSourceClaims} key={i} placeholder />
            ))}
    </ul>
  );
}

export default React.memo<Props>(ClaimTilesDiscover, areEqual);

function debug_trace(val) {
  if (process.env.DEBUG_TRACE) console.log(`Render due to: ${val}`);
}

function areEqual(prev: Props, next: Props) {
  const prevOptions: SearchOptions = prev.options;
  const nextOptions: SearchOptions = next.options;

  const prevSearchKey = createNormalizedClaimSearchKey(prevOptions);
  const nextSearchKey = createNormalizedClaimSearchKey(nextOptions);

  if (prevSearchKey !== nextSearchKey) {
    debug_trace('search key');
    return false;
  }

  // --- Deep-compare ---
  if (!urisEqual(prev.claimSearchByQuery[prevSearchKey], next.claimSearchByQuery[nextSearchKey])) {
    debug_trace('claimSearchByQuery');
    return false;
  }

  const ARRAY_KEYS = ['prefixUris', 'channelIds'];
  for (let i = 0; i < ARRAY_KEYS.length; ++i) {
    const key = ARRAY_KEYS[i];
    if (!urisEqual(prev[key], next[key])) {
      debug_trace(`${key}`);
      return false;
    }
  }

  // --- Default the rest(*) to shallow-compare ---
  // (*) including new props introduced in the future, in case developer forgets
  // to update this function. Better to render more than miss an important one.
  const KEYS_TO_IGNORE = [
    ...ARRAY_KEYS,
    'claimSearchByQuery',
    'fetchingClaimSearchByQuery', // We are showing previous results while fetching.
    'options', // Covered by search-key comparison.
    'location',
    'history',
    'match',
    'claimsByUri',
    'doClaimSearch',
    'doToggleTagFollowDesktop',
  ];

  const propKeys = Object.keys(next);
  for (let i = 0; i < propKeys.length; ++i) {
    const pk = propKeys[i];
    if (!KEYS_TO_IGNORE.includes(pk) && prev[pk] !== next[pk]) {
      debug_trace(`${pk}`);
      return false;
    }
  }

  return true;
}
