// @flow
import * as ICONS from 'constants/icons';
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
  claimWasPurchased: boolean,
};

export default function FileProperties(props: Props) {
  const { uri, downloaded, claimIsMine, claimWasPurchased, isSubscribed, small = false } = props;
  return (
    <div
      className={classnames('file-properties', {
        'file-properties--small': small,
      })}
    >
      <VideoDuration uri={uri} />
      <FileType uri={uri} />
      {isSubscribed && <Icon tooltip icon={ICONS.SUBSCRIBE} />}
      {!claimIsMine && downloaded && <Icon tooltip icon={ICONS.LIBRARY} />}
      {claimWasPurchased ? (
        <span className="file-properties__purchased">
          <Icon icon={ICONS.PURCHASED} />
        </span>
      ) : (
        <FilePrice hideFree uri={uri} badge={false} className="file-properties__not-purchased" />
      )}
    </div>
  );
}
