// @flow
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import FileActionButton from 'component/common/file-action-button';

type Props = {
  uri: string,
  collectionId: string,
  // redux
  claimIsPending: boolean,
  doOpenModal: (id: string, {}) => void,
};

function CollectionDeleteButton(props: Props) {
  const { uri, collectionId, claimIsPending, doOpenModal } = props;

  return (
    <FileActionButton
      title={__('Delete Playlist')}
      onClick={() => doOpenModal(MODALS.COLLECTION_DELETE, { uri, collectionId, redirect: `/$/${PAGES.PLAYLISTS}` })}
      icon={ICONS.DELETE}
      iconSize={18}
      description={__('Delete Playlist')}
      disabled={claimIsPending}
    />
  );
}

export default CollectionDeleteButton;
