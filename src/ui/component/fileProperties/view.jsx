// @flow
import * as icons from 'constants/icons';
import * as React from 'react';
import { parseURI } from 'lbry-redux';
import Icon from 'component/common/icon';
import FilePrice from 'component/filePrice';

type Props = {
  uri: string,
  claim: ?StreamClaim,
  downloaded: boolean,
  claimIsMine: boolean,
  isSubscribed: boolean,
  isNew: boolean,
  rewardedContentClaimIds: Array<string>,
};

export default function FileProperties(props: Props) {
  const { claim, uri, downloaded, claimIsMine, rewardedContentClaimIds, isSubscribed } = props;
  const { claimId } = parseURI(uri);
  const isRewardContent = rewardedContentClaimIds.includes(claimId);

  const video = claim && claim.value && claim.value.video;
  let duration;
  if (video && video.duration) {
    // $FlowFixMe
    let date = new Date(null);
    date.setSeconds(video.duration);
    let timeString = date.toISOString().substr(11, 8);

    if (timeString.startsWith('00:')) {
      timeString = timeString.substr(3);
    }

    duration = timeString;
  }

  return (
    <div className="file-properties">
      {isSubscribed && <Icon tooltip icon={icons.SUBSCRIPTION} />}
      {!claimIsMine && downloaded && <Icon tooltip icon={icons.DOWNLOAD} />}
      {isRewardContent && <Icon tooltip icon={icons.FEATURED} />}
      <FilePrice hideFree uri={uri} />
      {duration && <span className="media__subtitle">{duration}</span>}
    </div>
  );
}
