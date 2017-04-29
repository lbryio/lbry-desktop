import React from 'react';
import lbry from '../lbry.js';

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
    lines: React.PropTypes.number
  },
  getDefaultProps: function() {
    return {
      lines: null,
    }
  },
  render: function() {
    return <span className="truncated-text" style={{ WebkitLineClamp: this.props.lines }}>{this.props.children}</span>;
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
    isEstimate: React.PropTypes.bool,
    label: React.PropTypes.bool,
    showFree: React.PropTypes.bool,
    look: React.PropTypes.oneOf(['indicator', 'plain']),
  },
  getDefaultProps: function() {
    return {
      precision: 1,
      label: true,
      showFree: false,
      look: 'indicator',
    }
  },
  render: function() {
    const formattedAmount = lbry.formatCredits(this.props.amount, this.props.precision);
    let amountText;
    if (this.props.showFree && parseFloat(formattedAmount) == 0) {
      amountText = 'free';
    } else if (this.props.label) {
      amountText = formattedAmount + (parseFloat(formattedAmount) == 1 ? ' credit' : ' credits');
    } else {
      amountText = formattedAmount;
    }

    return (
      <span className={`credit-amount credit-amount--${this.props.look}`}>
        <span>
          {amountText}
        </span>
        { this.props.isEstimate ? <span className="credit-amount__estimate" title="This is an estimate and does not include data fees">*</span> : null }
      </span>
    );
  }
});

var addressStyle = {
  fontFamily: '"Consolas", "Lucida Console", "Adobe Source Code Pro", monospace',
};
export let Address = React.createClass({
  _inputElem: null,
  propTypes: {
    address: React.PropTypes.string,
  },
  render: function() {
    return (
      <input className="input-copyable" type="text" ref={(input) => { this._inputElem = input; }}
             onFocus={() => { this._inputElem.select(); }} style={addressStyle} readOnly="readonly" value={this.props.address}></input>
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
    const className = this.props.className ? this.props.className : '',
          otherProps = Object.assign({}, this.props)
    delete otherProps.className;
    return <img ref="img" onError={this.handleError} {...otherProps} className={className} src={this.state.imageUri} />
  },
});
