// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import FileActionButton from 'component/common/file-action-button';

type Props = {
  uri: string,
  fileAction?: boolean,
  webShareable: boolean,
  collectionId?: string,
  // redux
  doOpenModal: (id: string, {}) => void,
};

function ClaimShareButton(props: Props) {
  const { uri, fileAction, collectionId, webShareable, doOpenModal } = props;

  return (
    <FileActionButton
      title={__('Share this content')}
      label={__('Share')}
      icon={ICONS.SHARE}
      onClick={() => doOpenModal(MODALS.SOCIAL_SHARE, { uri, webShareable, collectionId })}
      noStyle={!fileAction}
    />
  );
}

export default ClaimShareButton;
