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
    this.props.fetchFileInfosDownloaded()
  }

  render() {
    const {
      fileInfos,
      isPending,
      navigate,
    } = this.props

    let content
    if (fileInfos && fileInfos.length > 0) {
      content = <FileList fileInfos={fileInfos} fetching={isPending} />
    } else {
      if (isPending) {
        content = <BusyMessage message={__("Loading")} />
      } else {
        content = <span>{__("You haven't downloaded anything from LBRY yet. Go")} <Link onClick={() => navigate('/discover')} label={__("search for your first download")} />!</span>
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
