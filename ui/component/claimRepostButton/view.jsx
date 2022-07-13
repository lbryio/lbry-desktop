// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import FileActionButton from 'component/common/file-action-button';

type Props = {
  uri: string,
  // redux
  repostedAmount: number,
  doOpenModal: (id: string, {}) => void,
};

function ClaimRepostButton(props: Props) {
  const { uri, repostedAmount, doOpenModal } = props;

  return (
    <FileActionButton
      title={__('Repost this content')}
      label={repostedAmount > 1 ? __(`%repost_total% Reposts`, { repost_total: repostedAmount }) : __('Repost')}
      icon={ICONS.REPOST}
      requiresChannel
      onClick={() => doOpenModal(MODALS.REPOST, { uri })}
    />
  );
}

export default ClaimRepostButton;
