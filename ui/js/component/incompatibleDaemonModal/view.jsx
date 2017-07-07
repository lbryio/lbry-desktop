import React from "react";
import { Modal } from "component/modal";

class IncompatibleDaemonModal extends React.PureComponent {
  render() {
    const { quit, skipWrongDaemonNotice } = this.props;

    return (
      <Modal
        isOpen={true}
        contentLabel={__("Incompatible daemon running")}
        type="confirm"
        confirmButtonLabel={__("Exit")}
        abortButtonLabel={__("Continue")}
        onConfirmed={quit}
        onAborted={skipWrongDaemonNotice}
      >
        {__(
          "An incompatible version of the LBRY daemon is running. If you continue to receive this message after starting LBRY again, try restarting your computer."
        )}
      </Modal>
    );
  }
}

export default IncompatibleDaemonModal;
