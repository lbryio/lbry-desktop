import React from 'react';
import { Modal } from 'modal/modal';
import SyncToggleFlow from 'component/syncEnableFlow';

type Props = {
  closeModal: () => void,
  mode: string
};

const ModalSyncEnable = (props: Props) => {
  const { closeModal, mode } = props;

  return (
// @ts-expect-error - TS2322 - Type '{ children: Element; isOpen: true; type: string; onAborted: () => void; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
    <Modal isOpen type="card" onAborted={closeModal}>
      <SyncToggleFlow closeModal={closeModal} mode={mode} />
    </Modal>
  );
};

export default ModalSyncEnable;
