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
};

export default function FileProperties(props: Props) {
  const { uri, downloaded, claimIsMine, isSubscribed } = props;

  return (
    <div className="file-properties">
      <FilePrice hideFree uri={uri} />
      <VideoDuration uri={uri} />
      {isSubscribed && <Icon tooltip icon={icons.SUBSCRIBE} />}
      {!claimIsMine && downloaded && <Icon tooltip icon={icons.DOWNLOAD} />}
    </div>
  );
}
