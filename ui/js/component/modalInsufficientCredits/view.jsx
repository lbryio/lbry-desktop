import React from "react";
import { Modal } from "component/modal";

class ModalInsufficientCredits extends React.PureComponent {
  render() {
    const { addFunds, closeModal } = this.props;

    return (
      <Modal
        isOpen={true}
        type="confirm"
        contentLabel={__("Not enough credits")}
        confirmButtonLabel={__("Get Credits")}
        abortButtonLabel={__("Cancel")}
        onAborted={closeModal}
        onConfirmed={addFunds}
      >
        {__("More LBRY credits are required to purchase this.")}
      </Modal>
    );
  }
}

export default ModalInsufficientCredits;
