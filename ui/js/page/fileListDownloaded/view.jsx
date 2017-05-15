import React from 'react';
import lbry from 'lbry.js';
import lbryuri from 'lbryuri.js';
import Link from 'component/link';
import {FormField} from 'component/form.js';
import {FileTile} from 'component/fileTile';
import rewards from 'rewards.js';
import lbryio from 'lbryio.js';
import {BusyMessage, Thumbnail} from 'component/common.js';
import FileList from 'component/fileList'
import SubHeader from 'component/subHeader'

class FileListDownloaded extends React.Component {
  componentWillMount() {
    this.props.fetchFileListDownloaded()
  }

  render() {
    const {
      downloadedContent,
      fetching,
      navigate,
    } = this.props

    let content
    if (downloadedContent && downloadedContent.length > 0) {
      content = <FileList fileInfos={downloadedContent} fetching={fetching} hidePrices={true} />
    } else {
      if (fetching) {
        content = <BusyMessage message="Loading" />
      } else {
        content = <span>You haven't downloaded anything from LBRY yet. Go <Link onClick={() => navigate('/discover')} label="search for your first download" />!</span>
      }
    }

    return (
      <main className="main--single-column">
        <SubHeader />
        {content}
      </main>
    )
  }
}

export default FileListDownloaded
