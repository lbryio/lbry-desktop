import React from "react";
import { Modal } from "modal/modal";

class ModalRevokeClaim extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  revokeClaim() {
    const { name, claimId, txid, nout } = this.props;

    this.props.closeModal();
    this.props.abandonClaim(claimId, name, txid, nout);
  }

  render() {
    const { msg, closeModal } = this.props;

    return (
      <Modal
        isOpen={true}
        contentLabel={__("Confirm Claim Revoke")}
        type="confirm"
        confirmButtonLabel={__("Yes, Revoke")}
        onConfirmed={this.revokeClaim.bind(this)}
        onAborted={closeModal}
      >
        <p>
          {msg}
        </p>
      </Modal>
    );
  }
}

export default ModalRevokeClaim;
