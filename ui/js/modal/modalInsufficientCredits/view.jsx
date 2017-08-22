import React from "react";
import { Modal } from "modal/modal";

class ModalInsufficientCredits extends React.PureComponent {
  render() {
    const { addFunds, closeModal } = this.props;

    return (
      <Modal
        isOpen={true}
        type="confirm"
        contentLabel={__("Not enough credits")}
        confirmButtonLabel={__("Get Credits")}
        abortButtonLabel={__("Not Now")}
        onAborted={closeModal}
        onConfirmed={addFunds}
      >
        <p>{__("More LBRY credits are required to take this action.")}</p>
      </Modal>
    );
  }
}

export default ModalInsufficientCredits;
