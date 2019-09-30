// @flow
import { DOMAIN, DOMAIN_LOCAL, DOMAIN_DEV } from 'config';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import { normalizeURI, SEARCH_TYPES, isURIValid } from 'lbry-redux';
import { withRouter } from 'react-router';
import Icon from 'component/common/icon';
import Autocomplete from './internal/autocomplete';
import Tag from 'component/tag';

const L_KEY_CODE = 76;
const ESC_KEY_CODE = 27;
const WEB_DEV_PREFIX = `${DOMAIN_DEV}/`;
const WEB_LOCAL_PREFIX = `${DOMAIN_LOCAL}/`;
const WEB_PROD_PREFIX = `${DOMAIN}/`;
const SEARCH_PREFIX = `$/${PAGES.SEARCH}q=`;

type Props = {
  searchQuery: ?string,
  updateSearchQuery: string => void,
  onSearch: string => void,
  onSubmit: string => void,
  wunderbarValue: ?string,
  suggestions: Array<string>,
  doFocus: () => void,
  doBlur: () => void,
  focused: boolean,
  doShowSnackBar: string => void,
  history: { push: string => void },
};

type State = {
  query: ?string,
};

class WunderBar extends React.PureComponent<Props, State> {
  constructor() {
    super();

    this.state = {
      query: null,
    };

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
      case SEARCH_TYPES.FILE:
        return ICONS.FILE;
      case SEARCH_TYPES.CHANNEL:
        return ICONS.CHANNEL;
      case SEARCH_TYPES.TAG:
        return ICONS.TAG;
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

      // @if TARGET='app'
      const shouldFocus =
        process.platform === 'darwin' ? keyCode === L_KEY_CODE && metaKey : keyCode === L_KEY_CODE && ctrlKey;

      if (shouldFocus) {
        this.input.focus();
        doFocus();
      }
      // @endif
    }
  }

  handleChange(e: SyntheticInputEvent<*>) {
    const { value } = e.target;
    const { updateSearchQuery } = this.props;
    updateSearchQuery(value);
  }

  handleSubmit(value: string, suggestion?: { value: string, type: string }) {
    const { onSubmit, onSearch, doShowSnackBar, history } = this.props;
    let query = value.trim();
    this.input && this.input.blur();
    const showSnackError = () => {
      doShowSnackBar('Invalid LBRY URL entered. Only A-Z, a-z, 0-9, and "-" allowed.');
    };

    // Allow copying a lbry.tv url and pasting it into the search bar
    const includesLbryTvProd = query.includes(WEB_PROD_PREFIX);
    const includesLbryTvLocal = query.includes(WEB_LOCAL_PREFIX);
    const includesLbryTvDev = query.includes(WEB_DEV_PREFIX);
    const wasCopiedFromWeb = includesLbryTvDev || includesLbryTvLocal || includesLbryTvProd;

    if (wasCopiedFromWeb) {
      if (includesLbryTvDev) {
        query = query.slice(WEB_DEV_PREFIX.length);
      } else if (includesLbryTvLocal) {
        query = query.slice(WEB_LOCAL_PREFIX.length);
      } else {
        query = query.slice(WEB_PROD_PREFIX.length);
      }

      query = query.replace(/:/g, '#');

      if (query.includes(SEARCH_PREFIX)) {
        query = query.slice(SEARCH_PREFIX.length);
        onSearch(query);
        return;
      } else {
        query = `lbry://${query}`;
        onSubmit(query);
        return;
      }
    }

    // User selected a suggestion
    if (suggestion) {
      if (suggestion.type === SEARCH_TYPES.SEARCH) {
        onSearch(query);
      } else if (suggestion.type === SEARCH_TYPES.TAG) {
        history.push(`/$/${PAGES.TAGS}?t=${suggestion.value}`);
      } else if (isURIValid(query)) {
        const uri = normalizeURI(query);
        onSubmit(uri);
      } else {
        showSnackError();
      }

      return;
    }
    // Currently no suggestion is highlighted. The user may have started
    // typing, then lost focus and came back later on the same page
    try {
      if (isURIValid(query)) {
        const uri = normalizeURI(query);
        onSubmit(uri);
      } else {
        showSnackError();
      }
    } catch (e) {
      onSearch(query);
    }
  }

  input: ?HTMLInputElement;

  render() {
    const { suggestions, doFocus, doBlur, searchQuery } = this.props;

    return (
      <div className="wunderbar">
        <Icon icon={ICONS.SEARCH} />
        <Autocomplete
          autoHighlight
          wrapperStyle={{ flex: 1, position: 'relative' }}
          value={searchQuery}
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
              placeholder={__('Enter a LBRY URL here or search for videos, music, games and more')}
            />
          )}
          renderItem={({ value, type }, isHighlighted) => (
            <div
              // Use value + type for key because there might be suggestions with same value but different type
              key={`${value}-${type}`}
              className={classnames('wunderbar__suggestion', {
                'wunderbar__active-suggestion': isHighlighted,
              })}
            >
              <Icon icon={this.getSuggestionIcon(type)} />
              <span className="wunderbar__suggestion-label">
                {type === SEARCH_TYPES.TAG ? <Tag name={value} /> : value}
              </span>
              {isHighlighted && (
                <span className="wunderbar__suggestion-label--action">
                  {type === SEARCH_TYPES.SEARCH && __('Search')}
                  {type === SEARCH_TYPES.CHANNEL && __('View channel')}
                  {type === SEARCH_TYPES.FILE && __('View file')}
                  {type === SEARCH_TYPES.TAG && __('View Tag')}
                </span>
              )}
            </div>
          )}
        />
      </div>
    );
  }
}

export default withRouter(WunderBar);
