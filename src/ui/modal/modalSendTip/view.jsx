// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import SendTip from 'component/walletSendTip';
import UriIndicator from 'component/uriIndicator';

type Props = {
  closeModal: () => void,
  uri: string,
};

class ModalSendTip extends React.PureComponent<Props> {
  render() {
    const { closeModal, uri } = this.props;

    return (
      <Modal
        onAborted={closeModal}
        isOpen
        type="custom"
        title={
          <React.Fragment>
            {__('Send a tip to')} <UriIndicator uri={uri} />
          </React.Fragment>
        }
      >
        <SendTip uri={uri} onCancel={closeModal} sendTipCallback={closeModal} />
      </Modal>
    );
  }
}

export default ModalSendTip;
