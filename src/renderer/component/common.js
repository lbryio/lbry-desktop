// just disabling the linter because this file shouldn't even exist
// will continue to move components over to /components/common/{comp} - sean
/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { formatCredits, formatFullPrice } from 'util/formatCredits';
import lbry from '../lbry.js';

export class TruncatedText extends React.PureComponent {
  static propTypes = {
    lines: PropTypes.number,
  };

  static defaultProps = {
    lines: null,
  };

  render() {
    return (
      <span className="truncated-text" style={{ WebkitLineClamp: this.props.lines }}>
        {this.props.children}
      </span>
    );
  }
}

export class BusyMessage extends React.PureComponent {
  static propTypes = {
    message: PropTypes.string,
  };

  render() {
    return (
      <span>
        {this.props.message} <span className="busy-indicator" />
      </span>
    );
  }
}

export class CurrencySymbol extends React.PureComponent {
  render() {
    return <span>LBC</span>;
  }
}
/* eslint-enable */
