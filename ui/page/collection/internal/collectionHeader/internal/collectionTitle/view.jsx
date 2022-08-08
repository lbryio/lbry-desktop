// @flow
import React from 'react';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';
import Skeleton from '@mui/material/Skeleton';

type Props = {
  collectionId: string,
  noIcon?: boolean,
  // -- redux --
  collectionName?: string,
  collectionHasEdits: boolean,
};

const CollectionTitle = (props: Props) => {
  const { collectionId, noIcon, collectionName, collectionHasEdits } = props;

  const isBuiltin = COLLECTIONS_CONSTS.BUILTIN_PLAYLISTS.includes(collectionId);

  return (
    <span>
      {!noIcon && (
        <Icon icon={COLLECTIONS_CONSTS.PLAYLIST_ICONS[collectionId] || ICONS.PLAYLIST} className="icon--margin-right" />
      )}

      {collectionName ? (
        isBuiltin ? (
          __(collectionName)
        ) : (
          collectionName
        )
      ) : (
        <Skeleton
          variant="text"
          animation="wave"
          className="header__navigationItem--balanceLoading"
          style={{ display: 'inline-block' }}
        />
      )}

      {collectionHasEdits ? ' ' + __('(Published playlist with pending changes)') : undefined}
    </span>
  );
};

export default CollectionTitle;
