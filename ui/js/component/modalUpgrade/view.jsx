import React from "react";
import { Modal } from "component/modal";

class ModalUpgrade extends React.PureComponent {
  render() {
    const { downloadUpgrade, skipUpgrade } = this.props;

    return (
      <Modal
        isOpen={true}
        contentLabel={__("Update available")}
        type="confirm"
        confirmButtonLabel={__("Upgrade")}
        abortButtonLabel={__("Skip")}
        onConfirmed={downloadUpgrade}
        onAborted={skipUpgrade}
      >
        {__(
          "Your version of LBRY is out of date and may be unreliable or insecure."
        )}
      </Modal>
    );
  }
}

export default ModalUpgrade;
