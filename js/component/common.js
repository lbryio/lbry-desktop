//component/icon.js

var Icon = React.createClass({
  propTypes: {
    style: React.PropTypes.object,
    fixed: React.PropTypes.boolean,
  },
  render: function() {
    var className = 'icon ' + ('fixed' in this.props ? 'icon-fixed-width ' : '') + this.props.icon;
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
      <a className={className} href={href} style={this.props.style ? this.props.style : {}}
        title={this.props.title} onClick={this.props.onClick}>
        {this.props.icon ? icon : '' }
        {this.props.label}
      </a>
    );
  }
});

// Generic menu styles
var menuStyle = {
  border: '1px solid #aaa',
  padding: '2px',
  whiteSpace: 'nowrap',
};

var Menu = React.createClass({
  render: function() {
    return (
      <div style={menuStyle}>
        {this.props.children}
      </div>
    );
  }
});

var menuItemStyle = {
  display: 'block',
};
var MenuItem = React.createClass({
  propTypes: {
    href: React.PropTypes.string,
    label: React.PropTypes.string,
    icon: React.PropTypes.string,
    onClick: React.PropTypes.function,
  },
  getDefaultProps: function() {
    return {
      iconPosition: 'left',
    }
  },
  render: function() {
    var icon = (this.props.icon ? <Icon icon={this.props.icon} fixed /> : null);

    return (
      <a style={menuItemStyle} href={this.props.href} label={this.props.label} title={this.props.label}
         className="button-text no-underline">
        {this.props.iconPosition == 'left' ? icon : null}
        {this.props.label}
        {this.props.iconPosition == 'left' ? null : icon}
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

var subPageLogoStyle = {
  maxWidth: '150px',
  display: 'block',
  marginTop: '36px',
};
var SubPageLogo = React.createClass({
  render: function() {
    return <img src="img/lbry-dark-1600x528.png" style={subPageLogoStyle} />;
  }
});