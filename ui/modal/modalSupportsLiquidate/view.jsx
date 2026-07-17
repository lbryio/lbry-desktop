// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import SupportsLiquidate from 'component/supportsLiquidate';

type Props = {
  closeModal: () => void,
  uri: string,
};

export default function ModalSupportsLiquidate(props: Props) {
  const { closeModal, uri } = props;

  return (
    <Modal isOpen contentLabel={'Unlock tips'} type="card" confirmButtonLabel="done" onAborted={closeModal}>
      <SupportsLiquidate uri={uri} handleClose={closeModal} />
    </Modal>
  );
}
