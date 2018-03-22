import React from 'react';
import PropTypes from 'prop-types';
import { normalizeURI } from 'lbryURI';
import Icon from 'component/icon';
import { parseQueryParams } from 'util/query_params';

class WunderBar extends React.PureComponent {
  static TYPING_TIMEOUT = 800;
  static START_SEARCH = 100;

  static propTypes = {
    onSearch: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this._userTypingTimer = null;
    this._isSearchDispatchPending = false;
    this._input = null;
    this._stateBeforeSearch = null;
    this._resetOnNextBlur = true;
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onReceiveRef = this.onReceiveRef.bind(this);
    this.state = {
      address: this.props.address,
      icon: this.props.icon,
    };
  }

  componentWillUnmount() {
    if (this.userTypingTimer) {
      clearTimeout(this._userTypingTimer);
    }
  }

  onChange(event) {
    if (this._userTypingTimer) {
      clearTimeout(this._userTypingTimer);
    }

    this.setState({ address: event.target.value });

    const searchDispatchWasPending = this._isSearchDispatchPending;

    this._isSearchDispatchPending = true;

    const searchQuery = event.target.value;

    this._userTypingTimer = setTimeout(() => {
      const hasQuery = searchQuery.length === 0;
      this._resetOnNextBlur = hasQuery;
      this._isSearchDispatchPending = false;
      if (searchQuery) {
        this.props.onSearch(searchQuery.trim());
      }
    },
    searchDispatchWasPending ? WunderBar.TYPING_TIMEOUT : WunderBar.START_SEARCH);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.viewingPage !== this.props.viewingPage ||
      nextProps.address != this.props.address
    ) {
      this.setState({ address: nextProps.address, icon: nextProps.icon });
    }
  }

  onFocus() {
    this._stateBeforeSearch = this.state;
    const newState = {
      icon: 'icon-search',
      isActive: true,
    };

    this._focusPending = true;
    // below is hacking, improved when we have proper routing
    if (!this.state.address.startsWith('lbry://') && this.state.icon !== 'icon-search') {
      // onFocus, if they are not on an exact URL or a search page, clear the bar
      newState.address = '';
    }
    this.setState(newState);
  }

  onBlur() {
    if (this._isSearchDispatchPending) {
      setTimeout(() => {
        this.onBlur();
      }, WunderBar.TYPING_TIMEOUT + 1);
    } else {
      const commonState = { isActive: false };
      if (this._resetOnNextBlur) {
        this.setState(Object.assign({}, this._stateBeforeSearch, commonState));
        this._input.value = this.state.address;
      } else {
        this._resetOnNextBlur = true;
        this._stateBeforeSearch = this.state;
        this.setState(commonState);
      }
    }
  }

  componentDidUpdate() {
    if (this._input) {
      const start = this._input.selectionStart,
        end = this._input.selectionEnd;

      this._input.value = this.state.address; // this causes cursor to go to end of input

      this._input.setSelectionRange(start, end);

      if (this._focusPending) {
        this._input.select();
        this._focusPending = false;
      }
    }
  }

  onKeyPress(event) {
    if (event.charCode == 13 && this._input.value) {
      let uri = null,
        method = 'onSubmit',
        extraParams = {};

      this._resetOnNextBlur = false;
      clearTimeout(this._userTypingTimer);

      const parts = this._input.value.trim().split('?');
      const value = parts.shift();
      if (parts.length > 0) extraParams = parseQueryParams(parts.join(''));

      try {
        uri = normalizeURI(value);
        this.setState({ value: uri });
      } catch (error) {
        // then it's not a valid URL, so let's search
        uri = value;
        method = 'onSearch';
      }

      this.props[method](uri, extraParams);
      this._input.blur();
    }
  }

  onReceiveRef(ref) {
    this._input = ref;
  }

  render() {
    return (
      <div className={`wunderbar${this.state.isActive ? ' wunderbar--active' : ''}`}>
        {this.state.icon ? <Icon fixed icon={this.state.icon} /> : ''}
        <input
          className="wunderbar__input"
          type="search"
          ref={this.onReceiveRef}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
          value={this.state.address}
          placeholder={__('Find videos, music, games, and more')}
        />
      </div>
    );
  }
}

export default WunderBar;
