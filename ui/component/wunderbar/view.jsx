// @flow
import { URL, URL_LOCAL, URL_DEV } from 'config';
import { SEARCH_TYPES } from 'constants/search';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import { withRouter } from 'react-router';
import Icon from 'component/common/icon';
import Autocomplete from './internal/autocomplete';
import Tag from 'component/tag';
import { isURIValid, normalizeURI } from 'lbry-redux';
import { formatLbryUrlForWeb } from '../../util/url';
const WEB_DEV_PREFIX = `${URL_DEV}/`;
const WEB_LOCAL_PREFIX = `${URL_LOCAL}/`;
const WEB_PROD_PREFIX = `${URL}/`;
const SEARCH_PREFIX = `$/${PAGES.SEARCH}q=`;
const INVALID_URL_ERROR = "Invalid LBRY URL entered. Only A-Z, a-z, 0-9, and '-' allowed.";

const L_KEY_CODE = 76;
const ESC_KEY_CODE = 27;

type Props = {
  searchQuery: ?string,
  updateSearchQuery: string => void,
  onSearch: string => void,
  onSubmit: string => void,

  navigateToUri: string => void,
  doSearch: string => void,

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

  onSubmitWebUri(uri: string, prefix: string) {
    // Allow copying a lbry.tv url and pasting it into the search bar
    const { doSearch, navigateToUri, updateSearchQuery } = this.props;

    let query = uri.slice(prefix.length);
    query = query.replace(/:/g, '#');
    if (query.includes(SEARCH_PREFIX)) {
      query = query.slice(SEARCH_PREFIX.length);
      doSearch(query);
    } else {
      // TODO - double check this code path
      let path = `lbry://${query}`;
      const uri = formatLbryUrlForWeb(path);
      navigateToUri(uri);
      updateSearchQuery('');
    }
  }

  onClickSuggestion(query: string, suggestion: { value: string, type: string }): void {
    const { navigateToUri, doSearch, doShowSnackBar } = this.props;

    if (suggestion.type === SEARCH_TYPES.SEARCH) {
      doSearch(query);
    } else if (suggestion.type === SEARCH_TYPES.TAG) {
      const encodedSuggestion = encodeURIComponent(suggestion.value);
      const uri = `/$/${PAGES.DISCOVER}?t=${encodedSuggestion}`;
      navigateToUri(uri);
    } else if (isURIValid(query)) {
      let uri = normalizeURI(query);
      uri = formatLbryUrlForWeb(uri);
      navigateToUri(uri);
    } else {
      doShowSnackBar(INVALID_URL_ERROR);
    }
  }

  onSubmitRawString(st: string): void {
    const { navigateToUri, doSearch, doShowSnackBar } = this.props;
    // Currently no suggestion is highlighted. The user may have started
    // typing, then lost focus and came back later on the same page
    try {
      if (isURIValid(st)) {
        const uri = normalizeURI(st);
        navigateToUri(uri);
      } else {
        doShowSnackBar(INVALID_URL_ERROR);
      }
    } catch (e) {
      doSearch(st);
    }
  }

  handleSubmit(value: string, suggestion?: { value: string, type: string }) {
    let query = value.trim();
    this.input && this.input.blur();

    const includesLbryTvProd = query.includes(WEB_PROD_PREFIX);
    const includesLbryTvLocal = query.includes(WEB_LOCAL_PREFIX);
    const includesLbryTvDev = query.includes(WEB_DEV_PREFIX);
    const wasCopiedFromWeb = includesLbryTvDev || includesLbryTvLocal || includesLbryTvProd;

    if (wasCopiedFromWeb) {
      let prefix = WEB_PROD_PREFIX;
      if (includesLbryTvLocal) prefix = WEB_LOCAL_PREFIX;
      if (includesLbryTvDev) prefix = WEB_DEV_PREFIX;
      this.onSubmitWebUri(query, prefix);
    } else if (suggestion) {
      this.onClickSuggestion(query, suggestion);
    } else {
      this.onSubmitRawString(query);
    }
  }

  input: ?HTMLInputElement;

  render() {
    const { suggestions, doFocus, doBlur, searchQuery } = this.props;

    return (
      <div
        // @if TARGET='app'
        onDoubleClick={e => {
          e.stopPropagation();
        }}
        // @endif

        className="wunderbar"
      >
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
              placeholder={__('Search')}
            />
          )}
          renderItem={({ value, type, shorthand }, isHighlighted) => (
            <div
              // Use value + type for key because there might be suggestions with same value but different type
              key={`${value}-${type}`}
              className={classnames('wunderbar__suggestion', {
                'wunderbar__active-suggestion': isHighlighted,
              })}
            >
              {type === SEARCH_TYPES.CHANNEL && <Icon icon={this.getSuggestionIcon(type)} />}
              <span className="wunderbar__suggestion-label">
                {type === SEARCH_TYPES.TAG ? <Tag name={value} /> : shorthand || value}
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
