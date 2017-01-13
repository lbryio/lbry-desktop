import React from 'react';
import lbry from '../lbry.js';
import {Link} from '../component/link.js';
import {Icon} from '../component/common.js';
import Modal from './modal.js';
import FormField from './form.js';
import {DropDownMenu, DropDownMenuItem} from './menu.js';

let WatchLink = React.createClass({
  propTypes: {
    streamName: React.PropTypes.string,
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
  render: function() {
    return (
      <div className="button-container">
        <Link button="primary" disabled={this.state.loading} label="Watch" icon="icon-play" onClick={this.handleClick} />
        <Modal contentLabel="Not enough credits" isOpen={this.state.modal == 'notEnoughCredits'} onConfirmed={this.closeModal}>
          You don't have enough LBRY credits to pay for this stream.
        </Modal>
      </div>
    );
  }
});

export let FileActions = React.createClass({
  _isMounted: false,
  _fileInfoSubscribeId: null,

  propTypes: {
    streamName: React.PropTypes.string,
    sdHash: React.PropTypes.string,
    metadata: React.PropTypes.object,
    path: React.PropTypes.string,
    hidden: React.PropTypes.bool,
    onRemoveConfirmed: React.PropTypes.func,
    deleteChecked: React.PropTypes.bool,
  },
  getInitialState: function() {
    return {
      fileInfo: null,
      modal: null,
      menuOpen: false,
      deleteChecked: false,
      attemptingDownload: false,
      attemptingRemove: false,
    }
  },
  onFileInfoUpdate: function(fileInfo) {
    if (this._isMounted) {
      this.setState({
        fileInfo: fileInfo ? fileInfo : false,
        attemptingDownload: fileInfo ? false : this.state.attemptingDownload
      });
    }
  },
  tryDownload: function() {
    this.setState({
      attemptingDownload: true,
      attemptingRemove: false
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
            }
          });
        }
      });
    });
  },
  closeModal: function() {
    this.setState({
      modal: null,
    })
  },
  onDownloadClick: function() {
    if (!this.state.fileInfo && !this.state.attemptingDownload) {
      this.tryDownload();
    }
  },
  onOpenClick: function() {
    if (this.state.fileInfo && this.state.fileInfo.completed) {
      lbry.openFile(this.state.fileInfo.download_path);
    }
  },
  handleDeleteCheckboxClicked: function(event) {
    this.setState({
      deleteChecked: event.target.checked,
    });
  },
  handleRevealClicked: function() {
    if (this.state.fileInfo && this.state.fileInfo.download_path) {
      lbry.revealFile(this.state.fileInfo.download_path);
    }
  },
  handleRemoveClicked: function() {
    this.setState({
      modal: 'confirmRemove',
    });
  },
  handleRemoveConfirmed: function() {
    lbry.deleteFile(this.props.sdHash || this.props.streamName, this.state.deleteChecked);
    if (this.props.onRemoveConfirmed) {
      this.props.onRemoveConfirmed();
    }
    this.setState({
      modal: null,
      fileInfo: false,
      attemptingRemove: true,
      attemptingDownload: false
    });
  },
  openMenu: function() {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  },
  componentDidMount: function() {
    this._isMounted = true;

    if ('sdHash' in this.props) {
      alert('render by sd hash is broken');
      lbry.fileInfoSubscribeByStreamHash(this.props.sdHash, this.fileInfoU);
    } else if ('streamName' in this.props) {
      this._fileInfoSubscribeId = lbry.fileInfoSubscribeByName(this.props.streamName, this.onFileInfoUpdate);
    } else {
      throw new Error("No stream name or sd hash passed to FileTile");
    }
  },
  componentWillUnmount: function() {
    this._isMounted = false;
    if (this._fileInfoSubscribeId) {
      lbry.fileInfoUnsubscribe(this.props.name, this._fileInfoSubscribeId);
    }
  },
  render: function() {
    if (this.state.fileInfo === null)
    {
      return <section className="file-actions--stub"></section>;
    }
    const openInFolderMessage = window.navigator.platform.startsWith('Mac') ? 'Open in Finder' : 'Open in Folder',
          showMenu = !this.state.attemptingRemove && this.state.fileInfo !== null;

    let linkBlock;
    if (this.state.attemptingRemove || (this.state.fileInfo === false && !this.state.attemptingDownload)) {
      linkBlock = <Link button="text" label="Download" icon="icon-download" onClick={this.onDownloadClick} />;
    } else if (this.state.attemptingDownload || !this.state.fileInfo.completed) {
      const
        progress = this.state.fileInfo ? this.state.fileInfo.written_bytes / this.state.fileInfo.total_bytes * 100 : 0,
        label = this.state.fileInfo ? progress.toFixed(0) + '% complete' : 'Connecting...',
        labelWithIcon = <span><Icon icon="icon-download" />{label}</span>;

      linkBlock =
        <div className="faux-button-block file-actions__download-status-bar">
          <div className="faux-button-block file-actions__download-status-bar-overlay" style={{ width: progress + '%' }}>{labelWithIcon}</div>
          {labelWithIcon}
        </div>;
    } else {
      linkBlock = <Link button="text" label="Open" icon="icon-folder-open" onClick={this.onOpenClick} />;
    }

    return (
      <section className="file-actions">
        {this.props.metadata.content_type.startsWith('video/') ? <WatchLink streamName={this.props.streamName} /> : null}
        {this.state.fileInfo !== null || this.state.fileInfo.isMine ?
          <div className="button-container">{linkBlock}</div>
          : null}
        { showMenu ?
          <DropDownMenu>
            <DropDownMenuItem key={0} onClick={this.handleRevealClicked} label={openInFolderMessage} />
            <DropDownMenuItem key={1} onClick={this.handleRemoveClicked} label="Remove..." />
          </DropDownMenu> : '' }
        <Modal isOpen={this.state.modal == 'notEnoughCredits'} contentLabel="Not enough credits"
               onConfirmed={this.closeModal}>
          You don't have enough LBRY credits to pay for this stream.
        </Modal>
        <Modal isOpen={this.state.modal == 'timedOut'} contentLabel="Download failed"
               onConfirmed={this.closeModal}>
          LBRY was unable to download the stream <strong>lbry://{this.props.streamName}</strong>.
        </Modal>
        <Modal isOpen={this.state.modal == 'confirmRemove'} contentLabel="Not enough credits"
               type="confirm" confirmButtonLabel="Remove" onConfirmed={this.handleRemoveConfirmed}
               onAborted={this.closeModal}>
          <p>Are you sure you'd like to remove <cite>{this.props.metadata.title}</cite> from LBRY?</p>

          <label><FormField type="checkbox" checked={this.state.deleteChecked} onClick={this.handleDeleteCheckboxClicked} /> Delete this file from my computer</label>
        </Modal>
      </section>
    );
  }
});