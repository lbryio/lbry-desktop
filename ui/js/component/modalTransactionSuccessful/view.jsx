import React from "react";
import { Modal } from "component/modal";

class ModalTransactionSuccessful extends React.PureComponent {
  render() {
    const { closeModal } = this.props;

    return (
      <Modal
        isOpen={true}
        contentLabel={__("Transaction successful")}
        onConfirmed={closeModal}
      >
        {__("Your transaction was successfully placed in the queue.")}
      </Modal>
    );
  }
}

export default ModalTransactionSuccessful;
