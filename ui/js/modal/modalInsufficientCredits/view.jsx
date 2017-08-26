import React from "react";
import { Modal } from "modal/modal";
import { CurrencySymbol } from "component/common";

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
        <h3 className="modal__header">{__("More Credits Required")}</h3>
        <p>You'll need more <CurrencySymbol /> to do this.</p>
      </Modal>
    );
  }
}

export default ModalInsufficientCredits;
