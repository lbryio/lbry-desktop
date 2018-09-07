// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import SendTip from 'component/walletSendTip';

type Props = {
  closeModal: () => void,
  uri: string,
};

class ModalSendTip extends React.PureComponent<Props> {
  render() {
    const { closeModal, uri } = this.props;

    return (
      <Modal onAborted={closeModal} isOpen type="custom">
        <SendTip uri={uri} onCancel={closeModal} sendTipCallback={closeModal} />
      </Modal>
    );
  }
}

export default ModalSendTip;
