// @flow
import type { Node } from 'react';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import FilePrice from 'component/filePrice';
import VideoDuration from 'component/videoDuration';
import FileType from 'component/fileType';
import ClaimType from 'component/claimType';
import * as COL from 'constants/collections';

type Props = {
  uri: string,
  downloaded: boolean,
  claimIsMine: boolean,
  isSubscribed: boolean,
  small: boolean,
  claim: Claim,
  properties?: (Claim) => ?Node,
  iconOnly: boolean,
  editedCollection: Collection,
};

export default function PreviewOverlayProperties(props: Props) {
  const {
    uri,
    downloaded,
    claimIsMine,
    isSubscribed,
    small = false,
    properties,
    claim,
    iconOnly,
    editedCollection,
  } = props;
  const isCollection = claim && claim.value_type === 'collection';
  // $FlowFixMe
  const claimLength = claim && claim.value.claims && claim.value.claims.length;

  const claimCount = editedCollection ? editedCollection.items.length : claimLength;
  const isStream = claim && claim.value_type === 'stream';
  const size = small ? COL.ICON_SIZE : undefined;

  return (
    <div
      className={classnames('claim-preview__overlay-properties', {
        '.claim-preview__overlay-properties--small': small,
      })}
    >
      {typeof properties === 'function' ? (
        properties(claim)
      ) : (
        <>
          {!isStream && <ClaimType uri={uri} small={small} />}
          {editedCollection && (
            <Icon
              customTooltipText={__('Unpublished Edits')}
              tooltip
              iconColor="red"
              size={size}
              icon={ICONS.PUBLISH}
            />
          )}
          {isCollection && claim && !iconOnly && <div>{claimCount}</div>}
          {!iconOnly && isStream && <VideoDuration uri={uri} />}
          {isStream && <FileType uri={uri} small={small} />}
          {isSubscribed && <Icon tooltip size={size} icon={ICONS.SUBSCRIBE} />}
          {!claimIsMine && downloaded && <Icon size={size} tooltip icon={ICONS.LIBRARY} />}
          <FilePrice hideFree uri={uri} />
        </>
      )}
    </div>
  );
}
