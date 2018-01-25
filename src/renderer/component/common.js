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

export class Thumbnail extends React.PureComponent {
  static propTypes = {
    src: PropTypes.string,
  };

  handleError() {
    if (this.state.imageUrl != this._defaultImageUri) {
      this.setState({
        imageUri: this._defaultImageUri,
      });
    }
  }

  constructor(props) {
    super(props);

    this._defaultImageUri = lbry.imagePath('default-thumb.svg');
    this._maxLoadTime = 10000;
    this._isMounted = false;

    this.state = {
      imageUri: this.props.src || this._defaultImageUri,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    setTimeout(() => {
      if (this._isMounted && !this.refs.img.complete) {
        this.setState({
          imageUri: this._defaultImageUri,
        });
      }
    }, this._maxLoadTime);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const className = this.props.className ? this.props.className : '',
      otherProps = Object.assign({}, this.props);
    delete otherProps.className;
    return (
      <img
        ref="img"
        onError={() => {
          this.handleError();
        }}
        {...otherProps}
        className={className}
        src={this.state.imageUri}
      />
    );
  }
}
/* eslint-enable */
