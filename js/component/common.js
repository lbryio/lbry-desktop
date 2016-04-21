//component/icon.js

var Icon = React.createClass({
  propTypes: {
    style: React.PropTypes.object,
  },
  render: function() {
    var className = 'icon ' + this.props.icon;
    return <span className={className} style={this.props.style}></span>
  }
});

var Link = React.createClass({
  render: function() {
    console.log(this.props);
    var href = this.props.href ? this.props.href : 'javascript:;',
      icon = this.props.icon ? <Icon icon={this.props.icon} />  : '',
      className = (this.props.button ? 'button-block button-' + this.props.button : 'button-text') +
                  (this.props.hidden ? ' hidden' : '') + (this.props.disabled ? ' disabled' : '');
    return (
      <a className={className} href={href} style={this.props.style ? this.props.style : {}} onClick={this.props.onClick}>
        {this.props.icon ? icon : '' }
        {this.props.label}
      </a>
    );
  }
});

var creditAmountStyle = {
  color: '#216C2A',
  fontWeight: 'bold',
  fontSize: '0.8em'
}, estimateStyle = {
  marginLeft : '5px',
  color: '#aaa',
};

var CreditAmount = React.createClass({
  propTypes: {
    amount: React.PropTypes.number,
  },
  render: function() {
    var formattedAmount = lbry.formatCredits(this.props.amount);
    return (
      <span className="credit-amount">
        <span style={creditAmountStyle}>{formattedAmount}</span>
        { this.props.isEstimate ? <span style={estimateStyle}>(est)</span> : null }
      </span>
    );
  }
});