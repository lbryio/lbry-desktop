import React from "react";
import { Modal } from "component/modal";

class ModalIncompatibleDaemon extends React.PureComponent {
  render() {
    const { quit, launchDaemonHelp } = this.props;

    return (
      <Modal
        isOpen={true}
        contentLabel={__("Incompatible daemon running")}
        type="confirm"
        confirmButtonLabel={__("Quit")}
        onConfirmed={quit}
        abortButtonLabel={__("Learn More")}
        onAborted={launchDaemonHelp}
      >
        {__(
          "This browser is running with an incompatible version of the LBRY protocol and your install must be repaired."
        )}
      </Modal>
    );
  }
}

export default ModalIncompatibleDaemon;
