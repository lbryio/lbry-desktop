// @flow
import { ENABLE_NO_SOURCE_CLAIMS } from 'config';
import type { Node } from 'react';
import * as CS from 'constants/claim_search';
import React from 'react';
import usePersistedState from 'effects/use-persisted-state';
import { withRouter } from 'react-router';
import { createNormalizedClaimSearchKey, MATURE_TAGS } from 'lbry-redux';
import Button from 'component/button';
import moment from 'moment';
import ClaimList from 'component/claimList';
import ClaimPreview from 'component/claimPreview';
import ClaimPreviewTile from 'component/claimPreviewTile';
import I18nMessage from 'component/i18nMessage';
import ClaimListHeader from 'component/claimListHeader';
import { useIsLargeScreen } from 'effects/use-screensize';
import { getLivestreamOnlyOptions } from 'util/search';

type Props = {
  uris: Array<string>,
  showHeader: boolean,
  type: string,
  subscribedChannels: Array<Subscription>,
  doClaimSearch: ({}) => void,
  loading: boolean,
  personalView: boolean,
  doToggleTagFollowDesktop: (string) => void,
  meta?: Node,
  showNsfw: boolean,
  hideReposts: boolean,
  history: { action: string, push: (string) => void, replace: (string) => void },
  location: { search: string, pathname: string },
  claimSearchByQuery: {
    [string]: Array<string>,
  },
  claimSearchByQueryLastPageReached: { [string]: boolean },
  mutedUris: Array<string>,
  blockedUris: Array<string>,
  hiddenNsfwMessage?: Node,
  channelIds?: Array<string>,
  claimIds?: Array<string>,
  tags: string, // these are just going to be string. pass a CSV if you want multi
  defaultTags: string,
  orderBy?: Array<string>,
  defaultOrderBy?: string,
  freshness?: string,
  defaultFreshness?: string,
  header?: Node,
  headerLabel?: string | Node,
  name?: string,
  hideAdvancedFilter?: boolean,
  claimType?: string | Array<string>,
  defaultClaimType?: Array<string>,
  streamType?: string | Array<string>,
  defaultStreamType?: string | Array<string>,
  renderProperties?: (Claim) => Node,
  includeSupportAction?: boolean,
  repostedClaimId?: string,
  pageSize?: number,
  followedTags?: Array<Tag>,
  injectedItem: ?Node,
  infiniteScroll?: Boolean,
  feeAmount?: string,
  tileLayout: boolean,
  hideFilters?: boolean,
  maxPages?: number,
  forceShowReposts?: boolean,
  languageSetting: string,
  searchInLanguage: boolean,
  scrollAnchor?: string,
  showHiddenByUser?: boolean,
  liveLivestreamsFirst?: boolean,
  livestreamMap?: { [string]: any },
  hasSource?: boolean,
  limitClaimsPerChannel?: number,
  releaseTime?: string,
  hideLivestreamClaims?: boolean,
  isChannel?: boolean,
  channelIsMine?: boolean,
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
    history,
    location,
    mutedUris,
    blockedUris,
    hiddenNsfwMessage,
    defaultOrderBy,
    orderBy,
    headerLabel,
    header,
    name,
    claimType,
    pageSize,
    defaultClaimType,
    streamType = CS.FILE_VIDEO,
    defaultStreamType = CS.FILE_VIDEO,
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
    liveLivestreamsFirst,
    livestreamMap,
    hasSource,
    isChannel = false,
    channelIsMine = false,
    hideLivestreamClaims,
  } = props;
  const didNavigateForward = history.action === 'PUSH';
  const { search } = location;
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
  const mutedAndBlockedChannelIds = Array.from(new Set(mutedUris.concat(blockedUris).map((uri) => uri.split('#')[1])));

  const langParam = urlParams.get(CS.LANGUAGE_KEY) || null;
  const languageParams = searchInLanguage
    ? langParam === null
      ? languageSetting.concat(languageSetting === 'en' ? ',none' : '')
      : langParam === 'any'
      ? null
      : langParam.concat(langParam === 'en' ? ',none' : '')
    : langParam === null
    ? null
    : langParam === 'any'
    ? null
    : langParam.concat(langParam === 'en' ? ',none' : '');

  const contentTypeParam = urlParams.get(CS.CONTENT_KEY);
  const claimTypeParam =
    claimType || (CS.CLAIM_TYPES.includes(contentTypeParam) && contentTypeParam) || defaultClaimType || null;
  const streamTypeParam =
    streamType || (CS.FILE_TYPES.includes(contentTypeParam) && contentTypeParam) || defaultStreamType || null;
  const durationParam = urlParams.get(CS.DURATION_KEY) || null;
  const channelIdsInUrl = urlParams.get(CS.CHANNEL_IDS_KEY);
  const channelIdsParam = channelIdsInUrl ? channelIdsInUrl.split(',') : channelIds;
  const feeAmountParam = urlParams.get('fee_amount') || feeAmount || CS.FEE_AMOUNT_ONLY_FREE;
  const originalPageSize = pageSize || CS.PAGE_SIZE;
  const dynamicPageSize = isLargeScreen ? Math.ceil(originalPageSize * (3 / 2)) : originalPageSize;
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
  } = {
    page_size: dynamicPageSize,
    page,
    name,
    claim_type: claimType || undefined,
    // no_totals makes it so the sdk doesn't have to calculate total number pages for pagination
    // it's faster, but we will need to remove it if we start using total_pages
    no_totals: true,
    not_channel_ids: isChannel ? undefined : mutedAndBlockedChannelIds,
    not_tags: !showNsfw ? MATURE_TAGS : [],
    order_by:
      orderParam === CS.ORDER_BY_TRENDING
        ? CS.ORDER_BY_TRENDING_VALUE
        : orderParam === CS.ORDER_BY_NEW
        ? CS.ORDER_BY_NEW_VALUE
        : CS.ORDER_BY_TOP_VALUE, // Sort by top
  };

  if (hasSource || (!ENABLE_NO_SOURCE_CLAIMS && (!claimType || claimType === CS.CLAIM_STREAM))) {
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

  if (releaseTime) {
    options.release_time = releaseTime;
  } else if (claimType !== CS.CLAIM_CHANNEL) {
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
    options.stream_types = [streamTypeParam];
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

  if (hideReposts && !options.reposted_claim_id && !forceShowReposts) {
    if (Array.isArray(options.claim_type)) {
      if (options.claim_type.length > 1) {
        options.claim_type = options.claim_type.filter((claimType) => claimType !== 'repost');
      }
    } else {
      options.claim_type = ['stream', 'channel'];
    }
  }

  const hasMatureTags = tagsParam && tagsParam.split(',').some((t) => MATURE_TAGS.includes(t));
  const claimSearchCacheQuery = createNormalizedClaimSearchKey(options);
  let claimSearchResult = claimSearchByQuery[claimSearchCacheQuery];
  const claimSearchResultLastPageReached = claimSearchByQueryLastPageReached[claimSearchCacheQuery];

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
            contact_support: <Button button="link" label={__('contact support')} href="https://lbry.com/faq/support" />,
          }}
        >
          If you continue to have issues, please %contact_support%.
        </I18nMessage>
      </p>
    </div>
  );

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

  React.useEffect(() => {
    if (shouldPerformSearch) {
      const searchOptions = JSON.parse(optionsStringForEffect);
      doClaimSearch(searchOptions);

      if (liveLivestreamsFirst && options.page === 1) {
        doClaimSearch(getLivestreamOnlyOptions(searchOptions));
      }
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
      //   feeAmount={feeAmount}
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
            id={claimSearchCacheQuery}
            loading={loading}
            uris={uris || claimSearchResult}
            onScrollBottom={handleScrollBottom}
            page={page}
            pageSize={dynamicPageSize}
            timedOutMessage={timedOutMessage}
            renderProperties={renderProperties}
            includeSupportAction={includeSupportAction}
            injectedItem={injectedItem}
            showHiddenByUser={showHiddenByUser}
            liveLivestreamsFirst={liveLivestreamsFirst}
            livestreamMap={livestreamMap}
            searchOptions={options}
            channelIsMine={channelIsMine}
            hideLivestreamClaims={hideLivestreamClaims}
          />
          {loading && (
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
            id={claimSearchCacheQuery}
            type={type}
            loading={loading}
            uris={uris || claimSearchResult}
            onScrollBottom={handleScrollBottom}
            page={page}
            pageSize={dynamicPageSize}
            timedOutMessage={timedOutMessage}
            renderProperties={renderProperties}
            includeSupportAction={includeSupportAction}
            injectedItem={injectedItem}
            showHiddenByUser={showHiddenByUser}
            liveLivestreamsFirst={liveLivestreamsFirst}
            livestreamMap={livestreamMap}
            searchOptions={options}
            hideLivestreamClaims={hideLivestreamClaims}
          />
          {loading &&
            new Array(dynamicPageSize)
              .fill(1)
              .map((x, i) => <ClaimPreview key={i} placeholder="loading" type={type} />)}
        </div>
      )}
    </React.Fragment>
  );
}

export default withRouter(ClaimListDiscover);
