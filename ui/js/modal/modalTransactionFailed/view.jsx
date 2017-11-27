import React from "react";
import { Modal } from "modal/modal";

class ModalTransactionFailed extends React.PureComponent {
  render() {
    const { closeModal } = this.props;

    return (
      <Modal
        isOpen={true}
        contentLabel={__("Transaction failed")}
        onConfirmed={closeModal}
      >
        {__("Transaction failed.")}:
      </Modal>
    );
  }
}

export default ModalTransactionFailed;
