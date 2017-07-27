import React from "react";
import { Modal } from "component/modal";

class ModalTransactionFailed extends React.PureComponent {
  render() {
    const { closeModal } = this.props;

    return (
      <Modal
        isOpen={true}
        contentLabel={__("Transaction failed")}
        onConfirmed={closeModal}
      >
        {__("Something went wrong")}:
      </Modal>
    );
  }
}

export default ModalTransactionFailed;
