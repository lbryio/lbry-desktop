// @flow
import React from 'react';
import WalletSend from 'component/walletSend';
import { Modal } from 'modal/modal';

type Props = { doHideModal: () => void };

const WalletSendModal = (props: Props) => {
  const { doHideModal } = props;
  return (
    <Modal isOpen type="card" onAborted={doHideModal}>
      <WalletSend />
    </Modal>
  );
};
export default WalletSendModal;
