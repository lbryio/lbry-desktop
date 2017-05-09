import React from 'react';
import lbry from 'lbry.js';
import lbryuri from 'lbryuri.js';
import Link from 'component/link';
import FileCardStream from 'component/fileCardStream'
import FileTileStream from 'component/fileTileStream'
import FileActions from 'component/fileActions';

class FileTile extends React.Component {
  componentDidMount() {
    const {
      resolvingUri,
      resolveUri,
      claim,
      uri,
    } = this.props

    if(!resolvingUri && !claim) {
      resolveUri(uri)
    }
  }

  render() {
    const {
      displayStyle,
      uri,
      claim,
      resolvingUri,
      resolveUri,
    } = this.props

    if (displayStyle == 'card') return <FileCardStream uri={uri} />

    return <FileTileStream uri={uri} />
  }
}

export default FileTile