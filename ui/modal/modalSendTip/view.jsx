// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import SendTip from 'component/walletSendTip';

type Props = {
  uri: string,
  claimIsMine: boolean,
  isSupport: boolean,
  isTipOnly?: boolean,
  hasSelectedTab?: string,
  customText?: string,
  doHideModal: () => void,
  setAmount?: (number) => void,
};

class ModalSendTip extends React.PureComponent<Props> {
  render() {
    const { uri, claimIsMine, isTipOnly, hasSelectedTab, customText, doHideModal, setAmount } = this.props;

    return (
      <Modal onAborted={doHideModal} isOpen type="card">
        <SendTip
          uri={uri}
          claimIsMine={claimIsMine}
          onCancel={doHideModal}
          isTipOnly={isTipOnly}
          hasSelectedTab={hasSelectedTab}
          customText={customText}
          setAmount={setAmount}
        />
      </Modal>
    );
  }
}

export default ModalSendTip;
