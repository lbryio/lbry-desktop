import React from "react";
import lbry from "lbry.js";
import lbryuri from "lbryuri.js";
import Link from "component/link";
import { FormField } from "component/form.js";
import FileTile from "component/fileTile";
import rewards from "rewards.js";
import lbryio from "lbryio.js";
import { BusyMessage, Thumbnail } from "component/common.js";
import FileList from "component/fileList";
import SubHeader from "component/subHeader";

class FileListPublished extends React.PureComponent {
  componentWillMount() {
    if (!this.props.isPending) this.props.fetchFileListPublished();
  }

  componentDidUpdate() {
    if (this.props.fileInfos.length > 0) this._requestPublishReward();
  }

  _requestPublishReward() {
    // TODO this is throwing an error now
    // Error: LBRY internal API is disabled
    //
    // lbryio.call('reward', 'list', {}).then(function(userRewards) {
    //   //already rewarded
    //   if (userRewards.filter(function (reward) {
    //       return reward.reward_type == rewards.TYPE_FIRST_PUBLISH && reward.transaction_id
    //     }).length) {
    //     return
    //   }
    //   else {
    //     rewards.claimReward(rewards.TYPE_FIRST_PUBLISH).catch(() => {})
    //   }
    // })
  }

  render() {
    const { fileInfos, isPending, navigate } = this.props;

    let content;

    if (fileInfos && fileInfos.length > 0) {
      content = (
        <FileList
          fileInfos={fileInfos}
          fetching={isPending}
          fileTileShowEmpty={FileTile.SHOW_EMPTY_PENDING}
        />
      );
    } else {
      if (isPending) {
        content = <BusyMessage message={__("Loading")} />;
      } else {
        content = (
          <span>
            {__("It looks like you haven't published anything to LBRY yet. Go")}
            {" "}
            <Link
              onClick={() => navigate("/publish")}
              label={__("share your beautiful cats with the world")}
            />!
          </span>
        );
      }
    }

    return (
      <main className="main--single-column">
        <SubHeader />
        {content}
      </main>
    );
  }
}

export default FileListPublished;
