// @flow
import type { Node } from 'react';
import React, { Fragment, useEffect } from 'react';
import { withRouter } from 'react-router';
import { createNormalizedClaimSearchKey, MATURE_TAGS } from 'lbry-redux';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import moment from 'moment';
import ClaimList from 'component/claimList';
import Tag from 'component/tag';
import ClaimPreview from 'component/claimPreview';
import { updateQueryParam } from 'util/query-params';
import { toCapitalCase } from 'util/string';

const PAGE_SIZE = 20;
const TIME_DAY = 'day';
const TIME_WEEK = 'week';
const TIME_MONTH = 'month';
const TIME_YEAR = 'year';
const TIME_ALL = 'all';
const SEARCH_SORT_YOU = 'you';
const SEARCH_SORT_ALL = 'everyone';
const SEARCH_SORT_CHANNELS = 'channels';

const TYPE_TRENDING = 'trending';
const TYPE_TOP = 'top';
const TYPE_NEW = 'new';
const SEARCH_FILTER_TYPES = [SEARCH_SORT_YOU, SEARCH_SORT_CHANNELS, SEARCH_SORT_ALL];
const SEARCH_TYPES = [TYPE_TRENDING, TYPE_TOP, TYPE_NEW];
const SEARCH_TIMES = [TIME_DAY, TIME_WEEK, TIME_MONTH, TIME_YEAR, TIME_ALL];

type Props = {
  uris: Array<string>,
  subscribedChannels: Array<Subscription>,
  doClaimSearch: ({}) => void,
  injectedItem: any,
  tags: Array<string>,
  loading: boolean,
  personalView: boolean,
  doToggleTagFollow: string => void,
  meta?: Node,
  showNsfw: boolean,
  history: { action: string, push: string => void, replace: string => void },
  location: { search: string, pathname: string },
  claimSearchByQuery: {
    [string]: Array<string>,
  },
  hiddenUris: Array<string>,
};

function ClaimListDiscover(props: Props) {
  const {
    doClaimSearch,
    claimSearchByQuery,
    tags,
    loading,
    personalView,
    injectedItem,
    meta,
    subscribedChannels,
    showNsfw,
    history,
    location,
    hiddenUris,
  } = props;
  const didNavigateForward = history.action === 'PUSH';
  const { search, pathname } = location;
  const urlParams = new URLSearchParams(search);
  const personalSort = urlParams.get('sort') || SEARCH_SORT_YOU;
  const typeSort = urlParams.get('type') || TYPE_TRENDING;
  const timeSort = urlParams.get('time') || TIME_WEEK;
  const page = Number(urlParams.get('page')) || 1;
  const tagsInUrl = urlParams.get('t') || '';
  const url = `${pathname}${search}`;
  const options: {
    page_size: number,
    page: number,
    no_totals: boolean,
    any_tags: Array<string>,
    channel_ids: Array<string>,
    not_channel_ids: Array<string>,
    not_tags: Array<string>,
    order_by: Array<string>,
    release_time?: string,
  } = {
    page_size: PAGE_SIZE,
    page,
    // no_totals makes it so the sdk doesn't have to calculate total number pages for pagination
    // it's faster, but we will need to remove it if we start using total_pages
    no_totals: true,
    any_tags: (personalView && personalSort === SEARCH_SORT_YOU) || !personalView ? tags : [],
    channel_ids: personalSort === SEARCH_SORT_CHANNELS ? subscribedChannels.map(sub => sub.uri.split('#')[1]) : [],
    not_channel_ids: hiddenUris && hiddenUris.length ? hiddenUris.map(hiddenUri => hiddenUri.split('#')[1]) : [],
    not_tags: !showNsfw ? MATURE_TAGS : [],
    order_by:
      typeSort === TYPE_TRENDING
        ? ['trending_global', 'trending_mixed']
        : typeSort === TYPE_NEW
        ? ['release_time']
        : ['effective_amount'], // Sort by top
  };

  if (typeSort === TYPE_TOP && timeSort !== TIME_ALL) {
    options.release_time = `>${Math.floor(
      moment()
        .subtract(1, timeSort)
        .unix()
    )}`;
  }
  const hasContent =
    (personalSort === SEARCH_SORT_CHANNELS && subscribedChannels.length) ||
    (personalSort === SEARCH_SORT_YOU && !!tags.length) ||
    personalSort === SEARCH_SORT_ALL;
  const claimSearchCacheQuery = createNormalizedClaimSearchKey(options);
  const uris = (hasContent && claimSearchByQuery[claimSearchCacheQuery]) || [];
  const shouldPerformSearch =
    hasContent &&
    (uris.length === 0 ||
      didNavigateForward ||
      (!loading && uris.length < PAGE_SIZE * page && uris.length % PAGE_SIZE === 0));
  // Don't use the query from createNormalizedClaimSearchKey for the effect since that doesn't include page & release_time
  const optionsStringForEffect = JSON.stringify(options);

  const noChannels = (
    <div>
      <p>{__("You're not following any channels.")}</p>
      <Button button={'link'} navigate={'/?type=trending&sort=everyone'}>
        {__("Look what's trending for everyone")}
      </Button>{' '}
      {__('or')}{' '}
      <Button button={'link'} navigate={'/$/following'}>
        {__('Discover some channels!')}
      </Button>
    </div>
  );

  const emptyState = personalSort === SEARCH_SORT_CHANNELS ? noChannels : false;

  function getSearch() {
    let search = `?`;
    if (!personalView) {
      search += `t=${tagsInUrl}&`;
    }

    return search;
  }

  function handleTypeSort(newTypeSort) {
    let url = `${getSearch()}type=${newTypeSort}&sort=${personalSort}`;
    if (newTypeSort === TYPE_TOP) {
      url += `&time=${timeSort}`;
    }
    history.push(url);
  }

  function handlePersonalSort(newPersonalSort) {
    history.push(`${getSearch()}type=${typeSort}&sort=${newPersonalSort}`);
  }

  function handleTimeSort(newTimeSort) {
    history.push(`${getSearch()}type=${typeSort}&sort=${personalSort}&time=${newTimeSort}`);
  }

  function handleScrollBottom() {
    if (!loading) {
      const uri = updateQueryParam(url, 'page', page + 1);
      history.replace(uri);
    }
  }

  useEffect(() => {
    if (shouldPerformSearch) {
      const searchOptions = JSON.parse(optionsStringForEffect);
      doClaimSearch(searchOptions);
    }
  }, [doClaimSearch, shouldPerformSearch, optionsStringForEffect]);

  const header = (
    <Fragment>
      <FormField
        className="claim-list__dropdown"
        type="select"
        name="trending_sort"
        value={typeSort}
        onChange={e => handleTypeSort(e.target.value)}
      >
        {SEARCH_TYPES.map(type => (
          <option key={type} value={type}>
            {toCapitalCase(type)}
          </option>
        ))}
      </FormField>
      <span>{__('For')}</span>
      {!personalView && tags && tags.length ? (
        tags.map(tag => <Tag key={tag} name={tag} disabled />)
      ) : (
        <FormField
          type="select"
          name="trending_overview"
          className="claim-list__dropdown"
          value={personalSort}
          onChange={e => {
            handlePersonalSort(e.target.value);
          }}
        >
          {SEARCH_FILTER_TYPES.map(type => (
            <option key={type} value={type}>
              {type === SEARCH_SORT_ALL
                ? __('Everyone')
                : type === SEARCH_SORT_YOU
                ? __('Tags You Follow')
                : __('Channels You Follow')}
            </option>
          ))}
        </FormField>
      )}
      {typeSort === 'top' && (
        <FormField
          className="claim-list__dropdown"
          type="select"
          name="trending_time"
          value={timeSort}
          onChange={e => handleTimeSort(e.target.value)}
        >
          {SEARCH_TIMES.map(time => (
            <option key={time} value={time}>
              {/* i18fixme */}
              {time === TIME_DAY && __('Today')}
              {time !== TIME_ALL && time !== TIME_DAY && `${__('This')} ${toCapitalCase(time)}`}
              {time === TIME_ALL && __('All time')}
            </option>
          ))}
        </FormField>
      )}
    </Fragment>
  );

  return (
    <div className="card">
      <ClaimList
        id={claimSearchCacheQuery}
        loading={loading}
        uris={uris}
        injectedItem={personalSort === SEARCH_SORT_YOU && injectedItem}
        header={header}
        headerAltControls={meta}
        onScrollBottom={handleScrollBottom}
        page={page}
        pageSize={PAGE_SIZE}
        empty={emptyState}
      />

      {loading && new Array(PAGE_SIZE).fill(1).map((x, i) => <ClaimPreview key={i} placeholder="loading" />)}
    </div>
  );
}

export default withRouter(ClaimListDiscover);
