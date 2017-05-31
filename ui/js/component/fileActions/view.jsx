import React from 'react';
import {Icon,BusyMessage} from 'component/common';
import FilePrice from 'component/filePrice'
import {Modal} from 'component/modal';
import {FormField} from 'component/form';
import Link from 'component/link';
import {ToolTip} from 'component/tooltip';
import {DropDownMenu, DropDownMenuItem} from 'component/menu';

class FileActions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      forceShowActions: false,
      deleteChecked: false,
    }
  }

  componentWillMount() {
    this.checkAvailability(this.props.uri)
  }

  componentWillReceiveProps(nextProps) {
    this.checkAvailability(nextProps.uri)
  }

  checkAvailability(uri) {
    if (!this._uri || uri !== this._uri) {
      this._uri = uri;
      this.props.checkAvailability(uri)
    }
  }

  onShowFileActionsRowClicked() {
    this.setState({
      forceShowActions: true,
    });
  }

  handleDeleteCheckboxClicked(event) {
    this.setState({
      deleteChecked: event.target.checked,
    })
  }

  onAffirmPurchase() {
    this.props.closeModal()
    this.props.loadVideo(this.props.uri)
  }

  render() {
    const {
      fileInfo,
      isAvailable,
      platform,
      downloading,
      uri,
      deleteFile,
      openInFolder,
      openInShell,
      modal,
      openModal,
      closeModal,
      startDownload,
      costInfo,
    } = this.props

    const deleteChecked = this.state.deleteChecked,
          metadata = fileInfo ? fileInfo.metadata : null,
          openInFolderMessage = platform.startsWith('Mac') ? 'Open in Finder' : 'Open in Folder',
          showMenu = fileInfo && Object.keys(fileInfo).length > 0,
          title = metadata ? metadata.title : uri;

    let content

    if (downloading) {

      const
        progress = (fileInfo && fileInfo.written_bytes) ? fileInfo.written_bytes / fileInfo.total_bytes * 100 : 0,
        label = fileInfo ? progress.toFixed(0) + '% complete' : 'Connecting...',
        labelWithIcon = <span className="button__content"><Icon icon="icon-download" /><span>{label}</span></span>;

      content = <div className="faux-button-block file-actions__download-status-bar button-set-item">
        <div className="faux-button-block file-actions__download-status-bar-overlay" style={{ width: progress + '%' }}>{labelWithIcon}</div>
        {labelWithIcon}
      </div>

    } else if (!fileInfo && isAvailable === undefined) {

      content = <BusyMessage message="Checking availability" />

    } else if (!fileInfo && !isAvailable && !this.state.forceShowActions) {

      content = <div>
        <div className="button-set-item empty">Content unavailable.</div>
        <ToolTip label="Why?"
                 body="The content on LBRY is hosted by its users. It appears there are no users connected that have this file at the moment."
                 className="button-set-item" />
        <Link label="Try Anyway" onClick={this.onShowFileActionsRowClicked.bind(this)} className="button-text button-set-item" />
      </div>

    } else if (fileInfo === null && !downloading) {
      if (!costInfo) {
        content = <BusyMessage message="Fetching cost info" />
      } else {
        content = <Link button="text" label="Download" icon="icon-download" onClick={() => { startDownload(uri) } } />;
      }

    } else if (fileInfo && fileInfo.download_path) {
      content  = <Link label="Open" button="text" icon="icon-folder-open" onClick={() => openInShell(fileInfo)} />;
    } else {
      console.log('handle this case of file action props?');
    }

    return (
      <section className="file-actions">
        { content }
        { showMenu ?
          <DropDownMenu>
            <DropDownMenuItem key={0} onClick={() => openInFolder(fileInfo)} label={openInFolderMessage} />
            <DropDownMenuItem key={1} onClick={() => openModal('confirmRemove')} label="Remove..." />
          </DropDownMenu> : '' }
        <Modal type="confirm" isOpen={modal == 'affirmPurchase'}
               contentLabel="Confirm Purchase" onConfirmed={this.onAffirmPurchase.bind(this)} onAborted={closeModal}>
          This will purchase <strong>{title}</strong> for <strong><FilePrice uri={uri} look="plain" /></strong> credits.
        </Modal>
        <Modal isOpen={modal == 'notEnoughCredits'} contentLabel="Not enough credits"
               onConfirmed={closeModal}>
          You don't have enough LBRY credits to pay for this stream.
        </Modal>
        <Modal isOpen={modal == 'timedOut'} contentLabel="Download failed"
               onConfirmed={closeModal}>
          LBRY was unable to download the stream <strong>{uri}</strong>.
        </Modal>
        <Modal isOpen={modal == 'confirmRemove'}
               contentLabel="Not enough credits"
               type="confirm"
               confirmButtonLabel="Remove"
               onConfirmed={() => deleteFile(fileInfo.outpoint, deleteChecked)}
               onAborted={closeModal}>
          <p>Are you sure you'd like to remove <cite>{title}</cite> from LBRY?</p>

          <label><FormField type="checkbox" checked={deleteChecked} onClick={this.handleDeleteCheckboxClicked.bind(this)} /> Delete this file from my computer</label>
        </Modal>
      </section>
    );
  }
}

export default FileActions
