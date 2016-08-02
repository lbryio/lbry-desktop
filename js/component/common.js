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

var linkContainerStyle = {
  position: 'relative',
};
var Link = React.createClass({
  getInitialState: function() {
    return {
      showTooltip: false,
    };
  },
  handleClick: function() {
    if (this.props.tooltip) {
      this.setState({
        showTooltip: !this.state.showTooltip,
      });
    }
    if (this.props.onClick) {
      this.props.onClick();
    }
  },
  handleTooltipMouseOut: function() {
    this.setState({
      showTooltip: false,
    });
  },
  render: function() {
    var href = this.props.href ? this.props.href : 'javascript:;',
      icon = this.props.icon ? <Icon icon={this.props.icon} />  : '',
      className = (this.props.button ? 'button-block button-' + this.props.button : 'button-text') +
                  (this.props.hidden ? ' hidden' : '') + (this.props.disabled ? ' disabled' : '');


    return (
      <span style={linkContainerStyle}>
        <a className={className} href={href} style={this.props.style ? this.props.style : {}}
          title={this.props.title} onClick={this.handleClick}>
          {this.props.icon ? icon : '' }
          {this.props.label}
        </a>
        {(!this.props.tooltip ? null :
          <ToolTip open={this.state.showTooltip} onMouseOut={this.handleTooltipMouseOut}>
            {this.props.tooltip}
          </ToolTip>
        )}
      </span>
    );
  }
});

var DownloadLink = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    streamName: React.PropTypes.string,
    label: React.PropTypes.string,
    downloadingLabel: React.PropTypes.string,
    button: React.PropTypes.string,
    style: React.PropTypes.object,
    hidden: React.PropTypes.bool,
  },
  getDefaultProps: function() {
    return {
      icon: 'icon-download',
      label: 'Download',
      downloadingLabel: 'Downloading...',
    }
  },
  getInitialState: function() {
    return {
      downloading: false,
    }
  },
  handleClick: function() {
    lbry.getCostEstimate(this.props.streamName, (amount) => {
      lbry.getBalance((balance) => {
        if (amount > balance) {
          alert("You don't have enough LBRY credits to pay for this stream.");
        } else {
          this.startDownload();
        }
      });
    });
  },
  startDownload: function() {
    if (!this.state.downloading) { //@TODO: Continually update this.state.downloading based on actual status of file
      this.setState({
        downloading: true
      });

      lbry.getStream(this.props.streamName, (streamInfo) => {
        alert('Downloading to ' + streamInfo.path);
        console.log(streamInfo);
      });
    }
  },
  render: function() {
    var label = (!this.state.downloading ? this.props.label : this.props.downloadingLabel);
    return <Link button={this.props.button} hidden={this.props.hidden} style={this.props.style}
                 disabled={this.state.downloading} label={label} icon={this.props.icon} onClick={this.handleClick} />;
  }
});

var WatchLink = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    streamName: React.PropTypes.string,
    label: React.PropTypes.string,
    button: React.PropTypes.string,
    style: React.PropTypes.object,
    hidden: React.PropTypes.bool,
  },
  handleClick: function() {
    lbry.getCostEstimate(this.props.streamName, (amount) => {
      lbry.getBalance((balance) => {
        if (amount > balance) {
          alert("You don't have enough LBRY credits to pay for this stream.");
        } else {
          window.location = '?watch=' + this.props.streamName;                  
        }
      });
    });
  },
  getDefaultProps: function() {
    return {
      icon: 'icon-play',
      label: 'Watch',
    }
  },

  render: function() {    
    return <Link button={this.props.button} hidden={this.props.hidden} style={this.props.style}
                 label={this.props.label} icon={this.props.icon} onClick={this.handleClick} />;
  }
});

// Generic menu styles
var menuStyle = {
  border: '1px solid #aaa',
  padding: '4px',
  whiteSpace: 'nowrap',
};

var Menu = React.createClass({
  handleWindowClick: function(e) {
    if (this.props.toggleButton && ReactDOM.findDOMNode(this.props.toggleButton).contains(e.target)) {
      // Toggle button was clicked
      this.setState({
        open: !this.state.open
      });
    } else if (this.state.open && !this.refs.div.contains(e.target)) {
      // Menu is open and user clicked outside of it
      this.setState({
        open: false
      });
    }
  },
  propTypes: {
    openButton: React.PropTypes.element,
  },
  getInitialState: function() {
    return {
      open: false,
    };
  },
  componentDidMount: function() {
    window.addEventListener('click', this.handleWindowClick, false);
  },
  componentWillUnmount: function() {
    window.removeEventListener('click', this.handleWindowClick, false);
  },
  render: function() {
    return (
      <div ref='div' style={menuStyle} className={this.state.open ? '' : 'hidden'}>
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
      <a style={menuItemStyle} className="button-text no-underline" onClick={this.props.onClick}
         href={this.props.href || 'javascript:'} label={this.props.label}>
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