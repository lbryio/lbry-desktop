// @flow
import React from 'react';
import './style.scss';
import FeaturedChannelsEdit from 'component/channelSections/FeaturedChannelsEdit';
import { Modal } from 'modal/modal';

type Props = {
  create?: { ownerChannelId: string },
  edit?: { collectionId: string },
  // --- redux ---
  doHideModal: () => void,
};

export default function ModalFeaturedChannelsEdit(props: Props) {
  const { create, edit, doHideModal } = props;

  if ((!create && !edit) || (create && edit)) {
    console.error('Invalid param combination'); // eslint-disable-line no-console
    return null;
  }

  return (
    <Modal isOpen type="custom" className="modal-featured-channels-edit">
      <FeaturedChannelsEdit
        channelId={create ? create.ownerChannelId : undefined}
        collectionId={edit ? edit.collectionId : undefined}
        onSave={doHideModal}
        onCancel={doHideModal}
      />
    </Modal>
  );
}
