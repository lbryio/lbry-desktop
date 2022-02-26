// @flow
import * as CS from 'constants/claim_search';
import * as ICONS from 'constants/icons';
import * as SETTINGS from 'constants/settings';
import type { Node } from 'react';
import classnames from 'classnames';
import React from 'react';
import usePersistedState from 'effects/use-persisted-state';
import { useHistory } from 'react-router';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import { toCapitalCase } from 'util/string';
import SEARCHABLE_LANGUAGES from 'constants/searchable_languages';

type Props = {
  defaultTags: string,
  freshness?: string,
  defaultFreshness?: string,
  claimType?: Array<string>,
  streamType?: string | Array<string>,
  defaultStreamType?: string | Array<string>,
  feeAmount: string,
  sortBy?: string,
  orderBy?: Array<string>,
  defaultOrderBy?: string,
  hideAdvancedFilter: boolean,
  hideLayoutButton: boolean,
  hasMatureTags: boolean,
  hiddenNsfwMessage?: Node,
  channelIds?: Array<string>,
  tileLayout: boolean,
  doSetClientSetting: (string, boolean, ?boolean) => void,
  setPage: (number) => void,
  hideFilters: boolean,
  searchInLanguage: boolean,
  languageSetting: string,
  scrollAnchor?: string,
};

function ClaimListHeader(props: Props) {
  const {
    defaultTags,
    freshness,
    defaultFreshness,
    claimType,
    streamType,
    defaultStreamType,
    feeAmount,
    sortBy,
    orderBy,
    defaultOrderBy,
    hideAdvancedFilter,
    hideLayoutButton,
    hasMatureTags,
    hiddenNsfwMessage,
    channelIds,
    tileLayout,
    doSetClientSetting,
    setPage,
    hideFilters,
    searchInLanguage,
    languageSetting,
    scrollAnchor,
  } = props;
  const { action, push, location } = useHistory();
  const { search } = location;
  const [expanded, setExpanded] = usePersistedState(`expanded-${location.pathname}`, false);
  const [orderParamEntry, setOrderParamEntry] = usePersistedState(`entry-${location.pathname}`, CS.ORDER_BY_TRENDING);
  const [orderParamUser, setOrderParamUser] = usePersistedState(`orderUser-${location.pathname}`, CS.ORDER_BY_TRENDING);
  const urlParams = new URLSearchParams(search);
  const freshnessParam = freshness || urlParams.get(CS.FRESH_KEY) || defaultFreshness;
  const contentTypeParam = urlParams.get(CS.CONTENT_KEY);
  const streamTypeParam =
    streamType || (CS.FILE_TYPES.includes(contentTypeParam) && contentTypeParam) || defaultStreamType || null;
  const durationParam = urlParams.get(CS.DURATION_KEY) || null;
  const languageParam = urlParams.get(CS.LANGUAGE_KEY) || null;
  const sortByParam = sortBy || urlParams.get(CS.SORT_BY_KEY) || null;
  const channelIdsInUrl = urlParams.get(CS.CHANNEL_IDS_KEY);
  const channelIdsParam = channelIdsInUrl ? channelIdsInUrl.split(',') : channelIds;
  const feeAmountParam = urlParams.get('fee_amount') || feeAmount || CS.FEE_AMOUNT_ANY;
  const showDuration = !(claimType && claimType === CS.CLAIM_CHANNEL && claimType === CS.CLAIM_COLLECTION);
  const isFiltered = () =>
    Boolean(
      urlParams.get(CS.FRESH_KEY) ||
        urlParams.get(CS.CONTENT_KEY) ||
        urlParams.get(CS.DURATION_KEY) ||
        urlParams.get(CS.TAGS_KEY) ||
        urlParams.get(CS.FEE_AMOUNT_KEY) ||
        urlParams.get(CS.LANGUAGE_KEY)
    );

  const languageValue = searchInLanguage
    ? languageParam === null
      ? languageSetting
      : languageParam
    : languageParam === null
    ? CS.LANGUAGES_ALL
    : languageParam;

  const shouldHighlight = searchInLanguage
    ? languageParam !== languageSetting && languageParam !== null
    : languageParam !== CS.LANGUAGES_ALL && languageParam !== null;

  React.useEffect(() => {
    if (action !== 'POP' && isFiltered()) {
      setExpanded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (hideAdvancedFilter) {
      setExpanded(false);
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
  }, [orderParam, setOrderParamUser]);

  React.useEffect(() => {
    // One-time update to stash the finalized 'orderParam' at entry.
    if (action !== 'POP') {
      setOrderParamEntry(orderParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  function buildUrl(delta) {
    const newUrlParams = new URLSearchParams(location.search);
    CS.KEYS.forEach((k) => {
      // $FlowFixMe get() can return null
      if (urlParams.get(k) !== null) newUrlParams.set(k, urlParams.get(k));
    });

    switch (delta.key) {
      case CS.ORDER_BY_KEY:
        newUrlParams.set(CS.ORDER_BY_KEY, delta.value);
        break;
      case CS.SORT_BY_KEY:
        if (delta.value === CS.SORT_BY.NEWEST.key) {
          newUrlParams.delete(CS.SORT_BY_KEY);
        } else {
          newUrlParams.set(CS.SORT_BY_KEY, delta.value);
        }
        break;
      case CS.FRESH_KEY:
        if (delta.value === defaultFreshness || delta.value === CS.FRESH_DEFAULT) {
          newUrlParams.delete(CS.FRESH_KEY);
        } else {
          newUrlParams.set(CS.FRESH_KEY, delta.value);
        }
        break;
      case CS.CONTENT_KEY:
        if (
          delta.value === CS.CLAIM_CHANNEL ||
          delta.value === CS.CLAIM_REPOST ||
          delta.value === CS.CLAIM_COLLECTION
        ) {
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
      case CS.LANGUAGE_KEY:
        newUrlParams.set(CS.LANGUAGE_KEY, delta.value);
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
    return `?${newUrlParams.toString()}` + (scrollAnchor ? '#' + scrollAnchor : '');
  }

  return (
    <>
      <div className="claim-search__wrapper">
        <div className="claim-search__top">
          {!hideFilters && (
            <div className="claim-search__menu-group">
              {CS.ORDER_BY_TYPES.map((type) => (
                <Button
                  key={type}
                  button="alt"
                  onClick={(e) =>
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
                  iconSize={toCapitalCase(type) === ICONS.NEW ? 20 : undefined}
                  label={__(toCapitalCase(type))}
                />
              ))}
            </div>
          )}
          <div className="claim-search__menu-group">
            {!hideAdvancedFilter && (
              <Button
                button="alt"
                aria-label={__('More')}
                className={classnames(`button-toggle button-toggle--top button-toggle--more`, {
                  'button-toggle--custom': isFiltered(),
                  'button-toggle--active': expanded,
                })}
                icon={ICONS.SLIDERS}
                onClick={() => setExpanded(!expanded)}
              />
            )}

            {tileLayout !== undefined && !hideLayoutButton && (
              <Button
                onClick={() => {
                  doSetClientSetting(SETTINGS.TILE_LAYOUT, !tileLayout);
                }}
                button="alt"
                className="button-toggle"
                aria-label={tileLayout ? __('Change to list layout') : __('Change to tile layout')}
                icon={ICONS.LAYOUT}
              />
            )}
          </div>
        </div>
        {expanded && (
          <>
            <div className={classnames(`card claim-search__menus`)}>
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
                    onChange={(e) =>
                      handleChange({
                        key: CS.FRESH_KEY,
                        value: e.target.value,
                      })
                    }
                  >
                    {CS.FRESH_TYPES.map((time) => (
                      <option key={time} value={time}>
                        {/* i18fixme */}
                        {time === CS.FRESH_DAY && __('Today')}
                        {
                          time !== CS.FRESH_ALL &&
                            time !== CS.FRESH_DEFAULT &&
                            time !== CS.FRESH_DAY &&
                            __('This ' + toCapitalCase(time)) /* yes, concat before i18n, since it is read from const */
                        }
                        {time === CS.FRESH_ALL && __('All time')}
                        {time === CS.FRESH_DEFAULT && __('Default')}
                      </option>
                    ))}
                  </FormField>
                </div>
              )}

              {/* CONTENT_TYPES FIELD - display using same logic as showDuration */}
              {showDuration && (
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
                    onChange={(e) =>
                      handleChange({
                        key: CS.CONTENT_KEY,
                        value: e.target.value,
                      })
                    }
                  >
                    {CS.CONTENT_TYPES.map((type) => {
                      if (type !== CS.CLAIM_CHANNEL || (type === CS.CLAIM_CHANNEL && !channelIdsParam)) {
                        return (
                          <option key={type} value={type}>
                            {/* i18fixme */}
                            {type === CS.CLAIM_COLLECTION && __('List')}
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

              {/* LANGUAGE FIELD - hidden for now */}
              {false && !claimType && (
                <div
                  className={classnames('claim-search__input-container', {
                    'claim-search__input-container--selected': shouldHighlight,
                  })}
                >
                  <FormField
                    className={classnames('claim-search__dropdown', {
                      'claim-search__dropdown--selected': shouldHighlight,
                    })}
                    type="select"
                    name="claimType"
                    label={__('Language')}
                    value={languageValue || CS.LANGUAGES_ALL}
                    onChange={(e) =>
                      handleChange({
                        key: CS.LANGUAGE_KEY,
                        value: e.target.value,
                      })
                    }
                  >
                    <option key={CS.LANGUAGES_ALL} value={CS.LANGUAGES_ALL}>
                      {__('Any')}
                      {/* i18fixme */}
                    </option>
                    {Object.entries(SEARCHABLE_LANGUAGES).map(([code, label]) => {
                      return (
                        <option key={code} value={code}>
                          {String(label)}
                        </option>
                      );
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
                    label={__('Duration --[length of audio or video]--')}
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
                    onChange={(e) =>
                      handleChange({
                        key: CS.DURATION_KEY,
                        value: e.target.value,
                      })
                    }
                  >
                    {CS.DURATION_TYPES.map((dur) => (
                      <option key={dur} value={dur}>
                        {/* i18fixme */}
                        {dur === CS.DURATION_SHORT && __('Short (< 4 minutes)')}
                        {dur === CS.DURATION_LONG && __('Long (> 20 min)')}
                        {dur === CS.DURATION_ALL && __('Any')}
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
                  onChange={(e) =>
                    handleChange({
                      key: CS.FEE_AMOUNT_KEY,
                      value: e.target.value,
                    })
                  }
                >
                  <option value={CS.FEE_AMOUNT_ANY}>{__('Any')}</option>
                  <option value={CS.FEE_AMOUNT_ONLY_FREE}>{__('Free')}</option>
                  <option value={CS.FEE_AMOUNT_ONLY_PAID}>{__('Paid')}</option>
                  ))}
                </FormField>
              </div>

              {/* SORT FIELD */}
              {orderParam === CS.ORDER_BY_NEW && (
                <div className={'claim-search__input-container'}>
                  <FormField
                    className={classnames('claim-search__dropdown', {
                      'claim-search__dropdown--selected': sortByParam,
                    })}
                    label={__('Sort By')}
                    type="select"
                    name="sort_by"
                    value={sortByParam || CS.SORT_BY.NEWEST.key}
                    onChange={(e) => handleChange({ key: CS.SORT_BY_KEY, value: e.target.value })}
                  >
                    {Object.entries(CS.SORT_BY).map(([key, value]) => {
                      return (
                        // $FlowFixMe https://github.com/facebook/flow/issues/2221
                        <option key={value.key} value={value.key}>
                          {/* $FlowFixMe */}
                          {__(value.str)}
                        </option>
                      );
                    })}
                  </FormField>
                </div>
              )}

              {channelIdsInUrl && (
                <div className={'claim-search__input-container'}>
                  <label>{__('Advanced Filters from URL')}</label>
                  <Button
                    button="alt"
                    className="claim-search__filter-button"
                    label={__('Clear')}
                    onClick={handleAdvancedReset}
                  />
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
