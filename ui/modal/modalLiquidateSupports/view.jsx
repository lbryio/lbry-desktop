// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import LiquidateSupports from '../../component/liquidateSupports';

type Props = {
  closeModal: () => void,
  uri: string,
};

export default function ModalLiquidateSupports(props: Props) {
  const { closeModal, uri } = props;

  return (
    <Modal isOpen contentLabel={'Unlock Tips'} type="card" confirmButtonLabel="done" onAborted={closeModal}>
      <LiquidateSupports uri={uri} handleClose={closeModal} />
    </Modal>
  );
}
