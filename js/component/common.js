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
      <a className={className} href={href} style={this.props.style ? this.props.style : {}}
        title={this.props.title} onClick={this.props.onClick}>
        {this.props.icon ? icon : '' }
        {this.props.label}
      </a>
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
                 disabled={this.state.downloading} label={label} icon={this.props.icon} onClick={this.startDownload} />;
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

  getDefaultProps: function() {
    return {
      icon: 'icon-play',
      label: 'Watch',
    }
  },

  render: function() {
    // No support for lbry:// URLs in Windows or on Chrome yet
    if (/windows|win32/i.test(navigator.userAgent) || (window.chrome && window.navigator.vendor == "Google Inc.")) {
      var uri = "/?watch=" + this.props.streamName;
    } else {
      var uri = 'lbry://' + this.props.streamName;
    }

    return <Link button={this.props.button} hidden={this.props.hidden} style={this.props.style}
                 href={uri} label={this.props.label} icon={this.props.icon} onClick={this.onClick} />;
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