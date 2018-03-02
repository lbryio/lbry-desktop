import PropTypes from 'prop-types';
import React from 'react';

import { normalizeURI } from 'lbryURI';
import Icon from 'component/icon';
import { parseQueryParams } from 'util/query_params';

class WunderBar extends React.PureComponent {
  static TYPING_TIMEOUT = 800;

  static propTypes = {
    address: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.inputField = null;
    this.isSearchDispatchPending = false;
    this.resetOnNextBlur = true;
    this.stateBeforeSearch = null;
    this.userTypingTimer = null;

    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onReceiveRef = this.onReceiveRef.bind(this);

    this.state = {
      address: this.props.address,
      icon: this.props.icon,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address !== this.props.address) {
      this.setState({ address: nextProps.address, icon: nextProps.icon });
    }
  }

  componentDidUpdate() {
    if (this.inputField) {
      const start = this.inputField.selectionStart;
      const end = this.inputField.selectionEnd;

      this.inputField.value = this.state.address; // This causes cursor to go to end of input.
      this.inputField.setSelectionRange(start, end);

      if (this.focusPending) {
        this.inputField.select();
        this.focusPending = false;
      }
    }
  }

  componentWillUnmount() {
    if (this.userTypingTimer) {
      clearTimeout(this.userTypingTimer);
    }
  }

  onChange(event) {
    if (this.userTypingTimer) {
      clearTimeout(this.userTypingTimer);
    }

    this.setState({ address: event.target.value });

    this.isSearchDispatchPending = true;

    const searchQuery = event.target.value;

    this.userTypingTimer = setTimeout(() => {
      const hasQuery = searchQuery.length === 0;
      this.resetOnNextBlur = hasQuery;
      this.isSearchDispatchPending = false;

      if (searchQuery) {
        this.props.onSearch(searchQuery.trim());
      }
    }, WunderBar.TYPING_TIMEOUT);
  }

  onFocus() {
    this.stateBeforeSearch = this.state;

    const newState = {
      icon: 'icon-search',
      isActive: true,
    };

    this.focusPending = true;

    // below is hacking, improved when we have proper routing
    if (!this.state.address.startsWith('lbry://') && this.state.icon !== 'icon-search') {
      // onFocus, if they are not on an exact URL or a search page, clear the bar
      newState.address = '';
    }
    this.setState(newState);
  }

  onBlur() {
    if (this.isSearchDispatchPending) {
      setTimeout(() => {
        this.onBlur();
      }, WunderBar.TYPING_TIMEOUT + 1);
    } else {
      const commonState = { isActive: false };
      if (this.resetOnNextBlur) {
        this.setState(Object.assign({}, this.stateBeforeSearch, commonState));
        this.inputField.value = this.state.address;
      } else {
        this.resetOnNextBlur = true;
        this.stateBeforeSearch = this.state;
        this.setState(commonState);
      }
    }
  }

  onKeyPress(event) {
    if (event.charCode === 13 && this.inputField.value) {
      let extraParams = {};
      let method = 'onSubmit';
      let uri = null;

      this.resetOnNextBlur = false;
      clearTimeout(this.userTypingTimer);

      const parts = this.inputField.value.trim().split('?');
      const value = parts.shift();
      if (parts.length > 0) extraParams = parseQueryParams(parts.join(''));

      try {
        uri = normalizeURI(value);
      } catch (error) {
        // then it's not a valid URL, so let's search
        uri = value;
        method = 'onSearch';
      }

      this.props[method](uri, extraParams);
      this.inputField.blur();
    }
  }

  onReceiveRef(ref) {
    this.inputField = ref;
  }

  render() {
    return (
      <div className={`wunderbar${this.state.isActive ? ' wunderbar--active' : ''}`}>
        {this.state.icon ? <Icon fixed icon={this.state.icon} /> : ''}
        <input
          className="wunderbar__input"
          onBlur={this.onBlur}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onKeyPress={this.onKeyPress}
          placeholder={__('Find videos, music, games, and more')}
          ref={this.onReceiveRef}
          type="search"
          value={this.state.address}
        />
      </div>
    );
  }
}

export default WunderBar;
