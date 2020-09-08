// @flow
import { SIMPLE_SITE } from 'config';
import * as CS from 'constants/claim_search';
import * as ICONS from 'constants/icons';
import type { Node } from 'react';
import classnames from 'classnames';
import React from 'react';
import usePersistedState from 'effects/use-persisted-state';
import { useHistory } from 'react-router';
import { SETTINGS } from 'lbry-redux';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import { toCapitalCase } from 'util/string';

type Props = {
  defaultTags: string,
  followedTags?: Array<Tag>,
  tags: string,
  freshness?: string,
  defaultFreshness?: string,
  claimType?: Array<string>,
  streamType?: string | Array<string>,
  defaultStreamType?: string | Array<string>,
  feeAmount: string,
  orderBy?: Array<string>,
  defaultOrderBy?: string,
  hideFilter: boolean,
  hasMatureTags: boolean,
  hiddenNsfwMessage?: Node,
  channelIds?: Array<string>,
  tileLayout: boolean,
  doSetClientSetting: (string, boolean) => void,
  setPage: number => void,
  doSyncClientSettings: () => void,
};

function ClaimListHeader(props: Props) {
  const {
    defaultTags,
    followedTags,
    tags,
    freshness,
    defaultFreshness,
    claimType,
    streamType,
    defaultStreamType,
    feeAmount,
    orderBy,
    defaultOrderBy,
    hideFilter,
    hasMatureTags,
    hiddenNsfwMessage,
    channelIds,
    tileLayout,
    doSetClientSetting,
    doSyncClientSettings,
    setPage,
  } = props;
  const { action, push, location } = useHistory();
  const { search } = location;
  const [expanded, setExpanded] = usePersistedState(`expanded-${location.pathname}`, false);
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
  const streamTypeParam =
    streamType || (CS.FILE_TYPES.includes(contentTypeParam) && contentTypeParam) || defaultStreamType || null;
  const durationParam = urlParams.get(CS.DURATION_KEY) || null;
  const channelIdsInUrl = urlParams.get(CS.CHANNEL_IDS_KEY);
  const channelIdsParam = channelIdsInUrl ? channelIdsInUrl.split(',') : channelIds;
  const feeAmountParam = urlParams.get('fee_amount') || feeAmount || CS.FEE_AMOUNT_ANY;
  const showDuration = !(claimType && claimType === CS.CLAIM_CHANNEL);
  const isFiltered = () =>
    Boolean(
      urlParams.get(CS.FRESH_KEY) ||
        urlParams.get(CS.CONTENT_KEY) ||
        urlParams.get(CS.DURATION_KEY) ||
        urlParams.get(CS.TAGS_KEY) ||
        urlParams.get(CS.FEE_AMOUNT_KEY)
    );

  React.useEffect(() => {
    if (action !== 'POP' && isFiltered()) {
      setExpanded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let orderParam = orderBy || urlParams.get(CS.ORDER_BY_KEY) || defaultOrderBy;
  if (!orderParam) {
    if (action === 'POP') {
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
    if (action !== 'POP') {
      setOrderParamEntry(orderParam);
    }
  }, []);

  function handleChange(change) {
    const url = buildUrl(change);
    setPage(1);
    push(url);
  }

  function handleAdvancedReset() {
    const newUrlParams = new URLSearchParams(search);
    newUrlParams.delete('claim_type');
    newUrlParams.delete('channel_ids');
    const newSearch = `?${newUrlParams.toString()}`;

    push(newSearch);
  }

  function getParamFromTags(t) {
    if (t === CS.TAGS_ALL || t === CS.TAGS_FOLLOWED) {
      return t;
    } else if (Array.isArray(t)) {
      return t.join(',');
    }
  }

  function buildUrl(delta) {
    const newUrlParams = new URLSearchParams(location.search);
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
      case CS.FEE_AMOUNT_KEY:
        if (delta.value === CS.FEE_AMOUNT_ANY) {
          newUrlParams.delete(CS.FEE_AMOUNT_KEY);
        } else {
          newUrlParams.set(CS.FEE_AMOUNT_KEY, delta.value);
        }
        break;
    }
    return `?${newUrlParams.toString()}`;
  }

  return (
    <>
      <div className="claim-search__wrapper">
        <div className="claim-search__top">
          <div className="claim-search__top-row">
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
            {!hideFilter && !SIMPLE_SITE && (
              <Button
                button="alt"
                aria-label={__('More')}
                className={classnames(`button-toggle button-toggle--top button-toggle--more`, {
                  'button-toggle--custom': isFiltered(),
                })}
                icon={ICONS.SLIDERS}
                onClick={() => setExpanded(!expanded)}
              />
            )}

            {tileLayout !== undefined && (
              <Button
                onClick={() => {
                  doSetClientSetting(SETTINGS.TILE_LAYOUT, !tileLayout);
                  doSyncClientSettings();
                }}
                button="alt"
                className="button-toggle"
                aria-label={tileLayout ? __('Change to list layout') : __('Change to tile layout')}
                icon={ICONS.LAYOUT}
              />
            )}
          </div>
        </div>
        {expanded && !SIMPLE_SITE && (
          <>
            <div className={classnames('card--inline', `claim-search__menus`)}>
              {/* FRESHNESS FIELD */}
              {orderParam === CS.ORDER_BY_TOP && (
                <div className="claim-search__input-container">
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

              {/* PAID FIELD */}
              <div className={'claim-search__input-container'}>
                <FormField
                  className={classnames('claim-search__dropdown', {
                    'claim-search__dropdown--selected':
                      feeAmountParam === CS.FEE_AMOUNT_ONLY_FREE || feeAmountParam === CS.FEE_AMOUNT_ONLY_PAID,
                  })}
                  label={__('Price')}
                  type="select"
                  name="paidcontent"
                  value={feeAmountParam}
                  onChange={e =>
                    handleChange({
                      key: CS.FEE_AMOUNT_KEY,
                      value: e.target.value,
                    })
                  }
                >
                  <option value={CS.FEE_AMOUNT_ANY}>{__('Anything')}</option>
                  <option value={CS.FEE_AMOUNT_ONLY_FREE}>{__('Free')}</option>
                  <option value={CS.FEE_AMOUNT_ONLY_PAID}>{__('Paid')}</option>
                  ))}
                </FormField>
              </div>

              {channelIdsInUrl && (
                <div className={'claim-search__input-container'}>
                  <label>{__('Advanced Filters from URL')}</label>
                  <Button button="alt" label={__('Clear')} onClick={handleAdvancedReset} />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {hasMatureTags && hiddenNsfwMessage}
    </>
  );
}

export default ClaimListHeader;
