import React from "react";
import { Modal } from "component/modal";

class ModalIncompatibleDaemon extends React.PureComponent {
  render() {
    const { quitAndLaunchDaemonHelp } = this.props;

    return (
      <Modal
        isOpen={true}
        contentLabel={__("Incompatible daemon running")}
        type="alert"
        confirmButtonLabel={__("Quit and Learn More")}
        onConfirmed={quitAndLaunchDaemonHelp}
      >
        {__(
          "This browser is running with an incompatible version of the LBRY protocol and your install must be repaired."
        )}
      </Modal>
    );
  }
}

export default ModalIncompatibleDaemon;
