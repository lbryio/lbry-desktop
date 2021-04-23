// @flow
import type { Node } from 'react';
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
  small: boolean,
  claim: Claim,
  properties?: (Claim) => ?Node,
};

export default function FileProperties(props: Props) {
  const { uri, downloaded, claimIsMine, isSubscribed, small = false, properties, claim } = props;

  return (
    <div
      className={classnames('file-properties', {
        'file-properties--small': small,
      })}
    >
      {typeof properties === 'function' ? (
        properties(claim)
      ) : (
        <>
          <VideoDuration uri={uri} />
          <FileType uri={uri} />
          {isSubscribed && <Icon tooltip icon={ICONS.SUBSCRIBE} />}
          {!claimIsMine && downloaded && <Icon tooltip icon={ICONS.LIBRARY} />}

          <FilePrice hideFree uri={uri} />
        </>
      )}
    </div>
  );
}
