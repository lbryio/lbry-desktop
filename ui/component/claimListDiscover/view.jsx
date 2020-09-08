// @flow
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
import I18nMessage from 'component/i18nMessage';
import ClaimListHeader from 'component/claimListHeader';

type Props = {
  uris: Array<string>,
  subscribedChannels: Array<Subscription>,
  doClaimSearch: ({}) => void,
  loading: boolean,
  personalView: boolean,
  doToggleTagFollowDesktop: string => void,
  meta?: Node,
  showNsfw: boolean,
  hideReposts: boolean,
  history: { action: string, push: string => void, replace: string => void },
  location: { search: string, pathname: string },
  claimSearchByQuery: {
    [string]: Array<string>,
  },
  claimSearchByQueryLastPageReached: { [string]: boolean },
  hiddenUris: Array<string>,
  hiddenNsfwMessage?: Node,
  channelIds?: Array<string>,
  tags: string, // these are just going to be string. pass a CSV if you want multi
  defaultTags: string,
  orderBy?: Array<string>,
  defaultOrderBy?: string,
  freshness?: string,
  defaultFreshness?: string,
  header?: Node,
  headerLabel?: string | Node,
  name?: string,
  hideBlock?: boolean,
  hideFilter?: boolean,
  claimType?: Array<string>,
  defaultClaimType?: Array<string>,
  streamType?: string | Array<string>,
  defaultStreamType?: string | Array<string>,
  renderProperties?: Claim => Node,
  includeSupportAction?: boolean,
  repostedClaimId?: string,
  pageSize?: number,
  followedTags?: Array<Tag>,
  injectedItem: ?Node,
  infiniteScroll?: Boolean,
  feeAmount?: string,
  tileLayout: boolean,
};

function ClaimListDiscover(props: Props) {
  const {
    doClaimSearch,
    claimSearchByQuery,
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
    hiddenUris,
    hiddenNsfwMessage,
    defaultOrderBy,
    orderBy,
    headerLabel,
    header,
    name,
    claimType,
    pageSize,
    hideBlock,
    defaultClaimType,
    streamType,
    defaultStreamType,
    freshness,
    defaultFreshness = CS.FRESH_WEEK,
    renderProperties,
    includeSupportAction,
    repostedClaimId,
    hideFilter,
    infiniteScroll = true,
    followedTags,
    injectedItem,
    feeAmount,
    uris,
    tileLayout,
  } = props;
  const didNavigateForward = history.action === 'PUSH';
  const { search } = location;
  const [page, setPage] = React.useState(1);
  const [forceRefresh, setForceRefresh] = React.useState();
  const [orderParamEntry, setOrderParamEntry] = usePersistedState(`entry-${location.pathname}`, CS.ORDER_BY_TRENDING);
  const [orderParamUser, setOrderParamUser] = usePersistedState(`orderUser-${location.pathname}`, CS.ORDER_BY_TRENDING);
  const followed = (followedTags && followedTags.map(t => t.name)) || [];
  const urlParams = new URLSearchParams(search);
  const tagsParam = // can be 'x,y,z' or 'x' or ['x','y'] or CS.CONSTANT
    (tags && getParamFromTags(tags)) ||
    (urlParams.get(CS.TAGS_KEY) !== null && urlParams.get(CS.TAGS_KEY)) ||
    (defaultTags && getParamFromTags(defaultTags));
  const freshnessParam = freshness || urlParams.get(CS.FRESH_KEY) || defaultFreshness;
  const contentTypeParam = urlParams.get(CS.CONTENT_KEY);
  const claimTypeParam =
    claimType || (CS.CLAIM_TYPES.includes(contentTypeParam) && contentTypeParam) || defaultClaimType || null;
  const streamTypeParam =
    streamType || (CS.FILE_TYPES.includes(contentTypeParam) && contentTypeParam) || defaultStreamType || null;
  const durationParam = urlParams.get(CS.DURATION_KEY) || null;
  const channelIdsInUrl = urlParams.get(CS.CHANNEL_IDS_KEY);
  const channelIdsParam = channelIdsInUrl ? channelIdsInUrl.split(',') : channelIds;
  const feeAmountParam = urlParams.get('fee_amount') || feeAmount || CS.FEE_AMOUNT_ANY;

  let orderParam = orderBy || urlParams.get(CS.ORDER_BY_KEY) || defaultOrderBy;
  if (!orderParam) {
    if (history.action === 'POP') {
      // Reaching here means user have popped back to the page's entry point (e.g. '/$/tags' without any '?order=').
      orderParam = orderParamEntry;
    } else {
      // This is the direct entry into the page, so we load the user's previous value.
      orderParam = orderParamUser;
    }
  }

  React.useEffect(() => {
    setOrderParamUser(orderParam);
  }, [orderParam]);

  React.useEffect(() => {
    // One-time update to stash the finalized 'orderParam' at entry.
    if (history.action !== 'POP') {
      setOrderParamEntry(orderParam);
    }
  }, []);

  let options: {
    page_size: number,
    page: number,
    no_totals: boolean,
    any_tags?: Array<string>,
    not_tags: Array<string>,
    channel_ids: Array<string>,
    not_channel_ids: Array<string>,
    order_by: Array<string>,
    release_time?: string,
    claim_type?: Array<string>,
    name?: string,
    duration?: string,
    reposted_claim_id?: string,
    stream_types?: any,
    fee_amount?: string,
  } = {
    page_size: pageSize || CS.PAGE_SIZE,
    page,
    name,
    claim_type: claimType || undefined,
    // no_totals makes it so the sdk doesn't have to calculate total number pages for pagination
    // it's faster, but we will need to remove it if we start using total_pages
    no_totals: true,
    channel_ids: channelIdsParam || [],
    not_channel_ids:
      // If channelIdsParam were passed in, we don't need not_channel_ids
      !channelIdsParam && hiddenUris && hiddenUris.length ? hiddenUris.map(hiddenUri => hiddenUri.split('#')[1]) : [],
    not_tags: !showNsfw ? MATURE_TAGS : [],
    order_by:
      orderParam === CS.ORDER_BY_TRENDING
        ? CS.ORDER_BY_TRENDING_VALUE
        : orderParam === CS.ORDER_BY_NEW
        ? CS.ORDER_BY_NEW_VALUE
        : CS.ORDER_BY_TOP_VALUE, // Sort by top
  };

  if (repostedClaimId) {
    // SDK chokes on reposted_claim_id of null or false, needs to not be present if no value
    options.reposted_claim_id = repostedClaimId;
  }

  if (orderParam === CS.ORDER_BY_TOP && freshnessParam !== CS.FRESH_ALL) {
    options.release_time = `>${Math.floor(
      moment()
        .subtract(1, freshnessParam)
        .startOf('hour')
        .unix()
    )}`;
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
      options.release_time = `>${Math.floor(
        moment()
          .subtract(3, CS.FRESH_MONTH)
          .startOf('week')
          .unix()
      )}`;
    } else if (
      (options.channel_ids && options.channel_ids.length > 10) ||
      (options.any_tags && options.any_tags.length > 10)
    ) {
      options.release_time = `>${Math.floor(
        moment()
          .subtract(1, CS.FRESH_YEAR)
          .startOf('week')
          .unix()
      )}`;
    } else {
      // Hack for at least the New page until https://github.com/lbryio/lbry-sdk/issues/2591 is fixed
      options.release_time = `<${Math.floor(
        moment()
          .startOf('minute')
          .unix()
      )}`;
    }
  }

  if (feeAmountParam) {
    options.fee_amount = feeAmountParam;
  }

  if (durationParam) {
    if (durationParam === CS.DURATION_SHORT) {
      options.duration = '<=1800';
    } else if (durationParam === CS.DURATION_LONG) {
      options.duration = '>=1800';
    }
  }

  if (streamTypeParam) {
    if (streamTypeParam !== CS.CONTENT_ALL) {
      options.stream_types = [streamTypeParam];
    }
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
  // https://github.com/lbryio/lbry-desktop/issues/3774
  if (hideReposts && !options.reposted_claim_id) {
    // and not claimrepostid
    if (Array.isArray(options.claim_type)) {
      if (options.claim_type.length > 1) {
        options.claim_type = options.claim_type.filter(claimType => claimType !== 'repost');
      }
    } else {
      options.claim_type = ['stream', 'channel'];
    }
  }

  const hasMatureTags = tagsParam && tagsParam.split(',').some(t => MATURE_TAGS.includes(t));
  const claimSearchCacheQuery = createNormalizedClaimSearchKey(options);
  const claimSearchResult = claimSearchByQuery[claimSearchCacheQuery];
  const claimSearchResultLastPageReached = claimSearchByQueryLastPageReached[claimSearchCacheQuery];

  const [prevOptions, setPrevOptions] = React.useState(null);

  if (!isJustScrollingToNewPage(prevOptions, options)) {
    // --- New search, or search options changed.
    setPrevOptions(options);

    if (didNavigateForward) {
      // --- Reset to top.
      window.scrollTo(0, 0); // Prevents onScrollBottom() from re-hitting while waiting for doClaimQuery():
      options.page = 1;
      setPage(options.page);
    } else if (claimSearchResult) {
      // --- Update 'page' based on retrieved 'claimSearchResult'.
      options.page = Math.ceil(claimSearchResult.length / CS.PAGE_SIZE);
      if (options.page !== page) {
        setPage(options.page);
      }
    }
  }

  const shouldPerformSearch =
    claimSearchResult === undefined ||
    didNavigateForward ||
    (!loading &&
      claimSearchResult &&
      claimSearchResult.length &&
      claimSearchResult.length < CS.PAGE_SIZE * options.page &&
      claimSearchResult.length % CS.PAGE_SIZE === 0);

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
      feeAmount={feeAmount}
      orderBy={orderBy}
      defaultOrderBy={defaultOrderBy}
      hideFilter={hideFilter}
      hasMatureTags={hasMatureTags}
      hiddenNsfwMessage={hiddenNsfwMessage}
      setPage={setPage}
      tileLayout={tileLayout}
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
              {meta && <div className="card__actions--inline">{meta}</div>}
            </div>
          )}
          <ClaimList
            tileLayout
            id={claimSearchCacheQuery}
            loading={loading}
            uris={uris || claimSearchResult}
            onScrollBottom={handleScrollBottom}
            page={page}
            pageSize={CS.PAGE_SIZE}
            timedOutMessage={timedOutMessage}
            renderProperties={renderProperties}
            includeSupportAction={includeSupportAction}
            hideBlock={hideBlock}
            injectedItem={injectedItem}
          />
        </div>
      ) : (
        <div>
          <div className="section__header--actions">
            {headerToUse}
            {meta && <div className="card__actions--inline">{meta}</div>}
          </div>

          <ClaimList
            id={claimSearchCacheQuery}
            loading={loading}
            uris={uris || claimSearchResult}
            onScrollBottom={handleScrollBottom}
            page={page}
            pageSize={CS.PAGE_SIZE}
            timedOutMessage={timedOutMessage}
            renderProperties={renderProperties}
            includeSupportAction={includeSupportAction}
            hideBlock={hideBlock}
            injectedItem={injectedItem}
          />
          {loading &&
            new Array(pageSize || CS.PAGE_SIZE).fill(1).map((x, i) => <ClaimPreview key={i} placeholder="loading" />)}
        </div>
      )}
    </React.Fragment>
  );
}

export default withRouter(ClaimListDiscover);
