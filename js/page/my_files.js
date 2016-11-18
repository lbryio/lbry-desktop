import React from 'react';
import lbry from '../lbry.js';
import {Link, WatchLink} from '../component/link.js';
import {Menu, MenuItem} from '../component/menu.js';
import Modal from '../component/modal.js';
import {BusyMessage, Thumbnail} from '../component/common.js';

var moreMenuStyle = {
  position: 'absolute',
  display: 'block',
  top: '26px',
  right: '13px',
};
var MyFilesRowMoreMenu = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    path: React.PropTypes.string.isRequired,
    completed: React.PropTypes.bool.isRequired,
    lbryUri: React.PropTypes.string.isRequired,
  },
  handleRevealClicked: function() {
    lbry.revealFile(this.props.path);
  },
  handleRemoveClicked: function() {
    lbry.deleteFile(this.props.lbryUri, false);
  },
  handleDeleteClicked: function() {
    this.setState({
      modal: 'confirmDelete',
    });
  },
  handleDeleteConfirmed: function() {
    lbry.deleteFile(this.props.lbryUri);
    this.setState({
      modal: null,
    });
  },
  closeModal: function() {
    this.setState({
      modal: null,
    });
  },
  getInitialState: function() {
    return {
      modal: null,
    };
  },
  render: function() {
    return (
      <div style={moreMenuStyle}>
        <Menu {...this.props}>
          <section className="card">
            <MenuItem onClick={this.handleRevealClicked} label="Reveal file" /> {/* @TODO: Switch to OS specific wording */}
            <MenuItem onClick={this.handleRemoveClicked} label="Remove from LBRY" />
            <MenuItem onClick={this.handleDeleteClicked} label="Remove and delete file" />
          </section>
        </Menu>
        <Modal isOpen={this.state.modal == 'confirmDelete'} type="confirm" confirmButtonLabel="Delete File"
               onConfirmed={this.handleDeleteConfirmed} onAborted={this.closeModal}>
          Are you sure you'd like to delete <cite>{this.props.title}</cite>? This will {this.props.completed ? ' stop the download and ' : ''}
          permanently remove the file from your system.
        </Modal>
      </div>
    );
  }
});

var moreButtonColumnStyle = {
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButtonContainerStyle = {
    display: 'block',
    position: 'relative',
  },
  moreButtonStyle = {
    fontSize: '1.3em',
  },
  progressBarStyle = {
    height: '15px',
    width: '230px',
    backgroundColor: '#444',
    border: '2px solid #eee',
    display: 'inline-block',
  }, 
  artStyle = {
    maxHeight: '100px',
    maxWidth: '100%',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  };
var MyFilesRow = React.createClass({
  onPauseResumeClicked: function() {
    if (this.props.stopped) {
      lbry.startFile(this.props.lbryUri);
    } else {
      lbry.stopFile(this.props.lbryUri);
    }
  },
  render: function() {
    //@TODO: Convert progress bar to reusable component

    var progressBarWidth = 230;

    if (this.props.completed) {
      var pauseLink = null;
      var curProgressBarStyle = {display: 'none'};
    } else {
      var pauseLink = <Link icon={this.props.stopped ? 'icon-play' : 'icon-pause'}
                            label={this.props.stopped ? 'Resume download' : 'Pause download'}
                            onClick={() => { this.onPauseResumeClicked() }} />;

      var curProgressBarStyle = Object.assign({}, progressBarStyle);
      curProgressBarStyle.width = Math.floor(this.props.ratioLoaded * progressBarWidth) + 'px';
      curProgressBarStyle.borderRightWidth = progressBarWidth - Math.ceil(this.props.ratioLoaded * progressBarWidth) + 2;
    }

    if (this.props.showWatchButton) {
      var watchButton = <WatchLink streamName={this.props.lbryUri} />
    } else {
      var watchButton = null;
    }

    return (
      <section className="card">
        <div className="row-fluid">
          <div className="span3">
            <Thumbnail src={this.props.imgUrl} alt={'Photo for ' + this.props.title} style={artStyle} />
          </div>
          <div className="span8">
            <h3>{this.props.pending ? this.props.title : <a href={'/?show=' + this.props.lbryUri}>{this.props.title}</a>}</h3>
            {this.props.pending ? <em>This file is pending confirmation</em>
              : (
               <div>
                 <div className={this.props.completed ? 'hidden' : ''} style={curProgressBarStyle}></div>
                 { ' ' }
                 {this.props.completed
                   ? (this.props.isMine
                      ? 'Published'
                      : 'Download complete')
                   : (parseInt(this.props.ratioLoaded * 100) + '%')}
                 <div>{ pauseLink }</div>
                 <div>{ watchButton }</div>
               </div>
             )
            }
          </div>
          <div className="span1" style={moreButtonColumnStyle}>
            {this.props.pending ? null :
             <div style={moreButtonContainerStyle}>
               <Link style={moreButtonStyle} ref="moreButton" icon="icon-ellipsis-h" title="More Options" />
               <MyFilesRowMoreMenu toggleButton={this.refs.moreButton} title={this.props.title}
                                   completed={this.props.completed} lbryUri={this.props.lbryUri}
                                   fileName={this.props.fileName} path={this.props.path}/>
             </div>
            }
          </div>
        </div>
      </section>
    );
  }
});

var MyFilesPage = React.createClass({
  _fileTimeout: null,
  _fileInfoCheckRate: 300,
  _fileInfoCheckNum: 0,
  _sortFunctions: {
    date: function(filesInfo) {
      return filesInfo.reverse();
    },
    title: function(filesInfo) {
      return filesInfo.sort(function(a, b) {
        return ((a.metadata ? a.metadata.title.toLowerCase() : a.name) >
                (b.metadata ? b.metadata.title.toLowerCase() : b.name));
      });
    },
    filename: function(filesInfo) {
      return filesInfo.sort(function(a, b) {
        return (a.file_name.toLowerCase() >
                b.file_name.toLowerCase());
      });
    },
  },

  getInitialState: function() {
    return {
      filesInfo: null,
      publishedFilesSdHashes: null,
      filesAvailable: {},
    };
  },
  getDefaultProps: function() {
    return {
      show: null,
    };
  },
  componentDidMount: function() {
    document.title = "My Files";
  },
  componentWillMount: function() {
    if (this.props.show == 'downloaded') {
      this.getPublishedFilesSdHashes(() => {
        this.updateFilesInfo();
      });
    } else {
      this.updateFilesInfo();
    }
  },
  getPublishedFilesSdHashes: function(callback) {
    // Determines which files were published by the user and saves their SD hashes in
    // this.state.publishedFilesSdHashes. Used on the Downloads page to filter out claims published
    // by the user.
    var publishedFilesSdHashes = [];
    lbry.getMyClaims((claimsInfo) => {
      for (let claimInfo of claimsInfo) {
        let metadata = JSON.parse(claimInfo.value);
        publishedFilesSdHashes.push(metadata.sources.lbry_sd_hash);
      }

      this.setState({
        publishedFilesSdHashes: publishedFilesSdHashes,
      });
      callback();
    });
  },
  componentWillUnmount: function() {
    if (this._fileTimeout)
    {
      clearTimeout(this._fileTimeout);
    }
  },
  updateFilesInfo: function() {
    this._fileInfoCheckNum += 1;

    if (this.props.show == 'published') {
      // We're in the Published tab, so populate this.state.filesInfo with data from the user's claims
      lbry.getMyClaims((claimsInfo) => {
        let newFilesInfo = [];
        let claimInfoProcessedCount = 0;
        for (let claimInfo of claimsInfo) {
          let metadata = JSON.parse(claimInfo.value);
          lbry.getFileInfoBySdHash(metadata.sources.lbry_sd_hash, (fileInfo) => {
            claimInfoProcessedCount++;
            if (fileInfo !== false) {
              newFilesInfo.push(fileInfo);
            }
            if (claimInfoProcessedCount >= claimsInfo.length) {
              this.setState({
                filesInfo: newFilesInfo
              });

              this._fileTimeout = setTimeout(() => { this.updateFilesInfo() }, 1000);
            }
          });
        }
      });
    } else {
      // We're in the Downloaded tab, so populate this.state.filesInfo with files the user has in
      // lbrynet, with published files filtered out.
      lbry.getFilesInfo((filesInfo) => {
        this.setState({
          filesInfo: filesInfo.filter(({sd_hash}) => {
            return this.state.publishedFilesSdHashes.indexOf(sd_hash) == -1;
          }),
        });

        let newFilesAvailable;
        if (!(this._fileInfoCheckNum % this._fileInfoCheckRate)) {
          // Time to update file availability status

          newFilesAvailable = {};
          let filePeersCheckCount = 0;
          for (let {sd_hash} of filesInfo) {
            lbry.getPeersForBlobHash(sd_hash, (peers) => {
              filePeersCheckCount++;
              newFilesAvailable[sd_hash] = peers.length >= 0;
              if (filePeersCheckCount >= filesInfo.length) {
                this.setState({
                  filesAvailable: newFilesAvailable,
                });
              }
            });
          }
        }

        this._fileTimeout = setTimeout(() => { this.updateFilesInfo() }, 1000);
      })
    }
  },
  render: function() {
    if (this.state.filesInfo === null || (this.props.show == 'downloaded' && this.state.publishedFileSdHashes === null)) {
      return (
        <main className="page">
          <BusyMessage message="Loading" />
        </main>
      );
    } else if (!this.state.filesInfo.length) {
      return (
        <main className="page">
          {this.props.show == 'downloaded'
            ? <span>You haven't downloaded anything from LBRY yet. Go <Link href="/" label="search for your first download" />!</span>
            : <span>You haven't published anything to LBRY yet.</span>}
        </main>
      );
    } else {
      var content = [],
          seenUris = {};

      for (let fileInfo of this.state.filesInfo) {
        let {completed, written_bytes, total_bytes, lbry_uri, file_name, download_path,
          stopped, metadata, sd_hash} = fileInfo;

        if (!metadata || seenUris[lbry_uri]) {
          continue;
        }

        seenUris[lbry_uri] = true;

        let {title, thumbnail} = metadata;

        if (!fileInfo.pending && typeof metadata == 'object') {
          var {title, thumbnail} = metadata;
          var pending = false;
        } else {
          var title = null;
          var thumbnail = null;
          var pending = true;
        }

        var ratioLoaded = written_bytes / total_bytes;

        var mediaType = lbry.getMediaType(metadata.content_type, file_name);
        var showWatchButton = (mediaType == 'video');

        content.push(<MyFilesRow key={lbry_uri} lbryUri={lbry_uri} title={title || ('lbry://' + lbry_uri)} completed={completed} stopped={stopped}
                                 ratioLoaded={ratioLoaded} imgUrl={thumbnail} path={download_path}
                                 showWatchButton={showWatchButton} pending={pending}
                                 available={this.state.filesAvailable[sd_hash]} isMine={this.props.show == 'published'} />);
      }
    }
    return (
      <main className="page">
        {content}
      </main>
    );
  }
});


export default MyFilesPage;
