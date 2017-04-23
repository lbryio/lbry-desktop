import React from 'react';
import lbry from 'lbry.js';
import lbryuri from 'lbryuri.js';
import Link from 'component/link';
import {FormField} from 'component/form.js';
import FileTileStream from 'component/fileTile';
import rewards from 'rewards.js';
import lbryio from 'lbryio.js';
import {BusyMessage, Thumbnail} from 'component/common.js';

const FileList = React.createClass({
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
    for (let {outpoint, name, channel_name, metadata, mime_type, claim_id, has_signature, signature_is_valid} of fileInfosSorted) {
      if (seenUris[name] || !claim_id) {
        continue;
      }

      let streamMetadata;
      if (metadata) {
        streamMetadata = metadata.stream.metadata;
      } else {
        streamMetadata = null;
      }


      const uri = lbryuri.build({contentName: name, channelName: channel_name});
      seenUris[name] = true;
      content.push(<FileTileStream key={outpoint} outpoint={outpoint} uri={uri} hideOnRemove={true}
                                   hidePrice={this.props.hidePrices} metadata={streamMetadata} contentType={mime_type}
                                   hasSignature={has_signature} signatureIsValid={signature_is_valid} />);
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

export default FileList
