// @flow
import * as icons from 'constants/icons';
import * as React from 'react';
import Icon from 'component/common/icon';
import FilePrice from 'component/filePrice';
import VideoDuration from 'component/videoDuration';

type Props = {
  uri: string,
  downloaded: boolean,
  claimIsMine: boolean,
  isSubscribed: boolean,
  isNew: boolean,
  claim: Claim,
  rewardedContentClaimIds: Array<string>,
};

export default function FileProperties(props: Props) {
  const { uri, downloaded, claimIsMine, rewardedContentClaimIds, isSubscribed, claim } = props;
  const { claim_id: claimId } = claim;
  const isRewardContent = rewardedContentClaimIds.includes(claimId);

  return (
    <div className="file-properties">
      {isSubscribed && <Icon tooltip icon={icons.SUBSCRIBE} />}
      {!claimIsMine && downloaded && <Icon tooltip icon={icons.DOWNLOAD} />}
      {isRewardContent && <Icon tooltip icon={icons.FEATURED} />}
      <FilePrice hideFree uri={uri} />
      <VideoDuration className="media__subtitle" uri={uri} />
    </div>
  );
}
