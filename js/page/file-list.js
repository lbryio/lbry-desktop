import React from 'react';
import lbry from '../lbry.js';
import {Link} from '../component/link.js';
import FormField from '../component/form.js';
import {FileTileStream} from '../component/file-tile.js';
import {BusyMessage, Thumbnail} from '../component/common.js';


export let FileListDownloaded = React.createClass({
  _isMounted: false,

  getInitialState: function() {
    return {
      fileInfos: null,
    };
  },
  componentDidMount: function() {
    this._isMounted = true;
    document.title = "Downloaded Files";

    let publishedFilesSdHashes = [];
    lbry.getMyClaims((claimsInfo) => {

      if (!this._isMounted) { return; }

      for (let claimInfo of claimsInfo) {
        let metadata = JSON.parse(claimInfo.value);
        publishedFilesSdHashes.push(metadata.sources.lbry_sd_hash);
      }

      lbry.getFilesInfo((fileInfos) => {
        if (!this._isMounted) { return; }

        this.setState({
          fileInfos: fileInfos.filter(({sd_hash}) => {
            return publishedFilesSdHashes.indexOf(sd_hash) == -1;
          })
        });
      });
    });
  },
  render: function() {
    if (this.state.fileInfos === null) {
      return (
        <main className="page">
          <BusyMessage message="Loading" />
        </main>
      );
    } else if (!this.state.fileInfos.length) {
      return (
        <main className="page">
          <span>You haven't downloaded anything from LBRY yet. Go <Link href="/" label="search for your first download" />!</span>
        </main>
      );
    } else {
      return (
        <main className="page">
          <FileList fileInfos={this.state.fileInfos} />
        </main>
      );
    }
  }
});

export let FileListPublished = React.createClass({
  _isMounted: false,

  getInitialState: function () {
    return {
      fileInfos: null,
    };
  },
  componentDidMount: function () {
    this._isMounted = true;
    document.title = "Published Files";

    lbry.getMyClaims((claimsInfo) => {
      /**
       * Build newFileInfos as a sparse array and drop elements in at the same position they
       * occur in claimsInfo, so the order is preserved even if the API calls inside this loop
       * return out of order.
       */
      let newFileInfos = Array(claimsInfo.length),
        claimInfoProcessedCount = 0;

      for (let [i, claimInfo] of claimsInfo.entries()) {
        let metadata = JSON.parse(claimInfo.value);
        lbry.getFileInfoBySdHash(metadata.sources.lbry_sd_hash, (fileInfo) => {
          claimInfoProcessedCount++;
          if (fileInfo !== false) {
            newFileInfos[i] = fileInfo;
          }
          if (claimInfoProcessedCount >= claimsInfo.length) {
            /**
             * newfileInfos may have gaps from claims that don't have associated files in
             * lbrynet, so filter out any missing elements
             */
            this.setState({
              fileInfos: newFileInfos.filter(function () {
                return true
              }),
            });
          }
        });
      }
    });
  },
  render: function () {
    if (this.state.fileInfos === null) {
      return (
        <main className="page">
          <BusyMessage message="Loading" />
        </main>
      );
    }
    else if (!this.state.fileInfos.length) {
      return (
        <main className="page">
          <span>You haven't published anything to LBRY yet.</span> Try <Link href="/?publish" label="publishing" />!
        </main>
      );
    }
    else {
      return (
        <main className="page">
          <FileList fileInfos={this.state.fileInfos} />
        </main>
      );
    }
  }
});

export let FileList = React.createClass({
  _sortFunctions: {
    date: function(fileInfos) {
      return fileInfos.reverse();
    },
    title: function(fileInfos) {
      return fileInfos.sort(function(a, b) {
        return ((a.metadata ? a.metadata.title.toLowerCase() : a.name) >
                (b.metadata ? b.metadata.title.toLowerCase() : b.name));
      });
    },
    filename: function(fileInfos) {
      return fileInfos.sort(function(a, b) {
        return (a.file_name.toLowerCase() >
                b.file_name.toLowerCase());
      });
    },
  },
  propTypes: {
    fileInfos: React.PropTypes.array.isRequired
  },
  getInitialState: function() {
    return {
      sortBy: 'date',
    };
  },
  handleSortChanged: function(event) {
    this.setState({
      sortBy: event.target.value,
    });
  },
  render: function() {
    var content = [],
        seenUris = {};

    const fileInfosSorted = this._sortFunctions[this.state.sortBy](this.props.fileInfos);
    for (let fileInfo of fileInfosSorted) {
      let {lbry_uri, sd_hash, metadata} = fileInfo;

      if (!metadata || seenUris[lbry_uri]) {
        continue;
      }

      seenUris[lbry_uri] = true;
      content.push(<FileTileStream key={lbry_uri} name={lbry_uri} hideOnRemove={true} sdHash={sd_hash} hidePrice={true} metadata={metadata} />);
    }

    return (
      <section>
        <span className='sort-section'>
          Sort by { ' ' }
          <FormField type="select" onChange={this.handleSortChanged}>
            <option value="date">Date</option>
            <option value="title">Title</option>
            <option value="filename">File name</option>
          </FormField>
        </span>
        {content}
      </section>
    );
  }
});