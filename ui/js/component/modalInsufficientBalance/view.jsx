import React from "react";
import { Modal } from "component/modal";

class ModalInsufficientBalance extends React.PureComponent {
  render() {
    const { addBalance, closeModal } = this.props;

    return (
      <Modal
        isOpen={true}
        type="confirm"
        contentLabel={__("Not enough credits")}
        confirmButtonLabel={__("Get Credits")}
        abortButtonLabel={__("Cancel")}
        onAborted={closeModal}
        onConfirmed={addBalance}
      >
        {__(
          "Insufficient balance: after this transaction you would have less than 1 LBC in your wallet."
        )}
      </Modal>
    );
  }
}

export default ModalInsufficientBalance;
