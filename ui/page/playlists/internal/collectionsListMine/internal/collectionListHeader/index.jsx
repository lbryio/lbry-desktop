// @flow
import React from 'react';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import * as COLS from 'constants/collections';
import classnames from 'classnames';
import { FormField } from 'component/common/form';
import { useHistory } from 'react-router';
import RightSideActions from './internal/rightSideActions';
import FilteredTextLabel from './internal/filtered-text-label';

type Props = {
  filterType: string,
  isTruncated: boolean,
  sortOption: { key: string, value: string },
  persistedOption: { key: string, value: string },
  setFilterType: (type: string) => void,
  setSortOption: (params: { key: string, value: string }) => void,
  setPersistedOption: (params: { key: string, value: string }) => void,
};

export default function CollectionsListMine(props: Props) {
  const {
    filterType,
    isTruncated,
    sortOption,
    persistedOption,
    setFilterType,
    setSortOption,
    setPersistedOption,
  } = props;

  const {
    location: { search, pathname },
  } = useHistory();

  const [expanded, setExpanded] = React.useState(false);

  const urlParams = new URLSearchParams(search);
  const hasDefaultSort = sortOption.key === persistedOption.key && sortOption.value === persistedOption.value;

  function handleChange(sortObj) {
    // can only have one sorting option at a time
    Object.keys(COLS.SORT_VALUES).forEach((k) => urlParams.get(k) && urlParams.delete(k));

    urlParams.set(sortObj.key, sortObj.value);
    setSortOption(sortObj);

    const url = `?${urlParams.toString()}`;
    history.replaceState(history.state, '', url);
  }

  function handleClear() {
    Object.keys(COLS.SORT_VALUES).forEach((k) => urlParams.get(k) && urlParams.delete(k));

    setSortOption(persistedOption);
    const url = urlParams.toString() ? `?${urlParams.toString()}` : pathname;
    history.replaceState(history.state, '', url);
  }

  return (
    <div className="section__header-action-stack">
      <div className="section__header--actions">
        <div className="claim-search__wrapper--wrap claim-search__wrapper--grid">
          {/* Filter Options */}
          <div className="claim-search__menu-group">
            {/* $FlowFixMe */}
            {Object.values(COLS.LIST_TYPE).map((value) => (
              <Button
                label={__(String(value))}
                key={String(value)}
                button="alt"
                // $FlowFixMe
                onClick={() => setFilterType(value)}
                className={classnames('button-toggle', { 'button-toggle--active': filterType === value })}
              />
            ))}
          </div>

          {/* More Sort Button */}
          <div className="claim-search__menu-group">
            <Button
              button="alt"
              aria-label={__('More')}
              className={classnames(`button-toggle button-toggle--top button-toggle--more`, {
                'button-toggle--custom': !hasDefaultSort,
                'button-toggle--active': expanded,
              })}
              icon={ICONS.SLIDERS}
              onClick={() => setExpanded(!expanded)}
            />
          </div>

          {/* Sort Options */}
          {expanded && (
            <div className="claim-search__menu-group claim-search__menu-group--inputs">
              {/* Options Field */}
              <div className="claim-search__input-container">
                <FormField
                  className="claim-search__dropdown"
                  label={__('Sort By')}
                  type="select"
                  name="sort_by"
                  value={sortOption.key}
                  onChange={(e) => handleChange({ key: e.target.value, value: COLS.SORT_ORDER.ASC })}
                >
                  {Object.entries(COLS.SORT_VALUES).map(([key, value]) => (
                    <option key={key} value={key}>
                      {/* $FlowFixMe */}
                      {__(value.str)}
                    </option>
                  ))}
                </FormField>
              </div>

              {/* Sort By */}
              <div className="claim-search__input-container">
                <FormField
                  className="claim-search__dropdown"
                  label={__('Order By')}
                  type="select"
                  name="order_by"
                  value={sortOption.value}
                  onChange={(e) => handleChange({ key: sortOption.key, value: e.target.value })}
                >
                  {Object.entries(COLS.SORT_ORDER).map(([key, value]) => (
                    // $FlowFixMe
                    <option key={value} value={value}>
                      {__(COLS.SORT_VALUES[sortOption.key].orders[value])}
                    </option>
                  ))}
                </FormField>
              </div>

              {/* Save Sort */}
              {!hasDefaultSort && (
                <div className="claim-search__input-container action-button">
                  <Button
                    button="alt"
                    aria-label={__('Save')}
                    icon={ICONS.COMPLETE}
                    onClick={() => setPersistedOption(sortOption)}
                  />
                </div>
              )}

              {/* Clear Sort */}
              {!hasDefaultSort && (
                <div className="claim-search__input-container action-button">
                  <Button button="alt" aria-label={__('Clear')} icon={ICONS.REMOVE} onClick={handleClear} />
                </div>
              )}
            </div>
          )}
        </div>

        <RightSideActions />
      </div>

      {isTruncated && <FilteredTextLabel />}
    </div>
  );
}
