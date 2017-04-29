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
               contentLabel="Confirm Purchase" onConfirmed={affirmPurchase} onAborted={closeModal}>
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

// const FileActionsRow = React.createClass({
//   _isMounted: false,
//   _fileInfoSubscribeId: null,

//   propTypes: {
//     uri: React.PropTypes.string,
//     outpoint: React.PropTypes.string.isRequired,
//     metadata: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.string]),
//     contentType: React.PropTypes.string.isRequired,
//   },
//   getInitialState: function() {
//     return {
//       fileInfo: null,
//       modal: null,
//       menuOpen: false,
//       deleteChecked: false,
//       attemptingDownload: false,
//       attemptingRemove: false,
//     }
//   },
//   onFileInfoUpdate: function(fileInfo) {
//     if (this._isMounted) {
//       this.setState({
//         fileInfo: fileInfo ? fileInfo : false,
//         attemptingDownload: fileInfo ? false : this.state.attemptingDownload
//       });
//     }
//   },
//   tryDownload: function() {
//     this.setState({
//       attemptingDownload: true,
//       attemptingRemove: false
//     });
//     lbry.getCostInfo(this.props.uri).then(({cost}) => {
//       lbry.getBalance((balance) => {
//         if (cost > balance) {
//           this.setState({
//             modal: 'notEnoughCredits',
//             attemptingDownload: false,
//           });
//         } else if (this.state.affirmedPurchase) {
//           lbry.get({uri: this.props.uri}).then((streamInfo) => {
//             if (streamInfo === null || typeof streamInfo !== 'object') {
//               this.setState({
//                 modal: 'timedOut',
//                 attemptingDownload: false,
//               });
//             }
//           });
//         } else {
//           this.setState({
//             attemptingDownload: false,
//             modal: 'affirmPurchase'
//           })
//         }
//       });
//     });
//   },
//   closeModal: function() {
//     this.setState({
//       modal: null,
//     })
//   },
//   onDownloadClick: function() {
//     if (!this.state.fileInfo && !this.state.attemptingDownload) {
//       this.tryDownload();
//     }
//   },
//   onOpenClick: function() {
//     if (this.state.fileInfo && this.state.fileInfo.download_path) {
//       shell.openItem(this.state.fileInfo.download_path);
//     }
//   },
//   handleDeleteCheckboxClicked: function(event) {
//     this.setState({
//       deleteChecked: event.target.checked,
//     });
//   },
//   handleRevealClicked: function() {
//     if (this.state.fileInfo && this.state.fileInfo.download_path) {
//       shell.showItemInFolder(this.state.fileInfo.download_path);
//     }
//   },
//   handleRemoveClicked: function() {
//     this.setState({
//       modal: 'confirmRemove',
//     });
//   },
//   handleRemoveConfirmed: function() {
//     lbry.removeFile(this.props.outpoint, this.state.deleteChecked);
//     this.setState({
//       modal: null,
//       fileInfo: false,
//       attemptingDownload: false
//     });
//   },
//   onAffirmPurchase: function() {
//     this.setState({
//       affirmedPurchase: true,
//       modal: null
//     });
//     this.tryDownload();
//   },
//   openMenu: function() {
//     this.setState({
//       menuOpen: !this.state.menuOpen,
//     });
//   },
//   componentDidMount: function() {
//     this._isMounted = true;
//     this._fileInfoSubscribeId = lbry.fileInfoSubscribe(this.props.outpoint, this.onFileInfoUpdate);
//   },
//   componentWillUnmount: function() {
//     this._isMounted = false;
//     if (this._fileInfoSubscribeId) {
//       lbry.fileInfoUnsubscribe(this.props.outpoint, this._fileInfoSubscribeId);
//     }
//   },
//   render: function() {
//     if (this.state.fileInfo === null)
//     {
//       return null;
//     }

//     const openInFolderMessage = window.navigator.platform.startsWith('Mac') ? 'Open in Finder' : 'Open in Folder',
//       showMenu = !!this.state.fileInfo;

//     let linkBlock;
//     if (this.state.fileInfo === false && !this.state.attemptingDownload) {
//       linkBlock = <Link button="text" label="Download" icon="icon-download" onClick={this.onDownloadClick} />;
//     } else if (this.state.attemptingDownload || (!this.state.fileInfo.completed && !this.state.fileInfo.isMine)) {
//       const
//         progress = this.state.fileInfo ? this.state.fileInfo.written_bytes / this.state.fileInfo.total_bytes * 100 : 0,
//         label = this.state.fileInfo ? progress.toFixed(0) + '% complete' : 'Connecting...',
//         labelWithIcon = <span className="button__content"><Icon icon="icon-download" /><span>{label}</span></span>;

//       linkBlock = (
//         <div className="faux-button-block file-actions__download-status-bar button-set-item">
//           <div className="faux-button-block file-actions__download-status-bar-overlay" style={{ width: progress + '%' }}>{labelWithIcon}</div>
//           {labelWithIcon}
//         </div>
//       );
//     } else {
//       linkBlock = <Link label="Open" button="text" icon="icon-folder-open" onClick={this.onOpenClick} />;
//     }

//     const uri = lbryuri.normalize(this.props.uri);
//     const title = this.props.metadata ? this.props.metadata.title : uri;
//     return (
//       <div>
//         {this.state.fileInfo !== null || this.state.fileInfo.isMine
//           ? linkBlock
//           : null}
//         { showMenu ?
//           <DropDownMenu>
//             <DropDownMenuItem key={0} onClick={this.handleRevealClicked} label={openInFolderMessage} />
//             <DropDownMenuItem key={1} onClick={this.handleRemoveClicked} label="Remove..." />
//           </DropDownMenu> : '' }
//         <Modal type="confirm" isOpen={this.state.modal == 'affirmPurchase'}
//                contentLabel="Confirm Purchase"  onConfirmed={this.onAffirmPurchase} onAborted={this.closeModal}>
//           Are you sure you'd like to buy <strong>{title}</strong> for <strong><FilePrice uri={uri} look="plain" /></strong> credits?
//         </Modal>
//         <Modal isOpen={this.state.modal == 'notEnoughCredits'} contentLabel="Not enough credits"
//                onConfirmed={this.closeModal}>
//           You don't have enough LBRY credits to pay for this stream.
//         </Modal>
//         <Modal isOpen={this.state.modal == 'timedOut'} contentLabel="Download failed"
//                onConfirmed={this.closeModal}>
//           LBRY was unable to download the stream <strong>{uri}</strong>.
//         </Modal>
//         <Modal isOpen={this.state.modal == 'confirmRemove'} contentLabel="Not enough credits"
//                type="confirm" confirmButtonLabel="Remove" onConfirmed={this.handleRemoveConfirmed}
//                onAborted={this.closeModal}>
//           <p>Are you sure you'd like to remove <cite>{title}</cite> from LBRY?</p>

//           <label><FormField type="checkbox" checked={this.state.deleteChecked} onClick={this.handleDeleteCheckboxClicked} /> Delete this file from my computer</label>
//         </Modal>
//       </div>
//     );
//   }
// });

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
