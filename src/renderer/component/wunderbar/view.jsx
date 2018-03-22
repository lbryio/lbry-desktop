// @flow
import React from 'react';
import { normalizeURI } from 'lbryURI';
import classnames from 'classnames';
import throttle from 'util/throttle';
import Icon from 'component/common/icon';
import Autocomplete from './internal/autocomplete';
import { parseQueryParams } from 'util/query_params';
import * as icons from 'constants/icons';

type Props = {
  updateSearchQuery: string => void,
  onSearch: string => void,
  onSubmit: (string, {}) => void,
  wunderbarValue: ?string,
  suggestions: Array<string>,
};

class WunderBar extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    (this: any).handleSubmit = this.handleSubmit.bind(this);
    (this: any).handleChange = this.handleChange.bind(this);
    this.input = undefined;
  }

  handleChange(e: SyntheticInputEvent<*>) {
    const { updateSearchQuery } = this.props;
    const { value } = e.target;

    updateSearchQuery(value);
  }

  handleSubmit(value: string, suggestion?: { value: string, type: string }) {
    const { onSubmit, onSearch } = this.props;
    const query = value.trim();
    const getParams = () => {
      const parts = query.split('?');
      const value = parts.shift();

      let extraParams = {};
      if (parts.length > 0) {
        extraParams = parseQueryParams(parts.join(''));
      }

      return extraParams;
    };

    // User selected a suggestion
    if (suggestion) {
      if (suggestion.type === 'search') {
        onSearch(query);
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
      onSearch(query);
    }

    return;
  }

  getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'file':
        return icons.COMPASS;
      case 'channel':
        return icons.AT_SIGN;
      default:
        return icons.SEARCH;
    }
  };

  input: ?HTMLInputElement;

  render() {
    const { wunderbarValue, suggestions } = this.props;

    return (
      <div className="wunderbar">
        <Icon icon={icons.SEARCH} />
        <Autocomplete
          autoHighlight
          wrapperStyle={{ flex: 1 }}
          value={wunderbarValue || ''}
          items={suggestions}
          getItemValue={item => item.value}
          onChange={this.handleChange}
          onSelect={this.handleSubmit}
          renderInput={props => (
            <input
              {...props}
              className="wunderbar__input"
              placeholder="Search for videos, music, games and more"
            />
          )}
          renderItem={({ value, type, shorthand }, isHighlighted) => (
            <div
              key={value}
              className={classnames('wunderbar__suggestion', {
                'wunderbar__active-suggestion': isHighlighted,
              })}
            >
              <Icon icon={this.getSuggestionIcon(type)} />
              <span className="wunderbar__suggestion-label">{shorthand || value}</span>
              {(true || isHighlighted) && (
                <span className="wunderbar__suggestion-label--action">
                  {'-  '}
                  {type === 'search' ? 'Search' : value}
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
