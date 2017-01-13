import React from 'react';
import lbry from '../lbry.js';
import {Link} from '../component/link.js';
import FormField from '../component/form.js';
import FileTile from '../component/file-tile.js';
import Modal from '../component/modal.js';
import {BusyMessage, Thumbnail} from '../component/common.js';

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
      filesAvailable: null,
      sortBy: 'date',
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
  handleSortChanged: function(event) {
    this.setState({
      sortBy: event.target.value,
    });
  },
  updateFilesInfo: function() {
    this._fileInfoCheckNum += 1;

    if (this.props.show == 'published') {
      // We're in the Published tab, so populate this.state.filesInfo with data from the user's claims
      lbry.getMyClaims((claimsInfo) => {
        /**
         * Build newFilesInfo as a sparse array and drop elements in at the same position they
         * occur in claimsInfo, so the order is preserved even if the API calls inside this loop
         * return out of order.
         */

        let newFilesInfo = Array(claimsInfo.length);
        let claimInfoProcessedCount = 0;
        for (let [i, claimInfo] of claimsInfo.entries()) {
          let metadata = JSON.parse(claimInfo.value);
          lbry.getFileInfoBySdHash(metadata.sources.lbry_sd_hash, (fileInfo) => {
            claimInfoProcessedCount++;
            if (fileInfo !== false) {
              newFilesInfo[i] = fileInfo;
            }
            if (claimInfoProcessedCount >= claimsInfo.length) {
              /**
               * newFilesInfo may have gaps from claims that don't have associated files in
               * lbrynet, so filter out any missing elements
               */
              this.setState({
                filesInfo: newFilesInfo.filter(function() { return true }),
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

      const filesInfoSorted = this._sortFunctions[this.state.sortBy](this.state.filesInfo);
      for (let fileInfo of filesInfoSorted) {
        let {completed, lbry_uri, sd_hash, metadata, download_path, stopped, pending} = fileInfo;

        if (!metadata || seenUris[lbry_uri]) {
          continue;
        }

        seenUris[lbry_uri] = true;

        content.push(<FileTile name={lbry_uri} sdHash={sd_hash} isMine={this.props.show == 'published'} showPrice={false} hideOnRemove={true}
                               metadata={metadata} completed={completed} stopped={stopped} pending={pending} path={download_path}
                               {... this.state.filesAvailable !== null ? {available: this.state.filesAvailable[sd_hash]} : {}} />);
      }
    }
    return (
      <main className="page">
        <span className='sort-section'>
          Sort by { ' ' }
          <FormField type="select" onChange={this.handleSortChanged}>
            <option value="date">Date</option>
            <option value="title">Title</option>
            <option value="filename">File name</option>
          </FormField>
        </span>
        {content}
      </main>
    );
  }
});

export default MyFilesPage;