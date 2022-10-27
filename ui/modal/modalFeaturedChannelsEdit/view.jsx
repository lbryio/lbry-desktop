// @flow
// MODALS.FEATURED_CHANNELS_EDIT

import React from 'react';

import './style.scss';
import FeaturedChannelsEdit from 'component/channelSections/FeaturedChannelsEdit';
import { Modal } from 'modal/modal';

type Props = {
  channelId: string,
  sectionId?: string, // null = create new; <string> = edit existing
  // --- redux ---
  doHideModal: () => void,
};

export default function ModalFeaturedChannelsEdit(props: Props) {
  const { channelId, sectionId, doHideModal } = props;

  return (
    <Modal isOpen type="custom" width="wide-fixed" className="modal-featured-channels-edit">
      <FeaturedChannelsEdit channelId={channelId} sectionId={sectionId} onSave={doHideModal} onCancel={doHideModal} />
    </Modal>
  );
}
