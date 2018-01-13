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
        contentLabel={__("Update Downloaded")}
        confirmButtonLabel={__("Use it Now")}
        abortButtonLabel={__("Upgrade on Restart")}
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
              'A new version of LBRY has been released, downloaded, and is ready for you to use pending a restart.'
            )}
          </p>
        </section>
      </Modal>
    );
  }
}

export default ModalAutoUpdateDownloaded;
