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

class FileListPublished extends React.Component {
  componentWillMount() {
    this.props.fetchFileListPublished()
  }

  componentDidUpdate() {
    if(this.props.publishedContent.length > 0) this._requestPublishReward()
  }

  _requestPublishReward() {
    // TODO this is throwing an error now
    // Error: LBRY internal API is disabled
    //
    // lbryio.call('reward', 'list', {}).then(function(userRewards) {
    //   //already rewarded
    //   if (userRewards.filter(function (reward) {
    //       return reward.RewardType == rewards.TYPE_FIRST_PUBLISH && reward.TransactionID
    //     }).length) {
    //     return
    //   }
    //   else {
    //     rewards.claimReward(rewards.TYPE_FIRST_PUBLISH).catch(() => {})
    //   }
    // })
  }

  render() {
    const {
      publishedContent,
      fetching,
      navigate,
    } = this.props

    let content
    if (fetching) {
      content = <BusyMessage message="Loading" />
    } else if (!publishedContent.length) {
      content = <span>You haven't downloaded anything from LBRY yet. Go <Link onClick={() => navigate('/discover')} label="search for your first download" />!</span>
    } else {
      content = <FileList fileInfos={publishedContent} hidePrices={true} />
    }

    return (
      <main className="main--single-column">
        <SubHeader />
        {content}
      </main>
    )
  }
}

export default FileListPublished
