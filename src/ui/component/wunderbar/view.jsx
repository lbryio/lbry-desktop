// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import { normalizeURI, SEARCH_TYPES, isURIValid } from 'lbry-redux';
import Icon from 'component/common/icon';
import { parseQueryParams } from 'util/query-params';
import Autocomplete from './internal/autocomplete';

const L_KEY_CODE = 76;
const ESC_KEY_CODE = 27;

type Props = {
  updateSearchQuery: string => void,
  onSearch: string => void,
  onSubmit: (string, {}) => void,
  wunderbarValue: ?string,
  suggestions: Array<string>,
  doFocus: () => void,
  doBlur: () => void,
  focused: boolean,
  doShowSnackBar: ({}) => void,
};

class WunderBar extends React.PureComponent<Props> {
  constructor() {
    super();

    (this: any).handleSubmit = this.handleSubmit.bind(this);
    (this: any).handleChange = this.handleChange.bind(this);
    (this: any).handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'file':
        return ICONS.FILE;
      case 'channel':
        return ICONS.CHANNEL;
      default:
        return ICONS.SEARCH;
    }
  };

  handleKeyDown(event: SyntheticKeyboardEvent<*>) {
    const { ctrlKey, metaKey, keyCode } = event;
    const { doFocus, doBlur, focused } = this.props;

    if (this.input) {
      if (focused && keyCode === ESC_KEY_CODE) {
        this.input.blur();
        doBlur();
        return;
      }

      const shouldFocus =
        process.platform === 'darwin'
          ? keyCode === L_KEY_CODE && metaKey
          : keyCode === L_KEY_CODE && ctrlKey;

      if (shouldFocus) {
        this.input.focus();
        doFocus();
      }
    }
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
      } else if (isURIValid(query)) {
        const params = getParams();
        const uri = normalizeURI(query);
        onSubmit(uri, params);
      } else {
        this.props.doShowSnackBar({
          message: __('Invalid LBRY URL entered. Only A-Z, a-z, 0-9, and - allowed.'),
        });
      }

      return;
    }

    // Currently no suggestion is highlighted. The user may have started
    // typing, then lost focus and came back later on the same page
    try {
      if (isURIValid(query)) {
        const uri = normalizeURI(query);
        const params = getParams();
        onSubmit(uri, params);
      } else {
        this.props.doShowSnackBar({
          message: __('Invalid LBRY URL entered. Only A-Z, a-z, 0-9, and - allowed.'),
        });
      }
    } catch (e) {
      onSearch(query);
    }
  }

  input: ?HTMLInputElement;

  render() {
    const { wunderbarValue, suggestions, doFocus, doBlur } = this.props;

    return (
      <div className="wunderbar">
        <Icon icon={ICONS.SEARCH} />
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
              ref={el => {
                props.ref(el);
                this.input = el;
              }}
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
