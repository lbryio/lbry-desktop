// @flow
import React from 'react';
import classnames from 'classnames';
import { normalizeURI, SEARCH_TYPES } from 'lbry-redux';
import Icon from 'component/common/icon';
import { parseQueryParams } from 'util/query_params';
import * as icons from 'constants/icons';
import Autocomplete from './internal/autocomplete';

type Props = {
  updateSearchQuery: string => void,
  onSearch: string => void,
  onSubmit: (string, {}) => void,
  wunderbarValue: ?string,
  suggestions: Array<string>,
  doFocus: () => void,
  doBlur: () => void,
  resultCount: number,
};

class WunderBar extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    (this: any).handleSubmit = this.handleSubmit.bind(this);
    (this: any).handleChange = this.handleChange.bind(this);
    this.input = undefined;
  }

  getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'file':
        return icons.LOCAL;
      case 'channel':
        return icons.AT_SIGN;
      default:
        return icons.SEARCH;
    }
  };

  handleChange(e: SyntheticInputEvent<*>) {
    const { updateSearchQuery } = this.props;
    const { value } = e.target;

    updateSearchQuery(value);
  }

  handleSubmit(value: string, suggestion?: { value: string, type: string }) {
    const { onSubmit, onSearch, resultCount } = this.props;
    const query = value.trim();
    const getParams = () => {
      const parts = query.split('?');

      let extraParams = {};
      if (parts.length > 0) {
        extraParams = parseQueryParams(parts.join(''));
      }

      return extraParams;
    };

    // User selected a suggestion
    if (suggestion) {
      if (suggestion.type === 'search') {
        onSearch(query, resultCount);
      } else {
        const params = getParams();
        const uri = normalizeURI(query);
        onSubmit(uri, params);
      }

      return;
    }

    // Currently no suggestion is highlighted. The user may have started
    // typing, then lost focus and came back later on the same page
    try {
      const uri = normalizeURI(query);
      const params = getParams();
      onSubmit(uri, params);
    } catch (e) {
      onSearch(query, resultCount);
    }
  }

  input: ?HTMLInputElement;

  render() {
    const { wunderbarValue, suggestions, doFocus, doBlur } = this.props;

    return (
      <div className="wunderbar">
        <Icon icon={icons.SEARCH} />
        <Autocomplete
          autoHighlight
          wrapperStyle={{ flex: 1, position: 'relative' }}
          value={wunderbarValue || ''}
          items={suggestions}
          getItemValue={item => item.value}
          onChange={this.handleChange}
          onSelect={this.handleSubmit}
          inputProps={{
            onFocus: doFocus,
            onBlur: doBlur,
          }}
          renderInput={props => (
            <input
              {...props}
              className="wunderbar__input"
              placeholder="Enter LBRY URL here or search for videos, music, games and more"
            />
          )}
          renderItem={({ value, type }, isHighlighted) => (
            <div
              key={value}
              className={classnames('wunderbar__suggestion', {
                'wunderbar__active-suggestion': isHighlighted,
              })}
            >
              <Icon icon={this.getSuggestionIcon(type)} />
              <span className="wunderbar__suggestion-label">{value}</span>
              {isHighlighted && (
                <span className="wunderbar__suggestion-label--action">
                  {'-  '}
                  {type === SEARCH_TYPES.SEARCH && __('Search')}
                  {type === SEARCH_TYPES.CHANNEL && __('View channel')}
                  {type === SEARCH_TYPES.FILE && __('View file')}
                </span>
              )}
            </div>
          )}
        />
      </div>
    );
  }
}

export default WunderBar;
