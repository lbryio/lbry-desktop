import React from "react";
import { Modal } from "modal/modal";

class ModalRevokeClaim extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  s() {
    console.log("gotcha");
  }

  render() {
    const { claimId, txid, nout, abandonClaim, closeModal } = this.props;

    return (
      <Modal
        isOpen={true}
        contentLabel={__("Confirm Claim Revoke")}
        type="confirm"
        confirmButtonLabel={__("Yes, Revoke")}
        // onConfirmed={this.s.bind(this)}
        onConfirmed={() => abandonClaim(claimId, txid, nout)}
        onAborted={closeModal}
      >
        <p>
          {__("Are you sure you want to revoke the claim?")}
        </p>
      </Modal>
    );
  }
}

export default ModalRevokeClaim;
