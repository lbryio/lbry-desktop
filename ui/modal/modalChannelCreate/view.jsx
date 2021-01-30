// @flow
import React from 'react';
import ChannelForm from 'component/channelForm';
import { Modal } from 'modal/modal';

type Props = { doHideModal: () => void };

const ModalChannelCreate = (props: Props) => {
  const { doHideModal } = props;

  return (
    <Modal isOpen type="card" onAborted={doHideModal}>
      <ChannelForm onSuccess={doHideModal} />
    </Modal>
  );
};

export default ModalChannelCreate;
