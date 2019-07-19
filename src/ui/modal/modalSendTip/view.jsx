// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import SendTip from 'component/walletSendTip';
import UriIndicator from 'component/uriIndicator';

type Props = {
  closeModal: () => void,
  uri: string,
  claimIsMine: boolean,
  isSupport: boolean,
};

class ModalSendTip extends React.PureComponent<Props> {
  render() {
    const { closeModal, uri, claimIsMine, isSupport } = this.props;

    return (
      <Modal
        onAborted={closeModal}
        isOpen
        type="custom"
        title={
          <React.Fragment>
            {claimIsMine ? __('Add support to') : __('Send a tip')} <UriIndicator uri={uri} />
          </React.Fragment>
        }
      >
        <SendTip
          uri={uri}
          claimIsMine={claimIsMine}
          isSupport={isSupport}
          onCancel={closeModal}
          sendTipCallback={closeModal}
        />
      </Modal>
    );
  }
}

export default ModalSendTip;
