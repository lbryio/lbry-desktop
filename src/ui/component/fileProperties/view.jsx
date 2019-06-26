// @flow
import * as icons from 'constants/icons';
import * as React from 'react';
import { parseURI } from 'lbry-redux';
import Icon from 'component/common/icon';
import FilePrice from 'component/filePrice';

type Props = {
  uri: string,
  downloaded: boolean,
  claimIsMine: boolean,
  isSubscribed: boolean,
  isNew: boolean,
  rewardedContentClaimIds: Array<string>,
};

export default function FileProperties(props: Props) {
  const { uri, downloaded, claimIsMine, rewardedContentClaimIds, isSubscribed } = props;
  const { claimId } = parseURI(uri);
  const isRewardContent = rewardedContentClaimIds.includes(claimId);

  return (
    <div className="file-properties">
      {isSubscribed && <Icon tooltip icon={icons.SUBSCRIPTION} />}
      {!claimIsMine && downloaded && <Icon tooltip icon={icons.DOWNLOAD} />}
      {isRewardContent && <Icon tooltip icon={icons.FEATURED} />}
      <FilePrice hideFree uri={uri} />
    </div>
  );
}
