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
import SubHeader from 'component/subHeader'

class FileListDownloaded extends React.Component {
  render() {
    const {
      downloadedContent,
      fetching,
      navigate,
    } = this.props

    let content
    if (fetching) {
      content = <BusyMessage message="Loading" />
    } else if (!downloadedContent.length) {
      content = <span>You haven't downloaded anything from LBRY yet. Go <Link href="#" onClick={() => navigate('discover')} label="search for your first download" />!</span>
    } else {
      content = <FileList fileInfos={downloadedContent} hidePrices={true} />
    }

    return (
      <main className="page">
        <SubHeader />
        {content}
      </main>
    )
  }
}

export default FileListDownloaded
