import React from 'react';
import lbry from '../lbry.js';
import $clamp from 'clamp-js';

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
    $clamp(this.refs.span, {
      clamp: this.props.lines || this.props.height || 'auto',
    });
  },
  render: function() {
    var text = this.props.children;
    return <span ref="span">{text}</span>;
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

var toolTipStyle = {
  position: 'absolute',
  zIndex: '1',
  top: '100%',
  left: '-120px',
  width: '260px',
  padding: '15px',
  border: '1px solid #aaa',
  backgroundColor: '#fff',
  fontSize: '14px',
};
export let ToolTip = React.createClass({
  propTypes: {
    open: React.PropTypes.bool.isRequired,
    onMouseOut: React.PropTypes.func
  },
  render: function() {
    return (
      <div className={this.props.open ? '' : 'hidden'} style={toolTipStyle} onMouseOut={this.props.onMouseOut}>
        {this.props.children}
      </div>
    );
  }
});

var creditAmountStyle = {
  color: '#216C2A',
  fontWeight: 'bold',
  fontSize: '0.8em'
}, estimateStyle = {
  fontSize: '0.8em',
  color: '#aaa',
};

export let CurrencySymbol = React.createClass({
  render: function() { return <span>LBC</span>; }
});

export let CreditAmount = React.createClass({
  propTypes: {
    amount: React.PropTypes.number,
    precision: React.PropTypes.number
  },
  render: function() {
    var formattedAmount = lbry.formatCredits(this.props.amount, this.props.precision ? this.props.precision : 1);
    return (
      <span className="credit-amount">
        <span style={creditAmountStyle}>{formattedAmount} {parseFloat(formattedAmount) == 1.0 ? 'credit' : 'credits'}</span>
        { this.props.isEstimate ? <span style={estimateStyle}> (est)</span> : null }
      </span>
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
  _defaultImageUri: '/img/default-thumb.svg',
  _maxLoadTime: 10000,
  _isMounted: false,

  propTypes: {
    src: React.PropTypes.string.isRequired,
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
