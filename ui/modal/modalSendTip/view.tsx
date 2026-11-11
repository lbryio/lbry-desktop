import React from "react";
import { Modal } from "modal/modal";
import SendTip from "component/walletSendTip";

type Props = {
  closeModal: () => void;
  uri: string;
  claimIsMine: boolean;
  isSupport: boolean;
};

class ModalSendTip extends React.PureComponent<Props> {
  render() {
    const { closeModal, uri, claimIsMine } = this.props;

    return (
      // @ts-expect-error - TS2322 - Type '{ children: Element; onAborted: () => void; isOpen: true; type: string; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
      <Modal onAborted={closeModal} isOpen type="card">
        <SendTip uri={uri} claimIsMine={claimIsMine} onCancel={closeModal} />
      </Modal>
    );
  }
}

export default ModalSendTip;
