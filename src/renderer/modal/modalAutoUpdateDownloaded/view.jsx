import React from "react";
import { Modal } from "modal/modal";
import { Line } from "rc-progress";
import Link from "component/link/index";

const { ipcRenderer } = require("electron");

class ModalAutoUpdateDownloaded extends React.PureComponent {
  render() {
    const { closeModal } = this.props;

    return (
      <Modal
        isOpen={true}
        type="confirm"
        contentLabel={__("Update downloaded")}
        confirmButtonLabel={__("Update and Restart")}
        abortButtonLabel={__("Don't Update")}
        onConfirmed={() => {
          ipcRenderer.send("autoUpdateAccepted");
        }}
        onAborted={() => {
          ipcRenderer.send("autoUpdateDeclined");
          closeModal();
        }}
      >
        <section>
          <h3 className="text-center">{__("LBRY Leveled Up")}</h3>
          <p>
            {__(
              "A new version of LBRY has been downloaded and is ready to install."
            )}
          </p>
        </section>
      </Modal>
    );
  }
}

export default ModalAutoUpdateDownloaded;
