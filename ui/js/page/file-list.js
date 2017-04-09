import React from 'react';
import lbry from '../lbry.js';
import Link from 'component/link';
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

    lbry.claim_list_mine().then((myClaimInfos) => {
      if (!this._isMounted) { return; }

      lbry.file_list().then((fileInfos) => {
        if (!this._isMounted) { return; }

        const myClaimOutpoints = myClaimInfos.map(({txid, nout}) => txid + ':' + nout);
        this.setState({
          fileInfos: fileInfos.filter(({outpoint}) => !myClaimOutpoints.includes(outpoint)),
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
          <span>You haven't downloaded anything from LBRY yet. Go <Link href="?discover" label="search for your first download" />!</span>
        </main>
      );
    } else {
      return (
        <main className="page">
          <FileList fileInfos={this.state.fileInfos} hidePrices={true} />
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

    lbry.claim_list_mine().then((claimInfos) => {
      if (!this._isMounted) { return; }

      lbry.file_list().then((fileInfos) => {
        if (!this._isMounted) { return; }

        const myClaimOutpoints = claimInfos.map(({txid, nout}) => txid + ':' + nout);
        this.setState({
          fileInfos: fileInfos.filter(({outpoint}) => myClaimOutpoints.includes(outpoint)),
        });
      });
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
          <span>You haven't published anything to LBRY yet.</span> Try <Link href="?publish" label="publishing" />!
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
      return fileInfos.slice().reverse();
    },
    title: function(fileInfos) {
      return fileInfos.slice().sort(function(fileInfo1, fileInfo2) {
        const title1 = fileInfo1.metadata ? fileInfo1.metadata.title.toLowerCase() : fileInfo1.name;
        const title2 = fileInfo2.metadata ? fileInfo2.metadata.title.toLowerCase() : fileInfo2.name;
        if (title1 < title2) {
          return -1;
        } else if (title1 > title2) {
          return 1;
        } else {
          return 0;
        }
      });
    },
    filename: function(fileInfos) {
      return fileInfos.slice().sort(function({file_name: fileName1}, {file_name: fileName2}) {
        const fileName1Lower = fileName1.toLowerCase();
        const fileName2Lower = fileName2.toLowerCase();
        if (fileName1Lower < fileName2Lower) {
          return -1;
        } else if (fileName2Lower > fileName1Lower) {
          return 1;
        } else {
          return 0;
        }
      });
    },
  },
  propTypes: {
    fileInfos: React.PropTypes.array.isRequired,
    hidePrices: React.PropTypes.bool,
  },
  getDefaultProps: function() {
    return {
      hidePrices: false,
    };
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
    for (let {name, outpoint, metadata} of fileInfosSorted) {
      if (!metadata || seenUris[name]) {
        continue;
      }

      seenUris[name] = true;
      content.push(<FileTileStream key={outpoint} outpoint={outpoint} name={name} hideOnRemove={true}
                                   hidePrice={this.props.hidePrices} metadata={metadata} />);
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