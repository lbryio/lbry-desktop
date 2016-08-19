//component/icon.js

var Icon = React.createClass({
  propTypes: {
    style: React.PropTypes.object,
    fixed: React.PropTypes.bool,
  },
  render: function() {
    var className = 'icon ' + ('fixed' in this.props ? 'icon-fixed-width ' : '') + this.props.icon;
    return <span className={className} style={this.props.style}></span>
  }
});

var TruncatedText = React.createClass({
  propTypes: {
    limit: React.PropTypes.number,
  },
  getDefaultProps: function() {
    return {
      limit: 250,
    }
  },
  render: function() {
    var text = this.props.children;
    var limit = this.props.limit;
    return <span>{text.slice(0, limit) + (text.length > limit ? ' ...' : '')}</span>;
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
var ToolTip = React.createClass({
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

var CurrencySymbol = React.createClass({
  render: function() { return <span>LBC</span>; }
});

var CreditAmount = React.createClass({
  propTypes: {
    amount: React.PropTypes.number,
  },
  render: function() {
    var formattedAmount = lbry.formatCredits(this.props.amount);
    return (
      <span className="credit-amount">
        <span style={creditAmountStyle}>{formattedAmount} {parseFloat(formattedAmount) == 1.0 ? 'credit' : 'credits'}</span>
        { this.props.isEstimate ? <span style={estimateStyle}> (est)</span> : null }
      </span>
    );
  }
});
