import React from 'react';
import lbry from '../lbry.js';
import Modal from './modal.js';
import {Icon, ToolTip} from './common.js';


export let Link = React.createClass({
  handleClick: function() {
    if (this.props.onClick) {
      this.props.onClick();
    }
  },
  render: function() {
    var href = this.props.href ? this.props.href : 'javascript:;',
      icon = this.props.icon ? <Icon icon={this.props.icon} fixed={true} />  : '',
      className = (this.props.className ? this.props.className : '') +
        (this.props.button ? ' button-block button-' + this.props.button : '') +
        (this.props.hidden ? ' hidden' : '') +
        (this.props.disabled ? ' disabled' : '');

    return (
      <a className={className ? className : 'button-text'} href={href} style={this.props.style ? this.props.style : {}}
         title={this.props.title} onClick={this.handleClick}>
        {this.props.icon ? icon : '' }
        <span className="link-label">{this.props.label}</span>
        {this.props.badge ? <span className="badge">{this.props.badge}</span> : '' }
      </a>
    );
  }
});

var linkContainerStyle = {
  position: 'relative',
};

export let ToolTipLink = React.createClass({
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
      className = this.props.className +
        (this.props.button ? ' button-block button-' + this.props.button : '') +
        (this.props.hidden ? ' hidden' : '') +
        (this.props.disabled ? ' disabled' : '');

    return (
      <span style={linkContainerStyle}>
        <a className={className ? className : 'button-text'} href={href} style={this.props.style ? this.props.style : {}}
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

export let DownloadLink = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    streamName: React.PropTypes.string,
    sdHash: React.PropTypes.string,
    label: React.PropTypes.string,
    button: React.PropTypes.string,
    state: React.PropTypes.oneOf(['not-started', 'downloading', 'done']),
    progress: React.PropTypes.number,
    path: React.PropTypes.string,
    hidden: React.PropTypes.bool,
  },
  tryDownload: function() {
    lbry.getCostInfoForName(this.props.streamName, ({cost}) => {
      lbry.getBalance((balance) => {
        if (cost > balance) {
          this.setState({
            modal: 'notEnoughCredits',
          });
        } else {
          lbry.getStream(this.props.streamName, (streamInfo) => {
            if (streamInfo === null || typeof streamInfo !== 'object') {
              this.setState({
                modal: 'timedOut',
              });
            } else {
              this.setState({
                modal: 'downloadStarted',
                filePath: streamInfo.path,
              });
            }
          });
        }
      });
    });
  },
  getDefaultProps: function() {
    return {
      state: 'not-started',
    }
  },
  getInitialState: function() {
    return {
      filePath: null,
      modal: null,
    }
  },
  closeModal: function() {
    this.setState({
      modal: null,
    })
  },
  handleClick: function() {
    if (this.props.state == 'not-started') {
      this.tryDownload();
    } else if (this.props.state == 'done') {
      lbry.revealFile(this.props.path);
    }
  },
  render: function() {
    let linkBlock;
    if (this.props.state == 'not-started') {
      linkBlock = (
        <Link button="text" label="Download" icon="icon-download" onClick={this.handleClick} />
      );
    } else if (this.props.state == 'downloading') {
      const label = `${parseInt(this.props.progress * 100)}% complete`;
      linkBlock = (
        <span>
           <Link button="download" className="button-download--bg" label={label} icon="icon-download"
                 onClick={this.handleClick} />
           <Link button="download" className="button-download--fg" label={label} icon="icon-download"
                 onClick={this.handleClick} style={{width: `${this.props.progress * 100}%`}} />
         </span>
      );
    } else if (this.props.state == 'done') {
      linkBlock = (
        <Link button="alt" label="Open" icon='icon-external-link-square' onClick={this.handleClick} />
      );
    } else {
      throw new Error(`Unknown download state ${this.props.state} passed to DownloadLink`);
    }

    return (
      <span className="button-container">
        <Link className="button-download" button={this.props.button} hidden={this.props.hidden} label={label}
              icon={this.props.icon} onClick={this.handleClick} />
        {'progress' in this.props
          ? <Link className="button-download button-download--mirror" button={this.props.button} hidden={this.props.hidden} label={label}
                  icon={this.props.icon} onClick={this.handleClick} style={{width: `${this.props.progress * 100}%`}} />
          : null}
        <Modal className="download-started-modal" isOpen={this.state.modal == 'downloadStarted'}
               contentLabel="Download started" onConfirmed={this.closeModal}>
          <p>Downloading to:</p>
          <div className="download-started-modal__file-path">{this.state.filePath}</div>
        </Modal>
        <Modal isOpen={this.state.modal == 'notEnoughCredits'} contentLabel="Not enough credits"
               onConfirmed={this.closeModal}>
          You don't have enough LBRY credits to pay for this stream.
        </Modal>
        <Modal isOpen={this.state.modal == 'timedOut'} contentLabel="Download failed"
               onConfirmed={this.closeModal}>
          LBRY was unable to download the stream <strong>lbry://{this.props.streamName}</strong>.
        </Modal>
      </span>
    );
  }
});

export let WatchLink = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    streamName: React.PropTypes.string,
    label: React.PropTypes.string,
    button: React.PropTypes.string,
    hidden: React.PropTypes.bool,
  },
  handleClick: function() {
    this.setState({
      loading: true,
    })
    lbry.getCostInfoForName(this.props.streamName, ({cost}) => {
      lbry.getBalance((balance) => {
        if (cost > balance) {
          this.setState({
            modal: 'notEnoughCredits',
            loading: false,
          });
        } else {
          window.location = '?watch=' + this.props.streamName;
        }
      });
    });
  },
  getInitialState: function() {
    return {
      modal: null,
      loading: false,
    };
  },
  closeModal: function() {
    this.setState({
      modal: null,
    });
  },
  getDefaultProps: function() {
    return {
      icon: 'icon-play',
      label: 'Watch',
    }
  },
  render: function() {
    return (
      <div className="button-container">
        <Link button={this.props.button} hidden={this.props.hidden} style={this.props.style}
              disabled={this.state.loading} label={this.props.label} icon={this.props.icon}
              onClick={this.handleClick} />
        <Modal isOpen={this.state.modal == 'notEnoughCredits'} contentLabel="Not enough credits"
               onConfirmed={this.closeModal}>
          You don't have enough LBRY credits to pay for this stream.
        </Modal>
      </div>
    );
  }
});
