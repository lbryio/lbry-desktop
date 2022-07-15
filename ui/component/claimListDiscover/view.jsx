// @flow
import { ENABLE_NO_SOURCE_CLAIMS } from 'config';
import type { Node } from 'react';
import * as CS from 'constants/claim_search';
import React from 'react';
import usePersistedState from 'effects/use-persisted-state';
import { withRouter } from 'react-router';
import { MATURE_TAGS } from 'constants/tags';
import { resolveLangForClaimSearch } from 'util/default-languages';
import { createNormalizedClaimSearchKey } from 'util/claim';
import { splitBySeparator } from 'util/lbryURI';
import Button from 'component/button';
import moment from 'moment';
import ClaimList from 'component/claimList';
import ClaimPreview from 'component/claimPreview';
import ClaimPreviewTile from 'component/claimPreviewTile';
import I18nMessage from 'component/i18nMessage';
import LangFilterIndicator from 'component/langFilterIndicator';
import ClaimListHeader from 'component/claimListHeader';
import useFetchViewCount from 'effects/use-fetch-view-count';
import useResolvePins from 'effects/use-resolve-pins';
import { useIsLargeScreen } from 'effects/use-screensize';
import useGetUserMemberships from 'effects/use-get-user-memberships';

type Props = {
  uris: Array<string>,
  prefixUris?: Array<string>,
  pins?: { urls?: Array<string>, claimIds?: Array<string>, onlyPinForOrder?: string },
  name?: string,
  type: string,
  pageSize?: number,

  fetchViewCount?: boolean,
  hideRepostsOverride?: boolean, // undefined = use SETTINGS.HIDE_REPOSTS; true/false: use this.
  hasNoSource?: boolean,
  hasSource?: boolean,
  hideAdvancedFilter?: boolean,
  hideFilters?: boolean,
  includeSupportAction?: boolean,
  infiniteScroll?: Boolean,
  isChannel?: boolean,
  personalView: boolean,
  showHeader: boolean,
  showHiddenByUser?: boolean,
  showNoSourceClaims?: boolean,
  tileLayout: boolean,
  searchLanguages?: Array<string>,
  ignoreSearchInLanguage?: boolean, // Negate the redux setting where it doesn't make sense.

  orderBy?: Array<string>, // Trending, New, Top
  defaultOrderBy?: string,
  sortBy?: Array<string>, // Newest First, Oldest First
  freshness?: string,
  defaultFreshness?: string,

  tags: string, // these are just going to be string. pass a CSV if you want multi
  defaultTags: string,

  claimType?: string | Array<string>,
  defaultClaimType?: Array<string>,

  streamType?: string | Array<string>,
  defaultStreamType?: string | Array<string>,

  empty?: string,
  feeAmount?: string,
  releaseTime?: string,
  repostedClaimId?: string,
  scrollAnchor?: string,
  maxPages?: number,
  limitClaimsPerChannel?: number,

  channelIds?: Array<string>,
  excludedChannelIds?: Array<string>,
  claimIds?: Array<string>,
  subscribedChannels: Array<Subscription>,

  header?: Node,
  headerLabel?: string | Node,
  hiddenNsfwMessage?: Node,
  injectedItem?: ListInjectedItem,
  meta?: Node,
  subSection?: Node, // Additional section below [Header|Meta]
  renderProperties?: (Claim) => Node,

  history: { action: string, push: (string) => void, replace: (string) => void },
  location: { search: string, pathname: string },

  // --- select ---
  followedTags?: Array<Tag>,
  claimSearchByQuery: { [string]: Array<string> },
  claimSearchByQueryLastPageReached: { [string]: boolean },
  claimsByUri: { [string]: any },
  claimsById: { [string]: any },
  loading: boolean,
  showNsfw: boolean,
  hideReposts: boolean,
  languageSetting: string,
  mutedUris: Array<string>,
  blockedUris: Array<string>,
  searchInLanguage: boolean,

  // --- perform ---
  doClaimSearch: ({}) => void,
  doFetchViewCount: (claimIdCsv: string) => void,
  doFetchUserMemberships: (claimIdCsv: string) => void,
  doResolveClaimIds: (Array<string>) => Promise<any>,
  doResolveUris: (Array<string>, boolean) => Promise<any>,

  hideLayoutButton?: boolean,
  loadedCallback?: (number) => void,
  maxClaimRender?: number,
  useSkeletonScreen?: boolean,
  excludeUris?: Array<string>,

  swipeLayout: boolean,
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
    subSection,
    channelIds,
    excludedChannelIds,
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
    defaultClaimType,
    streamType,
    defaultStreamType,
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
    pins,
    tileLayout,
    hideFilters = false,
    claimIds,
    maxPages,
    hideRepostsOverride,
    languageSetting,
    searchLanguages,
    searchInLanguage,
    ignoreSearchInLanguage,
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
    claimsById,
    doFetchViewCount,
    hideLayoutButton = false,
    loadedCallback,
    maxClaimRender,
    useSkeletonScreen = true,
    excludeUris = [],
    doFetchUserMemberships,
    swipeLayout = false,
    doResolveUris,
    doResolveClaimIds,
  } = props;

  const resolvedPinUris = useResolvePins({ pins, claimsById, doResolveClaimIds, doResolveUris });
  const didNavigateForward = history.action === 'PUSH';
  const { search } = location;
  const prevUris = React.useRef();
  const [page, setPage] = React.useState(1);
  const [forceRefresh, setForceRefresh] = React.useState();
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
  const [hiddenBuffer, setHiddenBuffer] = React.useState([]);
  const hideRepostsEffective = resolveHideReposts(hideReposts, hideRepostsOverride);

  const langParam = urlParams.get(CS.LANGUAGE_KEY) || null;
  const searchInSelectedLang = searchInLanguage && !ignoreSearchInLanguage;
  const languageParams = resolveLangForClaimSearch(languageSetting, searchInSelectedLang, searchLanguages, langParam);

  let claimTypeParam = claimType || defaultClaimType || null;
  let streamTypeParam = streamType || defaultStreamType || null;

  const contentTypeParam = urlParams.get(CS.CONTENT_KEY);
  if (contentTypeParam) {
    switch (contentTypeParam) {
      case CS.CLAIM_COLLECTION:
        claimTypeParam = contentTypeParam;
        streamTypeParam = undefined;
        break;
      case CS.CLAIM_REPOST:
        claimTypeParam = contentTypeParam;
        break;

      case CS.CLAIM_CHANNEL:
        claimTypeParam = CS.CLAIM_CHANNEL;
        streamTypeParam = undefined;
        break;

      case CS.FILE_VIDEO:
      case CS.FILE_AUDIO:
      case CS.FILE_IMAGE:
      case CS.FILE_MODEL:
      case CS.FILE_BINARY:
      case CS.FILE_DOCUMENT:
        streamTypeParam = contentTypeParam;
        break;

      case CS.CONTENT_ALL:
        claimTypeParam = undefined;
        streamTypeParam = undefined;
        break;

      default:
        console.log('Invalid or unhandled CONTENT_KEY:', contentTypeParam); // eslint-disable-line no-console
        break;
    }
  }

  const durationParam = urlParams.get(CS.DURATION_KEY) || null;
  const channelIdsInUrl = urlParams.get(CS.CHANNEL_IDS_KEY);
  const channelIdsParam = channelIdsInUrl ? channelIdsInUrl.split(',') : channelIds;
  const excludedIdsParam = excludedChannelIds;
  const feeAmountParam = urlParams.get('fee_amount') || feeAmount;
  const originalPageSize = 12;
  const dynamicPageSize = isLargeScreen ? Math.ceil((originalPageSize / 2) * 6) : Math.ceil((originalPageSize / 2) * 4);
  const historyAction = history.action;

  let orderParam = orderBy || urlParams.get(CS.ORDER_BY_KEY) || defaultOrderBy || orderParamEntry;

  if (!orderParam) {
    if (historyAction === 'POP') {
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
    if (historyAction !== 'POP') {
      setOrderParamEntry(orderParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyAction, setOrderParamEntry]);

  let options: {
    page_size: number,
    page: number,
    no_totals: boolean,
    any_tags?: Array<string>,
    any_languages?: Array<string>,
    not_tags: Array<string>,
    channel_ids?: Array<string>,
    claim_ids?: Array<string>,
    not_channel_ids?: Array<string>,
    order_by: Array<string>,
    release_time?: string,
    claim_type?: string | Array<string>,
    name?: string,
    duration?: string,
    reposted_claim_id?: string,
    stream_types?: any,
    fee_amount?: string,
    has_source?: boolean,
    has_no_source?: boolean,
    limit_claims_per_channel?: number,
    remove_duplicates?: boolean,
  } = {
    page_size: dynamicPageSize,
    page,
    name,
    claim_type: claimType || ['stream', 'repost', 'channel'],
    // no_totals makes it so the sdk doesn't have to calculate total number pages for pagination
    // it's faster, but we will need to remove it if we start using total_pages
    no_totals: true,
    not_channel_ids: isChannel ? undefined : mutedAndBlockedChannelIds,
    not_tags: !showNsfw ? MATURE_TAGS : [],
    order_by: resolveOrderByOption(orderParam, sortByParam),
    remove_duplicates: isChannel ? undefined : true,
  };

  if (ENABLE_NO_SOURCE_CLAIMS && hasNoSource) {
    options.has_no_source = true;
  } else if (hasSource || (!ENABLE_NO_SOURCE_CLAIMS && (!claimType || claimType === 'stream'))) {
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

  if (excludedIdsParam) {
    options.not_channel_ids = (options.not_channel_ids || []).concat(excludedIdsParam);
  }

  if (tagsParam) {
    if (tagsParam !== CS.TAGS_ALL && tagsParam !== '') {
      if (tagsParam === CS.TAGS_FOLLOWED) {
        options.any_tags = followed;
      } else if (Array.isArray(tagsParam)) {
        options.any_tags = tagsParam;
      } else {
        options.any_tags = tagsParam.split(',');
      }
    }
  }

  if (repostedClaimId) {
    // SDK chokes on reposted_claim_id of null or false, needs to not be present if no value
    options.reposted_claim_id = repostedClaimId;
  }
  // IF release time, set it, else set fallback release times using the hack below.
  if (releaseTime && claimTypeParam !== CS.CLAIM_CHANNEL) {
    options.release_time = releaseTime;
  } else if (claimTypeParam !== CS.CLAIM_CHANNEL) {
    if (orderParam === CS.ORDER_BY_TOP && freshnessParam !== CS.FRESH_ALL) {
      options.release_time = `>${Math.floor(moment().subtract(1, freshnessParam).startOf('hour').unix())}`;
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
        options.release_time = `>${Math.floor(moment().subtract(3, CS.FRESH_MONTH).startOf('week').unix())}`;
      } else if (
        (options.channel_ids && options.channel_ids.length > 10) ||
        (options.any_tags && options.any_tags.length > 10)
      ) {
        options.release_time = `>${Math.floor(moment().subtract(1, CS.FRESH_YEAR).startOf('week').unix())}`;
      } else {
        // Hack for at least the New page until https://github.com/lbryio/lbry-sdk/issues/2591 is fixed
        options.release_time = `<${Math.floor(moment().startOf('minute').unix())}`;
      }
    }
  }

  if (durationParam) {
    if (durationParam === CS.DURATION_SHORT) {
      options.duration = '<=240';
    } else if (durationParam === CS.DURATION_LONG) {
      options.duration = '>=1200';
    }
  }

  if (streamTypeParam && streamTypeParam !== CS.CONTENT_ALL && claimType !== CS.CLAIM_CHANNEL) {
    options.stream_types = typeof streamTypeParam === 'string' ? [streamTypeParam] : streamTypeParam;
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
      options.any_languages = languageParams.split(',');
    }
  }

  if (tagsParam) {
    if (tagsParam !== CS.TAGS_ALL && tagsParam !== '') {
      if (tagsParam === CS.TAGS_FOLLOWED) {
        options.any_tags = followed;
      } else if (Array.isArray(tagsParam)) {
        options.any_tags = tagsParam;
      } else {
        options.any_tags = tagsParam.split(',');
      }
    }
  }

  if (hideRepostsEffective && !options.reposted_claim_id) {
    if (Array.isArray(options.claim_type)) {
      if (options.claim_type.length > 1) {
        options.claim_type = options.claim_type.filter((claimType) => claimType !== 'repost');
      }
    } else {
      options.claim_type = ['stream', 'channel'];
    }
  }

  const hasMatureTags = tagsParam && tagsParam.split(',').some((t) => MATURE_TAGS.includes(t));

  const searchKey = createNormalizedClaimSearchKey(options);
  const claimSearchResult = claimSearchByQuery[searchKey];
  const claimSearchResultLastPageReached = claimSearchByQueryLastPageReached[searchKey];
  const isUnfetchedClaimSearch = claimSearchResult === undefined;

  // uncomment to fix an item on a page
  //   const fixUri = 'lbry://@corbettreport#0/lbryodysee#5';
  //   if (
  //     orderParam === CS.ORDER_BY_NEW &&
  //     claimSearchResult &&
  //     claimSearchResult.length > 2 &&
  //     window.location.pathname === '/$/rabbithole'
  //   ) {
  //     if (claimSearchResult.indexOf(fixUri) !== -1) {
  //       claimSearchResult.splice(claimSearchResult.indexOf(fixUri), 1);
  //     } else {
  //       claimSearchResult.pop();
  //     }
  //     claimSearchResult.splice(2, 0, fixUri);
  //   }

  const [prevOptions, setPrevOptions] = React.useState(null);

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
    !uris &&
    (claimSearchResult === undefined ||
      didNavigateForward ||
      (!loading &&
        !claimSearchResultLastPageReached &&
        claimSearchResult &&
        claimSearchResult.length &&
        claimSearchResult.length < dynamicPageSize * options.page &&
        claimSearchResult.length % dynamicPageSize === 0));

  // Don't use the query from createNormalizedClaimSearchKey for the effect since that doesn't include page & release_time
  const optionsStringForEffect = JSON.stringify(options);

  const timedOutMessage = (
    <div>
      <p>
        <I18nMessage
          tokens={{
            again: (
              <Button
                button="link"
                label={__('try again in a few seconds.')}
                onClick={() => setForceRefresh(Date.now())}
              />
            ),
          }}
        >
          Sorry, your request timed out. Modify your options or %again%
        </I18nMessage>
      </p>
      <p>
        <I18nMessage
          tokens={{
            contact_support: (
              <Button button="link" label={__('contact support')} href="https://odysee.com/@OdyseeHelp:b?view=about" />
            ),
          }}
        >
          If you continue to have issues, please %contact_support%.
        </I18nMessage>
      </p>
    </div>
  );

  // **************************************************************************
  // **************************************************************************

  let finalUris;

  if (uris) {
    // --- direct uris
    finalUris = uris;
    injectPinUrls(finalUris, orderParam, pins, resolvedPinUris);
    finalUris = filterExcludedUris(finalUris, excludeUris);
  } else {
    // --- searched uris
    if (isUnfetchedClaimSearch && prevUris.current) {
      finalUris = prevUris.current;
    } else {
      finalUris = claimSearchResult;
      injectPinUrls(finalUris, orderParam, pins, resolvedPinUris);
      finalUris = filterExcludedUris(finalUris, excludeUris);
      prevUris.current = finalUris;
    }
  }

  // **************************************************************************
  // Helpers
  // **************************************************************************

  // Returns true if the change in 'options' indicate that we are simply scrolling
  // down to a new page; false otherwise.
  function isJustScrollingToNewPage(prevOptions, options) {
    if (!prevOptions) {
      // It's a new search, or we just popped back from a different view.
      return false;
    }

    // Compare every field except for 'page' and 'release_time'.
    // There might be better ways to achieve this.
    let tmpPrevOptions = { ...prevOptions };
    tmpPrevOptions.page = -1;
    tmpPrevOptions.release_time = '';

    let tmpOptions = { ...options };
    tmpOptions.page = -1;
    tmpOptions.release_time = '';

    return JSON.stringify(tmpOptions) === JSON.stringify(tmpPrevOptions);
  }

  function getParamFromTags(t) {
    if (t === CS.TAGS_ALL || t === CS.TAGS_FOLLOWED) {
      return t;
    } else if (Array.isArray(t)) {
      return t.join(',');
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

  function resolveHideReposts(hideRepostSetting, hideRepostOverride) {
    if (hideRepostOverride === undefined || hideRepostOverride === null) {
      return hideRepostSetting;
    } else {
      return hideRepostOverride;
    }
  }

  function resolveOrderByOption(orderBy: string | Array<string>, sortBy: string | Array<string>) {
    let order_by;

    switch (orderBy) {
      case CS.ORDER_BY_TRENDING:
        order_by = CS.ORDER_BY_TRENDING_VALUE;
        break;
      case CS.ORDER_BY_NEW:
        order_by = CS.ORDER_BY_NEW_VALUE;
        break;
      case CS.ORDER_BY_NEW_ASC:
        order_by = CS.ORDER_BY_NEW_ASC_VALUE;
        break;
      case CS.ORDER_BY_NAME_ASC:
        order_by = CS.ORDER_BY_NAME_ASC_VALUE;
        break;
      default:
        order_by = CS.ORDER_BY_TOP_VALUE;
    }

    if (orderBy === CS.ORDER_BY_NEW && sortBy === CS.SORT_BY.OLDEST.key) {
      return order_by.map((x) => `${CS.SORT_BY.OLDEST.opt}${x}`);
    }

    return order_by;
  }

  function injectPinUrls(uris, order, pins, resolvedPinUris) {
    if (!pins || !uris || uris.length <= 2 || (pins.onlyPinForOrder && pins.onlyPinForOrder !== order)) {
      return;
    }

    if (resolvedPinUris) {
      resolvedPinUris.forEach((pin) => {
        if (uris.includes(pin)) {
          uris.splice(uris.indexOf(pin), 1);
        } else {
          uris.pop();
        }
      });

      uris.splice(2, 0, ...resolvedPinUris);
    }
  }

  function filterExcludedUris(uris, excludeUris) {
    if (uris && excludeUris && excludeUris.length) {
      return uris.filter((uri) => !excludeUris.includes(uri));
    }
    return uris;
  }

  function onHidden(uri) {
    if (hiddenBuffer.indexOf(uri) === -1) {
      let newBuffer = hiddenBuffer;
      newBuffer.push(uri);
      setHiddenBuffer(newBuffer);
    }
  }

  // **************************************************************************
  // **************************************************************************

  useFetchViewCount(fetchViewCount, finalUris, claimsByUri, doFetchViewCount);

  useGetUserMemberships(true, finalUris, claimsByUri, doFetchUserMemberships);

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
      hideLayoutButton={hideLayoutButton}
      hideFilters={hideFilters}
      scrollAnchor={scrollAnchor}
    />
  );

  return (
    <React.Fragment>
      {headerLabel && <label className="claim-list__header-label">{headerLabel}</label>}
      {tileLayout ? (
        <div>
          {!repostedClaimId && showHeader && (
            <div className="section__header--actions">
              <div className="section__actions">
                {headerToUse}
                {searchInSelectedLang && <LangFilterIndicator />}
              </div>
              {meta && <div className="section__actions--no-margin">{meta}</div>}
            </div>
          )}
          {subSection && <div>{subSection}</div>}
          <ClaimList
            tileLayout
            loading={loading}
            uris={finalUris}
            prefixUris={prefixUris}
            onScrollBottom={handleScrollBottom}
            page={page}
            pageSize={dynamicPageSize}
            timedOutMessage={timedOutMessage}
            renderProperties={renderProperties}
            includeSupportAction={includeSupportAction}
            injectedItem={injectedItem}
            showHiddenByUser={showHiddenByUser}
            searchOptions={options}
            showNoSourceClaims={showNoSourceClaims}
            empty={empty}
            maxClaimRender={maxClaimRender}
            loadedCallback={loadedCallback}
            swipeLayout={swipeLayout}
            onHidden={onHidden}
          />
          {loading && useSkeletonScreen && (
            <div className="claim-grid">
              {new Array(dynamicPageSize).fill(1).map((x, i) => (
                <ClaimPreviewTile key={i} placeholder="loading" pulse />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {showHeader && (
            <div className="section__header--actions">
              <div className="section__actions">
                {headerToUse}
                {searchInSelectedLang && <LangFilterIndicator />}
              </div>
              {meta && <div className="section__actions--no-margin">{meta}</div>}
            </div>
          )}
          {subSection && <div>{subSection}</div>}
          <ClaimList
            type={type}
            loading={loading}
            uris={finalUris}
            prefixUris={prefixUris}
            onScrollBottom={handleScrollBottom}
            page={page}
            pageSize={dynamicPageSize}
            timedOutMessage={timedOutMessage}
            renderProperties={renderProperties}
            includeSupportAction={includeSupportAction}
            injectedItem={injectedItem}
            showHiddenByUser={showHiddenByUser}
            searchOptions={options}
            showNoSourceClaims={hasNoSource || showNoSourceClaims}
            empty={empty}
            maxClaimRender={maxClaimRender}
            loadedCallback={loadedCallback}
            swipeLayout={swipeLayout}
            onHidden={onHidden}
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
