import React from "react";
import lbry from "lbry";
import { ExpandableModal } from "component/modal";

class ModalError extends React.PureComponent {
  render() {
    const { modal, closeModal, error } = this.props;

    const errorObj = typeof error === "string" ? { message: error } : error;

    const error_key_labels = {
      connectionString: __("API connection string"),
      method: __("Method"),
      params: __("Parameters"),
      code: __("Error code"),
      message: __("Error message"),
      data: __("Error data"),
    };

    const errorInfoList = [];
    for (let key of Object.keys(errorObj)) {
      let val = typeof errorObj[key] == "string"
        ? errorObj[key]
        : JSON.stringify(errorObj[key]);
      let label = error_key_labels[key];
      errorInfoList.push(
        <li key={key}><strong>{label}</strong>: <code>{val}</code></li>
      );
    }
    const errorInfo = (
      <ul className="error-modal__error-list">{errorInfoList}</ul>
    );

    return (
      <ExpandableModal
        isOpen={modal == "error"}
        contentLabel={__("Error")}
        className="error-modal"
        overlayClassName="error-modal-overlay"
        onConfirmed={closeModal}
        extraContent={errorInfo}
      >
        <h3 className="modal__header">{__("Error")}</h3>

        <div className="error-modal__content">
          <div>
            <img
              className="error-modal__warning-symbol"
              src={lbry.imagePath("warning.png")}
            />
          </div>
          <p>
            {__(
              "We're sorry that LBRY has encountered an error. This has been reported and we will investigate the problem."
            )}
          </p>
        </div>
      </ExpandableModal>
    );
  }
}

export default ModalError;
