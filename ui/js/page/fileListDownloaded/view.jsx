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
          <span>You haven't downloaded anything from LBRY yet. Go <Link href="?discover" label="search for your first download" />!</span>
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
// const FileListDownloaded = React.createClass({
//   _isMounted: false,

//   getInitialState: function() {
//     return {
//       fileInfos: null,
//     };
//   },
//   componentDidMount: function() {
//     this._isMounted = true;
//     document.title = "Downloaded Files";

//     lbry.claim_list_mine().then((myClaimInfos) => {
//       if (!this._isMounted) { return; }

//       lbry.file_list().then((fileInfos) => {
//         if (!this._isMounted) { return; }

//         const myClaimOutpoints = myClaimInfos.map(({txid, nout}) => txid + ':' + nout);
//         this.setState({
//           fileInfos: fileInfos.filter(({outpoint}) => !myClaimOutpoints.includes(outpoint)),
//         });
//       });
//     });
//   },
//   componentWillUnmount: function() {
//     this._isMounted = false;
//   },
//   render: function() {
//     if (this.state.fileInfos === null) {
//       return (
//         <main className="page">
//           <BusyMessage message="Loading" />
//         </main>
//       );
//     } else if (!this.state.fileInfos.length) {
//       return (
//         <main className="page">
//           <span>You haven't downloaded anything from LBRY yet. Go <Link href="?discover" label="search for your first download" />!</span>
//         </main>
//       );
//     } else {
//       return (
//         <main className="page">
//           <FileList fileInfos={this.state.fileInfos} hidePrices={true} />
//         </main>
//       );
//     }
//   }
// });

export default FileListDownloaded
