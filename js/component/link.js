import React from 'react';
import lbry from '../lbry.js';
import FormField from './form.js';
import Modal from './modal.js';
import {Menu, MenuItem} from './menu.js';
import {Icon, ToolTip} from './common.js';


export let Link = React.createClass({
  propTypes: {
    label: React.PropTypes.string,
    icon: React.PropTypes.string,
    button: React.PropTypes.string,
    badge: React.PropTypes.string,
    hidden: React.PropTypes.bool,
  },
  getDefaultProps: function() {
    return {
      hidden: false,
      disabled: false,
    };
  },
  handleClick: function() {
    if (this.props.onClick) {
      this.props.onClick();
    }
  },
  render: function() {
    if (this.props.hidden) {
      return null;
    }

    const className = (this.props.className || '') +
      (this.props.button ? ' button-block button-' + this.props.button : '') +
      (!this.props.className && !this.props.button ? 'button-text' : '') +
      (this.props.disabled ? ' disabled' : '');

    let content;
    if (this.props.children) { // Custom content
      content = this.props.children;
    } else {
      content = (
        <span>
          {'icon' in this.props
            ? <Icon icon={this.props.icon} fixed={true} />
            : null}
           <span className="link-label">{this.props.label}</span>
          {'badge' in this.props
            ? <span className="badge">{this.props.badge}</span>
            : null}
        </span>
      );
    }

    return (
      <a className={className} href={this.props.href || 'javascript:;'} title={this.props.title}
         onClick={this.handleClick} {... 'style' in this.props ? {style: this.props.style} : {}}>
         {content}
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

export let DropDown = React.createClass({
  propTypes: {
    onCaretClick: React.PropTypes.func,
  },
  handleCaretClicked: function(event) {
    /**
     * The menu handles caret clicks via a window event listener, so we just need to prevent clicks
     * on the caret from bubbling up to the link
     */
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
    event.stopPropagation();
    return false;
  },
  closeMenu: function(event) {
    this.setState({
      menuOpen: false,
    });
  },
  getInitialState: function() {
    return {
      menuOpen: false,
    };
  },
  render: function() {
    const {onCaretClick, ...other} = this.props;
    return (
      <div>
        <Link {...other}>
          <span className="link-label">{this.props.label}</span>
          <Icon icon="icon-caret-down" fixed={true} onClick={this.handleCaretClicked} />
        </Link>
        {this.state.menuOpen
          ? <Menu onClickOut={this.closeMenu}>
              {this.props.children}
            </Menu>
          : null}
      </div>
    );
  }
});

export let DownloadLink = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    streamName: React.PropTypes.string,
    sdHash: React.PropTypes.string,
    metadata: React.PropTypes.object,
    label: React.PropTypes.string,
    button: React.PropTypes.string,
    state: React.PropTypes.oneOf(['not-started', 'downloading', 'done']),
    progress: React.PropTypes.number,
    path: React.PropTypes.string,
    hidden: React.PropTypes.bool,
    deleteChecked: React.PropTypes.bool,
  },
  tryDownload: function() {
    this.setState({
      attemptingDownload: true,
    });
    lbry.getCostInfoForName(this.props.streamName, ({cost}) => {
      lbry.getBalance((balance) => {
        if (cost > balance) {
          this.setState({
            modal: 'notEnoughCredits',
            attemptingDownload: false,
          });
        } else {
          lbry.getStream(this.props.streamName, (streamInfo) => {
            if (streamInfo === null || typeof streamInfo !== 'object') {
              this.setState({
                modal: 'timedOut',
                attemptingDownload: false,
              });
            } else {
              this.setState({
                filePath: streamInfo.path,
                attemptingDownload: false,
              });
            }
          });
        }
      });
    });
  },
  openMenu: function() {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  },
  handleDeleteCheckboxClicked: function(event) {
    this.setState({
      deleteChecked: event.target.checked,
    });
  },
  handleRevealClicked: function() {
    lbry.revealFile(this.props.path);
  },
  handleRemoveClicked: function() {
    this.setState({
      modal: 'confirmRemove',
    });
  },
  handleRemoveConfirmed: function() {
    lbry.deleteFile(this.props.sdHash || this.props.streamName, this.state.deleteChecked);
    this.setState({
      modal: null,
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
      menuOpen: false,
      deleteChecked: false,
      attemptingDownload: false,
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
    const openInFolderMessage = window.navigator.platform.startsWith('Mac') ? 'Open in Finder' : 'Open in Folder';

    const dropDownItems = [
      <MenuItem onClick={this.handleRevealClicked} label={openInFolderMessage} />,
      <MenuItem onClick={this.handleRemoveClicked} label="Remove..." />,
    ];

    let linkBlock;
    if (this.state.attemptingDownload) {
      linkBlock = <Link button="text" className="button-download button-download--bg"
                        label="Connecting..." icon="icon-download" />
    } else if (this.props.state == 'downloading') {
      const label = `${parseInt(this.props.progress * 100)}% complete`;
      linkBlock = (
        <span>
          <DropDown button="download" className="button-download--bg" label={label} icon="icon-download"
                    onClick={this.handleClick}>
            {dropDownItems}
          </DropDown>
          <DropDown button="download" className="button-download--fg" label={label} icon="icon-download"
                    onClick={this.handleClick} style={{width: `${this.props.progress * 100}%`}}>
            {dropDownItems}
          </DropDown>
        </span>
      );
    } else if (this.props.state == 'not-started') {
      linkBlock = (
        <Link button="text" label="Download" icon="icon-download" onClick={this.handleClick} />
      );
    } else if (this.props.state == 'done') {
      linkBlock = (
        <DropDown button="alt" label="Open" onClick={this.handleClick} onCaretClick={this.openMenu}>
          {dropDownItems}
        </DropDown>
      );
    } else {
      throw new Error(`Unknown download state ${this.props.state} passed to DownloadLink`);
    }

    return (
      <span className="button-container">
        <Modal isOpen={this.state.modal == 'notEnoughCredits'} contentLabel="Not enough credits"
               onConfirmed={this.closeModal}>
          You don't have enough LBRY credits to pay for this stream.
        </Modal>
        <Modal isOpen={this.state.modal == 'timedOut'} contentLabel="Download failed"
               onConfirmed={this.closeModal}>
          LBRY was unable to download the stream <strong>lbry://{this.props.streamName}</strong>.
        </Modal>
        <Modal isOpen={this.state.modal == 'confirmRemove'} type="confirm" confirmButtonLabel="Remove"
               onConfirmed={this.handleRemoveConfirmed} onAborted={this.closeModal}>
          <p>Are you sure you'd like to remove <cite>{this.props.metadata.title}</cite> from LBRY?</p>

          <label><FormField type="checkbox" checked={this.state.deleteChecked} onClick={this.handleDeleteCheckboxClicked} /> Delete this file from my computer</label>
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
