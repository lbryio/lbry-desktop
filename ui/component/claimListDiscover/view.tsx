import { ENABLE_NO_SOURCE_CLAIMS } from "config";
import type { ReactNode } from "react";
import * as CS from "constants/claim_search";
import React from "react";
import usePersistedState from "effects/use-persisted-state";
import { withRouter } from "react-router";
import { MATURE_TAGS } from "constants/tags";
import { createNormalizedClaimSearchKey } from "util/claim";
import { splitBySeparator } from "util/lbryURI";
import Button from "component/button";
import moment from "moment";
import ClaimList from "component/claimList";
import ClaimPreview from "component/claimPreview";
import ClaimPreviewTile from "component/claimPreviewTile";
import I18nMessage from "component/i18nMessage";
import ClaimListHeader from "component/claimListHeader";
import useFetchViewCount from "effects/use-fetch-view-count";
import { useIsLargeScreen } from "effects/use-screensize";

type Props = {
  uris: Array<string>;
  prefixUris?: Array<string>;
  name?: string;
  type: string;
  pageSize?: number;
  fetchViewCount?: boolean;
  forceShowReposts?: boolean;
  hasNoSource?: boolean;
  hasSource?: boolean;
  hideAdvancedFilter?: boolean;
  hideFilters?: boolean;
  includeSupportAction?: boolean;
  infiniteScroll?: boolean;
  isChannel?: boolean;
  personalView: boolean;
  showHeader: boolean;
  showHiddenByUser?: boolean;
  showNoSourceClaims?: boolean;
  tileLayout: boolean;
  orderBy?: Array<string>; // Trending, New, Top,
  defaultOrderBy?: string;
  sortBy?: Array<string>; // Newest First, Oldest First,
  freshness?: string;
  defaultFreshness?: string;
  tags: string; // these are just going to be string. pass a CSV if you want multi,
  defaultTags: string;
  claimType?: string | Array<string>;
  defaultClaimType?: Array<string>;
  streamType?: string | Array<string>;
  defaultStreamType?: string | Array<string>;
  empty?: string;
  feeAmount?: string;
  releaseTime?: string;
  repostedClaimId?: string;
  scrollAnchor?: string;
  maxPages?: number;
  limitClaimsPerChannel?: number;
  channelIds?: Array<string>;
  claimIds?: Array<string>;
  subscribedChannels: Array<Subscription>;
  header?: React.ReactNode;
  headerLabel?: string | React.ReactNode;
  hiddenNsfwMessage?: React.ReactNode;
  injectedItem: React.ReactNode | null | undefined;
  meta?: React.ReactNode;
  renderProperties?: (arg1: Claim) => React.ReactNode;
  history: {
    action: string;
    push: (arg1: string) => void;
    replace: (arg1: string) => void;
  };
  location: {
    search: string;
    pathname: string;
  };
  // --- select ---
  followedTags?: Array<Tag>;
  claimSearchByQuery: {
    [key: string]: Array<string>;
  };
  claimSearchByQueryLastPageReached: {
    [key: string]: boolean;
  };
  claimsByUri: {
    [key: string]: any;
  };
  loading: boolean;
  showNsfw: boolean;
  hideReposts: boolean;
  languageSetting: string;
  mutedUris: Array<string>;
  blockedUris: Array<string>;
  searchInLanguage: boolean;
  // --- perform ---
  doClaimSearch: (arg1: Record<any, any>) => void;
  doToggleTagFollowDesktop: (arg1: string) => void;
  doFetchViewCount: (claimIdCsv: string) => void;
  loadedCallback?: (arg1: number) => void;
  maxClaimRender?: number;
  useSkeletonScreen?: boolean;
  excludeUris?: Array<string>;
  swipeLayout: boolean;
};

function ClaimListDiscover(props: Props) {
  const {
    doClaimSearch,
    claimSearchByQuery,
    showHeader = true,
    type,
    claimSearchByQueryLastPageReached,
    tags,
    defaultTags,
    loading,
    meta,
    channelIds,
    showNsfw,
    hideReposts,
    fetchViewCount,
    history,
    location,
    mutedUris,
    blockedUris,
    hiddenNsfwMessage,
    defaultOrderBy,
    sortBy,
    orderBy,
    headerLabel,
    header,
    name,
    claimType,
    pageSize,
    defaultClaimType,
    streamType,
    defaultStreamType, // add param for DEFAULT_STREAM_TYPE
    freshness,
    defaultFreshness = CS.FRESH_WEEK,
    renderProperties,
    includeSupportAction,
    repostedClaimId,
    hideAdvancedFilter,
    infiniteScroll = true,
    followedTags,
    injectedItem,
    feeAmount,
    uris,
    prefixUris,
    tileLayout,
    hideFilters = false,
    claimIds,
    maxPages,
    forceShowReposts = false,
    languageSetting,
    searchInLanguage,
    limitClaimsPerChannel,
    releaseTime,
    scrollAnchor,
    showHiddenByUser = false,
    hasSource,
    hasNoSource,
    isChannel = false,
    showNoSourceClaims,
    empty,
    claimsByUri,
    doFetchViewCount,
    loadedCallback,
    maxClaimRender,
    useSkeletonScreen = true,
    excludeUris = [],
    swipeLayout = false,
  } = props;
  const didNavigateForward = history.action === "PUSH";
  const { search } = location;
  const [page, setPage] = React.useState(1);
  const [forceRefresh, setForceRefresh] = React.useState<any>();
  const isLargeScreen = useIsLargeScreen();
  const [orderParamEntry, setOrderParamEntry] = usePersistedState(`entry-${location.pathname}`, CS.ORDER_BY_TRENDING);
  const [orderParamUser, setOrderParamUser] = usePersistedState(`orderUser-${location.pathname}`, CS.ORDER_BY_TRENDING);
  const followed = (followedTags && followedTags.map((t) => t.name)) || [];
  const urlParams = new URLSearchParams(search);
  const tagsParam = // can be 'x,y,z' or 'x' or ['x','y'] or CS.CONSTANT
    (tags && getParamFromTags(tags)) ||
    (urlParams.get(CS.TAGS_KEY) !== null && urlParams.get(CS.TAGS_KEY)) ||
    (defaultTags && getParamFromTags(defaultTags));
  const freshnessParam = freshness || urlParams.get(CS.FRESH_KEY) || defaultFreshness;
  const sortByParam = sortBy || urlParams.get(CS.SORT_BY_KEY) || CS.SORT_BY.NEWEST.key;
  const mutedAndBlockedChannelIds = Array.from(
    new Set(mutedUris.concat(blockedUris).map((uri) => splitBySeparator(uri)[1]))
  );

  const langParam = urlParams.get(CS.LANGUAGE_KEY) || null;
  const languageParams = searchInLanguage
    ? langParam === null
      ? languageSetting.concat(languageSetting === "en" ? ",none" : "")
      : langParam === "any"
        ? null
        : langParam.concat(langParam === "en" ? ",none" : "")
    : langParam === null
      ? null
      : langParam === "any"
        ? null
        : langParam.concat(langParam === "en" ? ",none" : "");

  const contentTypeParam = urlParams.get(CS.CONTENT_KEY);
  const claimTypeParam =
    // @ts-expect-error - TS2345 - Argument of type 'string' is not assignable to parameter of type '"stream" | "channel" | "collection" | "repost"'.
    claimType || (CS.CLAIM_TYPES.includes(contentTypeParam) && contentTypeParam) || defaultClaimType || null;
  const streamTypeParam =
    // @ts-expect-error - TS2345 - Argument of type 'string' is not assignable to parameter of type '"audio" | "video" | "image" | "document" | "model" | "binary"'.
    streamType || (CS.FILE_TYPES.includes(contentTypeParam) && contentTypeParam) || defaultStreamType || null;
  const durationParam = urlParams.get(CS.DURATION_KEY) || null;
  const channelIdsInUrl = urlParams.get(CS.CHANNEL_IDS_KEY);
  const channelIdsParam = channelIdsInUrl ? channelIdsInUrl.split(",") : channelIds;
  const feeAmountParam = urlParams.get("fee_amount") || feeAmount;
  const originalPageSize = pageSize || CS.PAGE_SIZE;
  const dynamicPageSize = isLargeScreen ? Math.ceil(originalPageSize * (3 / 2)) : originalPageSize;
  const historyAction = history.action;

  let orderParam = orderBy || urlParams.get(CS.ORDER_BY_KEY) || defaultOrderBy || orderParamEntry;

  if (!orderParam) {
    if (historyAction === "POP") {
      // Reaching here means user have popped back to the page's entry point (e.g. '/$/tags' without any '?order=').
      orderParam = orderParamEntry;
    } else {
      // This is the direct entry into the page, so we load the user's previous value.
      orderParam = orderParamUser;
    }
  }

  React.useEffect(() => {
    setOrderParamUser(orderParam);
  }, [orderParam, setOrderParamUser]);

  React.useEffect(() => {
    // One-time update to stash the finalized 'orderParam' at entry.
    if (historyAction !== "POP") {
      setOrderParamEntry(orderParam);
    }
  }, [historyAction, setOrderParamEntry]);

  const options: {
    page_size: number;
    page: number;
    no_totals: boolean;
    any_tags?: Array<string>;
    any_languages?: Array<string>;
    not_tags: Array<string>;
    channel_ids?: Array<string>;
    claim_ids?: Array<string>;
    not_channel_ids?: Array<string>;
    order_by: Array<string>;
    release_time?: string;
    claim_type?: string | Array<string>;
    name?: string;
    duration?: string | Array<string>;
    reposted_claim_id?: string;
    stream_types?: any;
    fee_amount?: string;
    has_source?: boolean;
    has_no_source?: boolean;
    limit_claims_per_channel?: number;
  } = {
    page_size: dynamicPageSize,
    page,
    name,
    claim_type: claimType || ["stream", "repost", "channel"],
    // no_totals makes it so the sdk doesn't have to calculate total number pages for pagination
    // it's faster, but we will need to remove it if we start using total_pages
    no_totals: true,
    not_channel_ids: isChannel ? undefined : mutedAndBlockedChannelIds,
    // @ts-expect-error - TS2322 - Type 'readonly ["porn", "porno", "nsfw", "mature", "xxx", "sex", "creampie", "blowjob", "handjob", "vagina", "boobs", "big boobs", "big dick", "pussy", "cumshot", "anal", "hard fucking", "ass", "fuck", "hentai"] | []' is not assignable to type 'string[]'.
    not_tags: !showNsfw ? MATURE_TAGS : [],
    // @ts-expect-error - TS2322 - Type 'string[] | readonly ["release_time"] | readonly ["effective_amount"] | readonly ["trending_score"]' is not assignable to type 'string[]'.
    order_by: resolveOrderByOption(orderParam, sortByParam),
  };

  if (ENABLE_NO_SOURCE_CLAIMS && hasNoSource) {
    options.has_no_source = true;
  } else if (hasSource || (!ENABLE_NO_SOURCE_CLAIMS && (!claimType || claimType === "stream"))) {
    options.has_source = true;
  }

  if (limitClaimsPerChannel) {
    options.limit_claims_per_channel = limitClaimsPerChannel;
  }

  if (feeAmountParam && claimType !== CS.CLAIM_CHANNEL) {
    options.fee_amount = feeAmountParam;
  }

  if (claimIds) {
    options.claim_ids = claimIds;
  }

  if (channelIdsParam) {
    options.channel_ids = channelIdsParam;
  }

  if (tagsParam) {
    if (tagsParam !== CS.TAGS_ALL && tagsParam !== "") {
      if (tagsParam === CS.TAGS_FOLLOWED) {
        options.any_tags = followed;
      } else if (Array.isArray(tagsParam)) {
        options.any_tags = tagsParam;
      } else {
        options.any_tags = tagsParam.split(",");
      }
    }
  }

  if (repostedClaimId) {
    // SDK chokes on reposted_claim_id of null or false, needs to not be present if no value
    options.reposted_claim_id = repostedClaimId;
  }
  // IF release time, set it, else set fallback release times using the hack below.
  if (releaseTime) {
    options.release_time = releaseTime;
  } else if (claimType !== CS.CLAIM_CHANNEL) {
    if (orderParam === CS.ORDER_BY_TOP && freshnessParam !== CS.FRESH_ALL) {
      // @ts-expect-error - TS2769 (ts-migration)
      options.release_time = `>${Math.floor(moment().subtract(1, freshnessParam).startOf("hour").unix())}`;
    } else if (orderParam === CS.ORDER_BY_NEW || orderParam === CS.ORDER_BY_TRENDING) {
      // Warning - hack below
      // If users are following more than 10 channels or tags, limit results to stuff less than a year old
      // For more than 20, drop it down to 6 months
      // This helps with timeout issues for users that are following a ton of stuff
      // https://github.com/lbryio/lbry-sdk/issues/2420
      if (
        (options.channel_ids && options.channel_ids.length > 20) ||
        (options.any_tags && options.any_tags.length > 20)
      ) {
        options.release_time = `>${Math.floor(moment().subtract(3, CS.FRESH_MONTH).startOf("week").unix())}`;
      } else if (
        (options.channel_ids && options.channel_ids.length > 10) ||
        (options.any_tags && options.any_tags.length > 10)
      ) {
        options.release_time = `>${Math.floor(moment().subtract(1, CS.FRESH_YEAR).startOf("week").unix())}`;
      } else {
        // Hack for at least the New page until https://github.com/lbryio/lbry-sdk/issues/2591 is fixed
        options.release_time = `<${Math.floor(moment().startOf("minute").unix())}`;
      }
    }
  }

  if (durationParam) {
    if (durationParam === CS.DURATION_SHORT) {
      options.duration = "<=240";
    } else if (durationParam === CS.DURATION_LONG) {
      options.duration = ">=1200";
    } else if (durationParam === CS.DURATION_MEDIUM) {
      options.duration = ["<=1200", ">=240"];
    }
  }

  if (streamTypeParam && streamTypeParam !== CS.CONTENT_ALL && claimType !== CS.CLAIM_CHANNEL) {
    options.stream_types = typeof streamTypeParam === "string" ? [streamTypeParam] : streamTypeParam;
  }

  if (claimTypeParam) {
    if (claimTypeParam !== CS.CONTENT_ALL) {
      if (Array.isArray(claimTypeParam)) {
        options.claim_type = claimTypeParam;
      } else {
        options.claim_type = [claimTypeParam];
      }
    }
  }

  if (languageParams) {
    if (languageParams !== CS.LANGUAGES_ALL) {
      options.any_languages = languageParams.split(",");
    }
  }

  if (tagsParam) {
    if (tagsParam !== CS.TAGS_ALL && tagsParam !== "") {
      if (tagsParam === CS.TAGS_FOLLOWED) {
        options.any_tags = followed;
      } else if (Array.isArray(tagsParam)) {
        options.any_tags = tagsParam;
      } else {
        options.any_tags = tagsParam.split(",");
      }
    }
  }

  if (hideReposts && !options.reposted_claim_id && !forceShowReposts) {
    if (Array.isArray(options.claim_type)) {
      if (options.claim_type.length > 1) {
        options.claim_type = options.claim_type.filter((claimType) => claimType !== "repost");
      }
    } else {
      options.claim_type = ["stream", "channel"];
    }
  }

  // @ts-expect-error - TS2345 - Argument of type 'string' is not assignable to parameter of type '"porn" | "porno" | "nsfw" | "mature" | "xxx" | "sex" | "creampie" | "blowjob" | "handjob" | "vagina" | "boobs" | "big boobs" | "big dick" | "pussy" | "cumshot" | "anal" | "hard fucking" | "ass" | "fuck" | "hentai"'.
  const hasMatureTags = tagsParam && tagsParam.split(",").some((t) => MATURE_TAGS.includes(t));

  const searchKey = createNormalizedClaimSearchKey(options);
  const claimSearchResult = claimSearchByQuery[searchKey];
  const claimSearchResultLastPageReached = claimSearchByQueryLastPageReached[searchKey];

  const [prevOptions, setPrevOptions] = React.useState<any>(null);

  if (!isJustScrollingToNewPage(prevOptions, options)) {
    // --- New search, or search options changed.
    setPrevOptions(options);

    if (didNavigateForward) {
      // --- Reset the page.
      options.page = 1;
      setPage(options.page);
    } else if (claimSearchResult) {
      // --- Update 'page' based on retrieved 'claimSearchResult'.
      options.page = Math.ceil(claimSearchResult.length / dynamicPageSize);
      if (options.page !== page) {
        setPage(options.page);
      }
    }
  }

  const shouldPerformSearch =
    claimSearchResult === undefined ||
    didNavigateForward ||
    (!loading &&
      !claimSearchResultLastPageReached &&
      claimSearchResult &&
      claimSearchResult.length &&
      claimSearchResult.length < dynamicPageSize * options.page &&
      claimSearchResult.length % dynamicPageSize === 0);

  // Don't use the query from createNormalizedClaimSearchKey for the effect since that doesn't include page & release_time
  const optionsStringForEffect = JSON.stringify(options);

  const timedOutMessage = (
    <div>
      <p>
        {/* @ts-expect-error - TS2745 (ts-migration) */}
        <I18nMessage
          // @ts-expect-error - TS2322 (ts-migration)
          tokens={{
            again: (
              <Button
                // @ts-expect-error - TS2322 (ts-migration)
                button="link"
                label={__("try again in a few seconds.")}
                onClick={() => setForceRefresh(Date.now())}
              />
            ),
          }}
        >
          Sorry, your request timed out. Modify your options or %again%
        </I18nMessage>
      </p>
      <p>
        {/* @ts-expect-error - TS2745 (ts-migration) */}
        <I18nMessage
          // @ts-expect-error - TS2322 (ts-migration)
          tokens={{
            // @ts-expect-error - TS2322 (ts-migration)
            contact_support: <Button button="link" label={__("contact support")} href="https://lbry.com/faq/support" />,
          }}
        >
          If you continue to have issues, please %contact_support%.
        </I18nMessage>
      </p>
    </div>
  );

  const renderUris = uris || claimSearchResult;

  // **************************************************************************
  // Helpers
  // **************************************************************************

  // Returns true if the change in 'options' indicate that we are simply scrolling
  // down to a new page; false otherwise.
  function isJustScrollingToNewPage(prevOptions: unknown, options: unknown) {
    if (!prevOptions) {
      // It's a new search, or we just popped back from a different view.
      return false;
    }

    // Compare every field except for 'page' and 'release_time'.
    // There might be better ways to achieve this.
    // @ts-expect-error - TS2698 - Spread types may only be created from object types.
    const tmpPrevOptions = { ...prevOptions };
    tmpPrevOptions.page = -1;
    tmpPrevOptions.release_time = "";

    // @ts-expect-error - TS2698 - Spread types may only be created from object types.
    const tmpOptions = { ...options };
    tmpOptions.page = -1;
    tmpOptions.release_time = "";

    return JSON.stringify(tmpOptions) === JSON.stringify(tmpPrevOptions);
  }

  function getParamFromTags(t: unknown) {
    if (t === CS.TAGS_ALL || t === CS.TAGS_FOLLOWED) {
      return t;
    } else if (Array.isArray(t)) {
      return t.join(",");
    }
  }

  function handleScrollBottom() {
    if (maxPages !== undefined && page === maxPages) {
      return;
    }

    if (!loading && infiniteScroll) {
      if (claimSearchResult && !claimSearchResultLastPageReached) {
        setPage(page + 1);
      }
    }
  }

  function resolveOrderByOption(orderBy: string | Array<string>, sortBy: string | Array<string>) {
    const order_by =
      orderBy === CS.ORDER_BY_TRENDING
        ? CS.ORDER_BY_TRENDING_VALUE
        : orderBy === CS.ORDER_BY_NEW
          ? CS.ORDER_BY_NEW_VALUE
          : CS.ORDER_BY_TOP_VALUE;

    if (orderBy === CS.ORDER_BY_NEW && sortBy === CS.SORT_BY.OLDEST.key) {
      return order_by.map((x) => `${CS.SORT_BY.OLDEST.opt}${x}`);
    }

    return order_by;
  }

  // **************************************************************************
  // **************************************************************************

  useFetchViewCount(fetchViewCount, renderUris, claimsByUri, doFetchViewCount);

  React.useEffect(() => {
    if (shouldPerformSearch) {
      const searchOptions = JSON.parse(optionsStringForEffect);
      doClaimSearch(searchOptions);
    }
  }, [doClaimSearch, shouldPerformSearch, optionsStringForEffect, forceRefresh]);

  const headerToUse = header || (
    <ClaimListHeader
      channelIds={channelIds}
      defaultTags={defaultTags}
      tags={tags}
      freshness={freshness}
      defaultFreshness={defaultFreshness}
      // @ts-expect-error - TS2322 (ts-migration)
      claimType={claimType}
      streamType={streamType}
      defaultStreamType={defaultStreamType}
      feeAmount={feeAmount} // ENABLE_PAID_CONTENT_DISCOVER or something
      orderBy={orderBy}
      defaultOrderBy={defaultOrderBy}
      hideAdvancedFilter={hideAdvancedFilter}
      hasMatureTags={hasMatureTags}
      hiddenNsfwMessage={hiddenNsfwMessage}
      setPage={setPage}
      tileLayout={tileLayout}
      hideFilters={hideFilters}
      scrollAnchor={scrollAnchor}
    />
  );

  return (
    <React.Fragment>
      {headerLabel && <label className="claim-list__header-label">{headerLabel}</label>}
      {tileLayout ? (
        <div>
          {!repostedClaimId && (
            <div className="section__header--actions">
              {headerToUse}
              {meta && <div className="section__actions--no-margin">{meta}</div>}
            </div>
          )}
          <ClaimList
            tileLayout
            loading={loading}
            uris={renderUris}
            prefixUris={prefixUris}
            onScrollBottom={handleScrollBottom}
            page={page}
            pageSize={dynamicPageSize}
            timedOutMessage={timedOutMessage}
            renderProperties={renderProperties}
            includeSupportAction={includeSupportAction}
            injectedItem={injectedItem}
            showHiddenByUser={showHiddenByUser}
            // @ts-expect-error - TS2322 (ts-migration)
            searchOptions={options}
            showNoSourceClaims={showNoSourceClaims}
            empty={empty}
            maxClaimRender={maxClaimRender}
            excludeUris={excludeUris}
            loadedCallback={loadedCallback}
            swipeLayout={swipeLayout}
          />
          {loading && useSkeletonScreen && (
            <div className="claim-grid">
              {new Array(dynamicPageSize).fill(1).map((x, i) => (
                <ClaimPreviewTile key={i} placeholder="loading" />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {showHeader && (
            <div className="section__header--actions">
              {headerToUse}
              {meta && <div className="section__actions--no-margin">{meta}</div>}
            </div>
          )}
          <ClaimList
            type={type}
            loading={loading}
            uris={renderUris}
            prefixUris={prefixUris}
            onScrollBottom={handleScrollBottom}
            page={page}
            pageSize={dynamicPageSize}
            timedOutMessage={timedOutMessage}
            renderProperties={renderProperties}
            includeSupportAction={includeSupportAction}
            injectedItem={injectedItem}
            showHiddenByUser={showHiddenByUser}
            // @ts-expect-error - TS2322 (ts-migration)
            searchOptions={options}
            showNoSourceClaims={hasNoSource || showNoSourceClaims}
            empty={empty}
            maxClaimRender={maxClaimRender}
            excludeUris={excludeUris}
            loadedCallback={loadedCallback}
            swipeLayout={swipeLayout}
          />
          {loading &&
            useSkeletonScreen &&
            new Array(dynamicPageSize)
              .fill(1)
              .map((x, i) => (
                <ClaimPreview
                  showNoSourceClaims={hasNoSource || showNoSourceClaims}
                  key={i}
                  placeholder="loading"
                  type={type}
                />
              ))}
        </div>
      )}
    </React.Fragment>
  );
}

export default withRouter(ClaimListDiscover);
