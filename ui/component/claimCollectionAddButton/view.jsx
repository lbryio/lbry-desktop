// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import FileActionButton from 'component/common/file-action-button';

type Props = {
  uri: string,
  // redux
  streamType: Claim,
  isSaved: boolean,
  doOpenModal: (id: string, {}) => void,
};

function ClaimCollectionAddButton(props: Props) {
  const { uri, streamType, isSaved, doOpenModal } = props;

  const isPlayable = streamType === 'video' || streamType === 'audio';

  if (!isPlayable) return null;

  return (
    <FileActionButton
      title={__('Add this video to a playlist')}
      label={!isSaved ? __('Save') : __('Saved')}
      icon={!isSaved ? ICONS.PLAYLIST_ADD : ICONS.PLAYLIST_FILLED}
      iconSize={20}
      requiresAuth
      onClick={() => doOpenModal(MODALS.COLLECTION_ADD, { uri })}
    />
  );
}

export default ClaimCollectionAddButton;
