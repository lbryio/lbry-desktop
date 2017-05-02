import React from 'react';
import lbry from 'lbry';
import lbryuri from 'lbryuri';
import {Icon,} from 'component/common';
import FilePrice from 'component/filePrice'
import {Modal} from 'component/modal';
import {FormField} from 'component/form';
import Link from 'component/link';
import {ToolTip} from 'component/tooltip';
import {DropDownMenu, DropDownMenuItem} from 'component/menu';

class FileActionsRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deleteChecked: false,
    }
  }

  handleDeleteCheckboxClicked(event) {
    this.setState({
      deleteChecked: event.target.checked,
    })
  }

  onAffirmPurchase() {
    this.props.closeModal()
    this.props.loadVideo()
  }

  render() {
    const {
      fileInfo,
      platform,
      downloading,
      loading,
      uri,
      deleteFile,
      openInFolder,
      openInShell,
      modal,
      openModal,
      affirmPurchase,
      closeModal,
      downloadClick,
    } = this.props

    const {
      deleteChecked,
    } = this.state

    const metadata = fileInfo ? fileInfo.metadata : null

    if (!fileInfo)
    {
      return null;
    }

    const openInFolderMessage = platform.startsWith('Mac') ? 'Open in Finder' : 'Open in Folder',
      showMenu = Object.keys(fileInfo).length != 0;

    let linkBlock;
    if (Object.keys(fileInfo).length == 0 && !downloading && !loading) {
      linkBlock = <Link button="text" label="Download" icon="icon-download" onClick={downloadClick} />;
    } else if (downloading || loading) {
      const
        progress = (fileInfo && fileInfo.written_bytes) ? fileInfo.written_bytes / fileInfo.total_bytes * 100 : 0,
        label = fileInfo ? progress.toFixed(0) + '% complete' : 'Connecting...',
        labelWithIcon = <span className="button__content"><Icon icon="icon-download" /><span>{label}</span></span>;

      linkBlock = (
        <div className="faux-button-block file-actions__download-status-bar button-set-item">
          <div className="faux-button-block file-actions__download-status-bar-overlay" style={{ width: progress + '%' }}>{labelWithIcon}</div>
          {labelWithIcon}
        </div>
      );
    } else {
      linkBlock = <Link label="Open" button="text" icon="icon-folder-open" onClick={() => openInShell(fileInfo)} />;
    }

    const title = metadata ? metadata.title : uri;
    return (
      <div>
        {fileInfo !== null || fileInfo.isMine
          ? linkBlock
          : null}
        { showMenu ?
          <DropDownMenu>
            <DropDownMenuItem key={0} onClick={() => openInFolder(fileInfo)} label={openInFolderMessage} />
            <DropDownMenuItem key={1} onClick={() => openModal('confirmRemove')} label="Remove..." />
          </DropDownMenu> : '' }
        <Modal type="confirm" isOpen={modal == 'affirmPurchase'}
               contentLabel="Confirm Purchase" onConfirmed={this.onAffirmPurchase.bind(this)} onAborted={closeModal}>
          Are you sure you'd like to buy <strong>{title}</strong> for <strong><FilePrice uri={uri} look="plain" /></strong> credits?
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
          onConfirmed={() => deleteFile(uri, fileInfo, deleteChecked)}
          onAborted={closeModal}>
          <p>Are you sure you'd like to remove <cite>{title}</cite> from LBRY?</p>

          <label><FormField type="checkbox" checked={deleteChecked} onClick={this.handleDeleteCheckboxClicked.bind(this)} /> Delete this file from my computer</label>
        </Modal>
      </div>
    );
  }
}

class FileActions extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this._fileInfoSubscribeId = null
    this.state = {
      available: true,
      forceShowActions: false,
      fileInfo: null,
    }
  }

  onShowFileActionsRowClicked() {
    this.setState({
      forceShowActions: true,
    });
  }

  render() {
    const {
      fileInfo,
      availability,
    } = this.props

    if (fileInfo === null) {
      return null;
    }

    return (<section className="file-actions">
      {
        fileInfo || this.state.available || this.state.forceShowActions
          ? <FileActionsRow {...this.props} />
          : <div>
              <div className="button-set-item empty">Content unavailable.</div>
              <ToolTip label="Why?"
                       body="The content on LBRY is hosted by its users. It appears there are no users connected that have this file at the moment."
                       className="button-set-item" />
              <Link label="Try Anyway" onClick={this.onShowFileActionsRowClicked.bind(this)} className="button-text button-set-item" />
            </div>
      }
    </section>);
  }
}

export default FileActions
