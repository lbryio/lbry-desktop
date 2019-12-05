// @flow
import React from 'react';
import ChannelCreate from 'component/channelCreate';
import { Modal } from 'modal/modal';

type Props = { doHideModal: () => void };

const ChannelCreateModal = (props: Props) => {
  const { doHideModal } = props;
  return (
    <Modal isOpen type="card" onAborted={doHideModal}>
      <ChannelCreate />
    </Modal>
  );
};

export default ChannelCreateModal;
