import React from 'react';
import lbry from '../lbry.js';
import $clamp from 'clamp-js-main';

//component/icon.js
export let Icon = React.createClass({
  propTypes: {
    icon: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    fixed: React.PropTypes.bool,
  },
  render: function() {
    const {fixed, className, ...other} = this.props;
    const spanClassName = ('icon ' + ('fixed' in this.props ? 'icon-fixed-width ' : '') +
                           this.props.icon + ' ' + (this.props.className || ''));
    return <span className={spanClassName} {... other}></span>
  }
});

export let TruncatedText = React.createClass({
  propTypes: {
    lines: React.PropTypes.number,
    height: React.PropTypes.string,
    auto: React.PropTypes.bool,
  },
  getDefaultProps: function() {
    return {
      lines: null,
      height: null,
      auto: true,
    }
  },
  componentDidMount: function() {
    // Manually round up the line height, because clamp.js doesn't like fractional-pixel line heights.

    // Need to work directly on the style object because setting the style prop doesn't update internal styles right away.
    this.refs.span.style.lineHeight = Math.ceil(parseFloat(getComputedStyle(this.refs.span).lineHeight)) + 'px';

    $clamp(this.refs.span, {
      clamp: this.props.lines || this.props.height || 'auto',
    });
  },
  render: function() {
    return <span ref="span" className="truncated-text">{this.props.children}</span>;
  }
});

export let BusyMessage = React.createClass({
  propTypes: {
    message: React.PropTypes.string
  },
  render: function() {
    return <span>{this.props.message} <span className="busy-indicator"></span></span>
  }
});

export let CurrencySymbol = React.createClass({
  render: function() { return <span>LBC</span>; }
});

export let CreditAmount = React.createClass({
  propTypes: {
    amount: React.PropTypes.number.isRequired,
    precision: React.PropTypes.number,
    label: React.PropTypes.bool
  },
  getDefaultProps: function() {
    return {
      precision: 1,
      label: true,
    }
  },
  render: function() {
    var formattedAmount = lbry.formatCredits(this.props.amount, this.props.precision);
    return (
      <span className="credit-amount">
        <span>
          {formattedAmount}
          {this.props.label ?
           (parseFloat(formattedAmount) == 1.0 ? ' credit' : ' credits') : '' }
        </span>
        { this.props.isEstimate ? <span className="credit-amount__estimate" title="This is an estimate and does not include data fees">*</span> : null }
      </span>
    );
  }
});

export let FilePrice = React.createClass({
  _isMounted: false,

  propTypes: {
    metadata: React.PropTypes.object,
    uri: React.PropTypes.string.isRequired,
  },

  getInitialState: function() {
    return {
      cost: null,
      isEstimate: null,
    }
  },

  componentDidMount: function() {
    this._isMounted = true;
    lbry.getCostInfo(this.props.uri).then(({cost, includesData}) => {
      if (this._isMounted) {
        this.setState({
          cost: cost,
          isEstimate: includesData,
        });
      }
    }, (err) => {
      // If we get an error looking up cost information, do nothing
    });
  },

  componentWillUnmount: function() {
    this._isMounted = false;
  },

  render: function() {
    if (this.state.cost === null && this.props.metadata) {
      if (!this.props.metadata.fee) {
        return <span className="credit-amount">free*</span>;
      } else {
        if (this.props.metadata.fee.currency === "LBC") {
          return <CreditAmount label={false} amount={this.props.metadata.fee.amount} isEstimate={true} />
        } else if (this.props.metadata.fee.currency === "USD") {
          return <span className="credit-amount">???</span>;
        }
      }
    }
    return (
      this.state.cost !== null ?
      <CreditAmount amount={this.state.cost} label={false} isEstimate={!this.state.isEstimate}/> :
      <span className="credit-amount">???</span>
    );
  }
});

var addressStyle = {
  fontFamily: '"Consolas", "Lucida Console", "Adobe Source Code Pro", monospace',
};
export let Address = React.createClass({
  propTypes: {
    address: React.PropTypes.string,
  },
  render: function() {
    return (
      <span style={addressStyle}>{this.props.address}</span>
    );
  }
});

export let Thumbnail = React.createClass({
  _defaultImageUri: lbry.imagePath('default-thumb.svg'),
  _maxLoadTime: 10000,
  _isMounted: false,

  propTypes: {
    src: React.PropTypes.string,
  },
  handleError: function() {
    if (this.state.imageUrl != this._defaultImageUri) {
      this.setState({
        imageUri: this._defaultImageUri,
      });
    }
  },
  getInitialState: function() {
    return {
      imageUri: this.props.src || this._defaultImageUri,
    };
  },
  componentDidMount: function() {
    this._isMounted = true;
    setTimeout(() => {
      if (this._isMounted && !this.refs.img.complete) {
        this.setState({
          imageUri: this._defaultImageUri,
        });
      }
    }, this._maxLoadTime);
  },
  componentWillUnmount: function() {
    this._isMounted = false;
  },
  render: function() {
    return <img ref="img" onError={this.handleError} {... this.props} src={this.state.imageUri} />
  },
});
