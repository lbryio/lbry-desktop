import React from 'react';
import lbry from 'lbry.js';
import lbryuri from 'lbryuri.js';
import Link from 'component/link';
import {FormField} from 'component/form.js';
import {FileTileStream} from 'component/fileTile';
import rewards from 'rewards.js';
import lbryio from 'lbryio.js';
import {BusyMessage, Thumbnail} from 'component/common.js';
import FileList from 'component/fileList'

class FileListDownloaded extends React.Component {
  render() {
    const {
      downloadedContent,
      fetching,
      navigate,
    } = this.props

    if (fetching) {
      return (
        <main className="page">
          <BusyMessage message="Loading" />
        </main>
      );
    } else if (!downloadedContent.length) {
      return (
        <main className="page">
          <span>You haven't downloaded anything from LBRY yet. Go <Link href="#" onClick={() => navigate('discover')} label="search for your first download" />!</span>
        </main>
      );
    } else {
      return (
        <main className="page">
          <FileList fileInfos={downloadedContent} hidePrices={true} />
        </main>
      );
    }
  }
}

export default FileListDownloaded
