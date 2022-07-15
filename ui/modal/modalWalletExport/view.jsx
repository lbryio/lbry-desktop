// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import WalletExport from 'component/walletExport';

type Props = {
  closeModal: () => void,
};

export default function ModalWalletExport(props: Props) {
  const { closeModal } = props;

  return (
    <Modal isOpen contentLabel={'Export Wallet'} type="card" onAborted={closeModal}>
      <WalletExport />
    </Modal>
  );
}
