// @flow
import type { Node } from 'react';
import classnames from 'classnames';
import React, { Fragment, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import * as CS from 'constants/claim_search';
import { createNormalizedClaimSearchKey, MATURE_TAGS } from 'lbry-redux';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import moment from 'moment';
import ClaimList from 'component/claimList';
import ClaimPreview from 'component/claimPreview';
import { toCapitalCase } from 'util/string';
import I18nMessage from 'component/i18nMessage';
import * as ICONS from 'constants/icons';
import Card from 'component/common/card';

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
};

function ClaimListDiscover(props: Props) {
  const {
    doClaimSearch,
    claimSearchByQuery,
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
  } = props;
  const didNavigateForward = history.action === 'PUSH';
  const { search } = location;

  const [page, setPage] = useState(1);
  const [forceRefresh, setForceRefresh] = useState();
  const [expanded, setExpanded] = useState(false);
  const followed = (followedTags && followedTags.map(t => t.name)) || [];
  const urlParams = new URLSearchParams(search);
  const tagsParam = // can be 'x,y,z' or 'x' or ['x','y'] or CS.CONSTANT
    (tags && getParamFromTags(tags)) ||
    (urlParams.get(CS.TAGS_KEY) !== null && urlParams.get(CS.TAGS_KEY)) ||
    (defaultTags && getParamFromTags(defaultTags));
  const orderParam = orderBy || urlParams.get(CS.ORDER_BY_KEY) || defaultOrderBy || CS.ORDER_BY_TRENDING;
  const freshnessParam = freshness || urlParams.get(CS.FRESH_KEY) || defaultFreshness;
  const contentTypeParam = urlParams.get(CS.CONTENT_KEY);
  const claimTypeParam =
    claimType || (CS.CLAIM_TYPES.includes(contentTypeParam) && contentTypeParam) || defaultClaimType || null;
  const streamTypeParam =
    streamType || (CS.FILE_TYPES.includes(contentTypeParam) && contentTypeParam) || defaultStreamType || null;
  const durationParam = urlParams.get(CS.DURATION_KEY) || null;
  const channelIdsInUrl = urlParams.get(CS.CHANNEL_IDS);
  const channelIdsParam = channelIdsInUrl ? channelIdsInUrl.split(',') : channelIds;
  const showDuration = !(claimType && claimType === CS.CLAIM_CHANNEL);
  const isFiltered = () =>
    Boolean(
      urlParams.get(CS.FRESH_KEY) ||
        urlParams.get(CS.CONTENT_KEY) ||
        urlParams.get(CS.DURATION_KEY) ||
        urlParams.get(CS.TAGS_KEY)
    );

  useEffect(() => {
    if (isFiltered()) setExpanded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (feeAmount) {
    options.fee_amount = feeAmount;
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

  const shouldPerformSearch =
    claimSearchResult === undefined ||
    didNavigateForward ||
    (!loading &&
      claimSearchResult &&
      claimSearchResult.length &&
      claimSearchResult.length < CS.PAGE_SIZE * page &&
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

  function handleChange(change) {
    const url = buildUrl(change);
    setPage(1);
    history.push(url);
  }

  function getParamFromTags(t) {
    if (t === CS.TAGS_ALL || t === CS.TAGS_FOLLOWED) {
      return t;
    } else if (Array.isArray(t)) {
      return t.join(',');
    }
  }

  function buildUrl(delta) {
    const newUrlParams = new URLSearchParams();
    CS.KEYS.forEach(k => {
      // $FlowFixMe append() can't take null as second arg, but get() can return null
      if (urlParams.get(k) !== null) newUrlParams.append(k, urlParams.get(k));
    });

    switch (delta.key) {
      case CS.ORDER_BY_KEY:
        newUrlParams.set(CS.ORDER_BY_KEY, delta.value);
        break;
      case CS.FRESH_KEY:
        if (delta.value === defaultFreshness || delta.value === CS.FRESH_DEFAULT) {
          newUrlParams.delete(CS.FRESH_KEY);
        } else {
          newUrlParams.set(CS.FRESH_KEY, delta.value);
        }
        break;
      case CS.CONTENT_KEY:
        if (delta.value === CS.CLAIM_CHANNEL || delta.value === CS.CLAIM_REPOST) {
          newUrlParams.delete(CS.DURATION_KEY);
          newUrlParams.set(CS.CONTENT_KEY, delta.value);
        } else if (delta.value === CS.CONTENT_ALL) {
          newUrlParams.delete(CS.CONTENT_KEY);
        } else {
          newUrlParams.set(CS.CONTENT_KEY, delta.value);
        }
        break;
      case CS.DURATION_KEY:
        if (delta.value === CS.DURATION_ALL) {
          newUrlParams.delete(CS.DURATION_KEY);
        } else {
          newUrlParams.set(CS.DURATION_KEY, delta.value);
        }
        break;
      case CS.TAGS_KEY:
        if (delta.value === CS.TAGS_ALL) {
          if (defaultTags === CS.TAGS_ALL) {
            newUrlParams.delete(CS.TAGS_KEY);
          } else {
            newUrlParams.set(CS.TAGS_KEY, delta.value);
          }
        } else if (delta.value === CS.TAGS_FOLLOWED) {
          if (defaultTags === CS.TAGS_FOLLOWED) {
            newUrlParams.delete(CS.TAGS_KEY);
          } else {
            newUrlParams.set(CS.TAGS_KEY, delta.value); // redundant but special
          }
        } else {
          newUrlParams.set(CS.TAGS_KEY, delta.value);
        }
        break;
    }
    return `?${newUrlParams.toString()}`;
  }

  function handleScrollBottom() {
    if (!loading && infiniteScroll) {
      setPage(page + 1);
    }
  }

  useEffect(() => {
    if (shouldPerformSearch) {
      const searchOptions = JSON.parse(optionsStringForEffect);
      doClaimSearch(searchOptions);
    }
  }, [doClaimSearch, shouldPerformSearch, optionsStringForEffect, forceRefresh]);

  const defaultHeader = repostedClaimId ? null : (
    <Fragment>
      <div className={'claim-search__wrapper'}>
        <div className={'claim-search__top'}>
          <div className={'claim-search__top-row'}>
            {CS.ORDER_BY_TYPES.map(type => (
              <Button
                key={type}
                button="alt"
                onClick={e =>
                  handleChange({
                    key: CS.ORDER_BY_KEY,
                    value: type,
                  })
                }
                className={classnames(`button-toggle button-toggle--${type}`, {
                  'button-toggle--active': orderParam === type,
                })}
                disabled={orderBy}
                icon={toCapitalCase(type)}
                label={__(toCapitalCase(type))}
              />
            ))}
          </div>
          <div>
            {!hideFilter && (
              <Button
                button={'alt'}
                aria-label={__('More')}
                className={classnames(`button-toggle button-toggle--top button-toggle--more`, {
                  'button-toggle--custom': isFiltered(),
                })}
                icon={ICONS.SLIDERS}
                onClick={() => setExpanded(!expanded)}
              />
            )}
          </div>
        </div>
        {expanded && (
          <>
            <div className={classnames('card--inline', `claim-search__menus`)}>
              {/* FRESHNESS FIELD */}
              {orderParam === CS.ORDER_BY_TOP && (
                <div className={'claim-search__input-container'}>
                  <FormField
                    className={classnames('claim-search__dropdown', {
                      'claim-search__dropdown--selected': freshnessParam !== defaultFreshness,
                    })}
                    type="select"
                    name="trending_time"
                    label={__('How Fresh')}
                    value={freshnessParam}
                    onChange={e =>
                      handleChange({
                        key: CS.FRESH_KEY,
                        value: e.target.value,
                      })
                    }
                  >
                    {CS.FRESH_TYPES.map(time => (
                      <option key={time} value={time}>
                        {/* i18fixme */}
                        {time === CS.FRESH_DAY && __('Today')}
                        {time !== CS.FRESH_ALL &&
                          time !== CS.FRESH_DEFAULT &&
                          time !== CS.FRESH_DAY &&
                          __('This ' + toCapitalCase(time)) /* yes, concat before i18n, since it is read from const */}
                        {time === CS.FRESH_ALL && __('All time')}
                        {time === CS.FRESH_DEFAULT && __('Default')}
                      </option>
                    ))}
                  </FormField>
                </div>
              )}

              {/* CONTENT_TYPES FIELD */}
              {!claimType && (
                <div
                  className={classnames('claim-search__input-container', {
                    'claim-search__input-container--selected': contentTypeParam,
                  })}
                >
                  <FormField
                    className={classnames('claim-search__dropdown', {
                      'claim-search__dropdown--selected': contentTypeParam,
                    })}
                    type="select"
                    name="claimType"
                    label={__('Content Type')}
                    value={contentTypeParam || CS.CONTENT_ALL}
                    onChange={e =>
                      handleChange({
                        key: CS.CONTENT_KEY,
                        value: e.target.value,
                      })
                    }
                  >
                    {CS.CONTENT_TYPES.map(type => {
                      if (type !== CS.CLAIM_CHANNEL || (type === CS.CLAIM_CHANNEL && !channelIdsParam)) {
                        return (
                          <option key={type} value={type}>
                            {/* i18fixme */}
                            {type === CS.CLAIM_CHANNEL && __('Channel')}
                            {type === CS.CLAIM_REPOST && __('Repost')}
                            {type === CS.FILE_VIDEO && __('Video')}
                            {type === CS.FILE_AUDIO && __('Audio')}
                            {type === CS.FILE_IMAGE && __('Image')}
                            {type === CS.FILE_MODEL && __('Model')}
                            {type === CS.FILE_BINARY && __('Other')}
                            {type === CS.FILE_DOCUMENT && __('Document')}
                            {type === CS.CONTENT_ALL && __('Any')}
                          </option>
                        );
                      }
                    })}
                  </FormField>
                </div>
              )}
              {/* DURATIONS FIELD */}
              {showDuration && (
                <div className={'claim-search__input-container'}>
                  <FormField
                    className={classnames('claim-search__dropdown', {
                      'claim-search__dropdown--selected': durationParam,
                    })}
                    label={__('Duration')}
                    type="select"
                    name="duration"
                    disabled={
                      !(
                        contentTypeParam === null ||
                        streamTypeParam === CS.FILE_AUDIO ||
                        streamTypeParam === CS.FILE_VIDEO
                      )
                    }
                    value={durationParam || CS.DURATION_ALL}
                    onChange={e =>
                      handleChange({
                        key: CS.DURATION_KEY,
                        value: e.target.value,
                      })
                    }
                  >
                    {CS.DURATION_TYPES.map(dur => (
                      <option key={dur} value={dur}>
                        {/* i18fixme */}
                        {dur === CS.DURATION_SHORT && __('Short')}
                        {dur === CS.DURATION_LONG && __('Long')}
                        {dur === CS.DURATION_ALL && __('Any')}
                      </option>
                    ))}
                  </FormField>
                </div>
              )}
              {/* TAGS FIELD */}
              {!tags && (
                <div className={'claim-search__input-container'}>
                  <FormField
                    className={classnames('claim-search__dropdown', {
                      'claim-search__dropdown--selected':
                        ((!defaultTags || defaultTags === CS.TAGS_ALL) && tagsParam && tagsParam !== CS.TAGS_ALL) ||
                        (defaultTags === CS.TAGS_FOLLOWED && tagsParam !== CS.TAGS_FOLLOWED),
                    })}
                    label={__('Tags')}
                    type="select"
                    name="tags"
                    value={tagsParam || CS.TAGS_ALL}
                    onChange={e =>
                      handleChange({
                        key: CS.TAGS_KEY,
                        value: e.target.value,
                      })
                    }
                  >
                    {[
                      CS.TAGS_ALL,
                      CS.TAGS_FOLLOWED,
                      ...followed,
                      ...(followed.includes(tagsParam) || tagsParam === CS.TAGS_ALL || tagsParam === CS.TAGS_FOLLOWED
                        ? []
                        : [tagsParam]), // if they unfollow while filtered, add Other
                    ].map(tag => (
                      <option
                        key={tag}
                        value={tag}
                        className={classnames({
                          'claim-search__input-special': !followed.includes(tag),
                        })}
                      >
                        {followed.includes(tag) && typeof tag === 'string' && toCapitalCase(tag)}
                        {tag === CS.TAGS_ALL && __('Any')}
                        {tag === CS.TAGS_FOLLOWED && __('Following')}
                        {!followed.includes(tag) && tag !== CS.TAGS_ALL && tag !== CS.TAGS_FOLLOWED && __('Other')}
                      </option>
                    ))}
                  </FormField>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {hasMatureTags && hiddenNsfwMessage}
    </Fragment>
  );

  return (
    <React.Fragment>
      {headerLabel && <label className="claim-list__header-label">{headerLabel}</label>}
      <Card
        title={header || defaultHeader}
        titleActions={meta && <div className="card__actions--inline">{meta}</div>}
        isBodyList
        body={
          <>
            <ClaimList
              isCardBody
              id={claimSearchCacheQuery}
              loading={loading}
              uris={claimSearchResult}
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
          </>
        }
      />
    </React.Fragment>
  );
}

export default withRouter(ClaimListDiscover);
