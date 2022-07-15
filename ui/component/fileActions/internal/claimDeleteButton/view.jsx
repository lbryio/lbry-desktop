// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import FileActionButton from 'component/common/file-action-button';

type Props = {
  uri: string,
  // redux
  doOpenModal: (id: string, {}) => void,
};

function ClaimDeleteButton(props: Props) {
  const { uri, doOpenModal } = props;

  return (
    <FileActionButton
      title={__('Remove from your library')}
      icon={ICONS.DELETE}
      onClick={() => doOpenModal(MODALS.CONFIRM_FILE_REMOVE, { uri })}
    />
  );
}

export default ClaimDeleteButton;
