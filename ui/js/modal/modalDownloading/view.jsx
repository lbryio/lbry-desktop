import React from "react";
import { Modal } from "modal/modal";
import { Line } from "rc-progress";
import Link from "component/link/index";

class ModalDownloading extends React.PureComponent {
  render() {
    const {
      downloadProgress,
      downloadComplete,
      startUpgrade,
      cancelUpgrade,
    } = this.props;

    return (
      <Modal
        isOpen={true}
        contentLabel={__("Downloading Update")}
        type="custom"
      >
        {__("Downloading Update")}
        {downloadProgress ? `: ${downloadProgress}%` : null}
        <Line
          percent={downloadProgress ? downloadProgress : 0}
          strokeWidth="4"
        />
        {downloadComplete
          ? <div>
              <br />
              <p>{__('Click "Begin Upgrade" to start the upgrade process.')}</p>
              <p>
                {__(
                  "The app will close, and you will be prompted to install the latest version of LBRY."
                )}
              </p>
              <p>
                {__("After the install is complete, please reopen the app.")}
              </p>
            </div>
          : null}
        <div className="modal__buttons">
          {downloadComplete
            ? <Link
                button="primary"
                label={__("Begin Upgrade")}
                className="modal__button"
                onClick={startUpgrade}
              />
            : null}
          <Link
            button="alt"
            label={__("Cancel")}
            className="modal__button"
            onClick={cancelUpgrade}
          />
        </div>
      </Modal>
    );
  }
}

export default ModalDownloading;
