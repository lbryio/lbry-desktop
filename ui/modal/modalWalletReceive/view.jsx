// @flow
import React from 'react';
import WalletAddress from 'component/walletAddress';
import { Modal } from 'modal/modal';

type Props = { doHideModal: () => void };

const WalletAddressPage = (props: Props) => {
  const { doHideModal } = props;
  return (
    <Modal isOpen type="card" onAborted={doHideModal}>
      <WalletAddress />
    </Modal>
  );
};
export default WalletAddressPage;
