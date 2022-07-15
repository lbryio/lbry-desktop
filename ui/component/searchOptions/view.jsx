// @flow
import { SEARCH_OPTIONS, SEARCH_PAGE_SIZE } from 'constants/search';
import * as ICONS from 'constants/icons';
import React, { useMemo } from 'react';
import { Form, FormField } from 'component/common/form';
import Button from 'component/button';
import Icon from 'component/common/icon';
import classnames from 'classnames';

const CLAIM_TYPES = {
  [SEARCH_OPTIONS.INCLUDE_FILES]: 'Files',
  [SEARCH_OPTIONS.INCLUDE_CHANNELS]: 'Channels',
  [SEARCH_OPTIONS.INCLUDE_FILES_AND_CHANNELS]: 'Everything',
};

const TYPES_ADVANCED = {
  [SEARCH_OPTIONS.MEDIA_VIDEO]: 'Video',
  [SEARCH_OPTIONS.MEDIA_AUDIO]: 'Audio',
  [SEARCH_OPTIONS.MEDIA_IMAGE]: 'Image',
  [SEARCH_OPTIONS.MEDIA_TEXT]: 'Text',
  [SEARCH_OPTIONS.MEDIA_APPLICATION]: 'Other',
};

const TIME_FILTER = {
  '': 'All',
  // [SEARCH_OPTIONS.TIME_FILTER_LAST_HOUR]: 'Last Hour', -- disable (doesn't work)
  [SEARCH_OPTIONS.TIME_FILTER_TODAY]: 'Last 24 Hours',
  [SEARCH_OPTIONS.TIME_FILTER_THIS_WEEK]: 'This Week',
  [SEARCH_OPTIONS.TIME_FILTER_THIS_MONTH]: 'This Month',
  [SEARCH_OPTIONS.TIME_FILTER_THIS_YEAR]: 'This Year',
};

const SORT_BY = {
  '': 'Relevance',
  [SEARCH_OPTIONS.SORT_DESCENDING]: 'Newest first',
  [SEARCH_OPTIONS.SORT_ASCENDING]: 'Oldest first',
};

type Props = {
  setSearchOption: (string, boolean | string | number) => void,
  options: {},
  simple: boolean,
  expanded: boolean,
  toggleSearchExpanded: () => void,
  onSearchOptionsChanged: (string) => void,
};

const SearchOptions = (props: Props) => {
  const { options, simple, setSearchOption, expanded, toggleSearchExpanded, onSearchOptionsChanged } = props;

  const stringifiedOptions = JSON.stringify(options);

  const isFilteringByChannel = useMemo(() => {
    const jsonOptions = JSON.parse(stringifiedOptions);
    const claimType = String(jsonOptions[SEARCH_OPTIONS.CLAIM_TYPE] || '');
    return claimType.includes(SEARCH_OPTIONS.INCLUDE_CHANNELS);
  }, [stringifiedOptions]);

  if (simple) {
    delete TYPES_ADVANCED[SEARCH_OPTIONS.MEDIA_APPLICATION];
    delete TYPES_ADVANCED[SEARCH_OPTIONS.MEDIA_IMAGE];
  }

  React.useEffect(() => {
    // We no longer let the user set the search results count, but the value
    // will be in local storage for existing users. Override that.
    if (options[SEARCH_OPTIONS.RESULT_COUNT] !== SEARCH_PAGE_SIZE) {
      setSearchOption(SEARCH_OPTIONS.RESULT_COUNT, SEARCH_PAGE_SIZE);
    }
  }, []);

  function updateSearchOptions(option, value) {
    setSearchOption(option, value);
    if (onSearchOptionsChanged) {
      onSearchOptionsChanged(option);
    }
  }

  function addRow(label: string, value: any) {
    return (
      <tr>
        <td>
          <legend className="search__legend">{label}</legend>
        </td>
        <td>{value}</td>
      </tr>
    );
  }

  const OBJ_TO_OPTION_ELEM = (obj) => {
    return Object.entries(obj).map((x) => {
      return (
        <option key={x[0]} value={x[0]}>
          {__(String(x[1]))}
        </option>
      );
    });
  };

  const typeElem = (
    <>
      <div className="filter-values">
        <div>
          {Object.entries(CLAIM_TYPES).map((t) => {
            const option = t[0];
            if (option === SEARCH_OPTIONS.INCLUDE_FILES_AND_CHANNELS) {
              return null;
            }
            return (
              <Button
                key={option}
                button="alt"
                // $FlowFixMe https://github.com/facebook/flow/issues/2221
                label={__(t[1])}
                className={classnames(`button-toggle`, {
                  'button-toggle--active': options[SEARCH_OPTIONS.CLAIM_TYPE] === option,
                })}
                onClick={() => setSearchOption(SEARCH_OPTIONS.CLAIM_TYPE, option)}
              />
            );
          })}
        </div>
        <Button
          button="close"
          className={classnames('close-button', {
            'close-button--visible': options[SEARCH_OPTIONS.CLAIM_TYPE] !== SEARCH_OPTIONS.INCLUDE_FILES_AND_CHANNELS,
          })}
          icon={ICONS.REMOVE}
          onClick={() => updateSearchOptions(SEARCH_OPTIONS.CLAIM_TYPE, SEARCH_OPTIONS.INCLUDE_FILES_AND_CHANNELS)}
        />
      </div>
      {options[SEARCH_OPTIONS.CLAIM_TYPE] === SEARCH_OPTIONS.INCLUDE_FILES && (
        <div className="media-types">
          {Object.entries(TYPES_ADVANCED).map((t) => {
            const option = t[0];
            return (
              <FormField
                key={option}
                name={option}
                type="checkbox"
                blockWrap={false}
                disabled={options[SEARCH_OPTIONS.CLAIM_TYPE] !== SEARCH_OPTIONS.INCLUDE_FILES}
                // $FlowFixMe https://github.com/facebook/flow/issues/2221
                label={__(t[1])}
                checked={!isFilteringByChannel && options[option]}
                onChange={() => updateSearchOptions(option, !options[option])}
              />
            );
          })}
        </div>
      )}
    </>
  );

  const otherOptionsElem = (
    <>
      <div className="filter-values">
        <FormField
          type="checkbox"
          name="exact-match"
          checked={options[SEARCH_OPTIONS.EXACT]}
          onChange={() => updateSearchOptions(SEARCH_OPTIONS.EXACT, !options[SEARCH_OPTIONS.EXACT])}
          label={__('Exact match')}
        />
        <Icon
          className="icon--help"
          icon={ICONS.HELP}
          tooltip
          size={16}
          customTooltipText={__(
            'Find results that include all the given words in the exact order.\nThis can also be done by surrounding the search query with quotation marks (e.g. "hello world").'
          )}
        />
      </div>
    </>
  );

  const uploadDateElem = (
    <div className="filter-values">
      <FormField
        type="select"
        name="upload-date"
        value={options[SEARCH_OPTIONS.TIME_FILTER]}
        onChange={(e) => updateSearchOptions(SEARCH_OPTIONS.TIME_FILTER, e.target.value)}
        blockWrap={false}
      >
        {OBJ_TO_OPTION_ELEM(TIME_FILTER)}
      </FormField>
      <Button
        button="close"
        className={classnames('close-button', {
          'close-button--visible': options[SEARCH_OPTIONS.TIME_FILTER],
        })}
        icon={ICONS.REMOVE}
        onClick={() => updateSearchOptions(SEARCH_OPTIONS.TIME_FILTER, '')}
      />
    </div>
  );

  const sortByElem = (
    <div className="filter-values">
      <FormField
        type="select"
        name="sort-by"
        blockWrap={false}
        value={options[SEARCH_OPTIONS.SORT]}
        onChange={(e) => updateSearchOptions(SEARCH_OPTIONS.SORT, e.target.value)}
      >
        {OBJ_TO_OPTION_ELEM(SORT_BY)}
      </FormField>
    </div>
  );

  const uploadDateLabel =
    options[SEARCH_OPTIONS.CLAIM_TYPE] === SEARCH_OPTIONS.INCLUDE_CHANNELS ? __('Creation Date') : __('Upload Date');

  return (
    <div>
      <Button
        button="alt"
        label={__('Filter')}
        icon={ICONS.FILTER}
        iconRight={expanded ? ICONS.UP : ICONS.DOWN}
        onClick={toggleSearchExpanded}
      />
      <Form
        className={classnames('search__options', {
          'search__options--expanded': expanded,
        })}
      >
        <table className="table table--condensed">
          <tbody>
            {addRow(__('Type'), typeElem)}
            {addRow(uploadDateLabel, uploadDateElem)}
            {addRow(__('Sort By'), sortByElem)}
            {addRow(__('Other Options'), otherOptionsElem)}
          </tbody>
        </table>
      </Form>
    </div>
  );
};

export default SearchOptions;
