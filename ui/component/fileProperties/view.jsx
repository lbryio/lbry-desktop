// @flow
import * as icons from 'constants/icons';
import * as React from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import FilePrice from 'component/filePrice';
import VideoDuration from 'component/videoDuration';
import FileType from 'component/fileType';

type Props = {
  uri: string,
  downloaded: boolean,
  claimIsMine: boolean,
  isSubscribed: boolean,
  isNew: boolean,
  small: boolean,
};

export default function FileProperties(props: Props) {
  const { uri, downloaded, claimIsMine, isSubscribed, small = false } = props;

  return (
    <div className={classnames('file-properties', { 'file-properties--small': small })}>
      <FilePrice hideFree uri={uri} />
      <VideoDuration uri={uri} />
      <FileType uri={uri} />
      {isSubscribed && <Icon tooltip icon={icons.SUBSCRIBE} />}
      {!claimIsMine && downloaded && <Icon tooltip icon={icons.LIBRARY} />}
    </div>
  );
}
