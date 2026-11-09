import React from 'react';
import { Modal } from 'modal/modal';
import SupportsLiquidate from 'component/supportsLiquidate';

type Props = {
  closeModal: () => void,
  uri: string
};

export default function ModalSupportsLiquidate(props: Props) {
  const { closeModal, uri } = props;

  return (
// @ts-expect-error - TS2322 - Type '{ children: Element; isOpen: true; contentLabel: string; type: string; confirmButtonLabel: string; onAborted: () => void; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
    <Modal isOpen contentLabel={'Unlock tips'} type="card" confirmButtonLabel="done" onAborted={closeModal}>
      {/* @ts-expect-error - TS2322 (ts-migration) */}
      <SupportsLiquidate uri={uri} handleClose={closeModal} />
    </Modal>
  );
}
