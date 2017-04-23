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

const FileListPublished = (props) => {
  // <FileListNav viewingPage="published" />
  return (
    <div>published content</div>
  )
}

// const FileListPublished = React.createClass({
//   _isMounted: false,

//   getInitialState: function () {
//     return {
//       fileInfos: null,
//     };
//   },
//   _requestPublishReward: function() {
//     lbryio.call('reward', 'list', {}).then(function(userRewards) {
//       //already rewarded
//       if (userRewards.filter(function (reward) {
//           return reward.RewardType == rewards.TYPE_FIRST_PUBLISH && reward.TransactionID;
//         }).length) {
//         return;
//       }
//       else {
//         rewards.claimReward(rewards.TYPE_FIRST_PUBLISH).catch(() => {})
//       }
//     });
//   },
//   componentDidMount: function () {
//     this._isMounted = true;
//     this._requestPublishReward();
//     document.title = "Published Files";

//     lbry.claim_list_mine().then((claimInfos) => {
//       if (!this._isMounted) { return; }

//       lbry.file_list().then((fileInfos) => {
//         if (!this._isMounted) { return; }

//         const myClaimOutpoints = claimInfos.map(({txid, nout}) => txid + ':' + nout);
//         this.setState({
//           fileInfos: fileInfos.filter(({outpoint}) => myClaimOutpoints.includes(outpoint)),
//         });
//       });
//     });
//   },
//   componentWillUnmount: function() {
//     this._isMounted = false;
//   },
//   render: function () {
//     if (this.state.fileInfos === null) {
//       return (
//         <main className="page">
//           <BusyMessage message="Loading" />
//         </main>
//       );
//     }
//     else if (!this.state.fileInfos.length) {
//       return (
//         <main className="page">
//           <span>You haven't published anything to LBRY yet.</span> Try <Link href="?publish" label="publishing" />!
//         </main>
//       );
//     }
//     else {
//       return (
//         <main className="page">
//           <FileList fileInfos={this.state.fileInfos} />
//         </main>
//       );
//     }
//   }
// });

export default FileListPublished
