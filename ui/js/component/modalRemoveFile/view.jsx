import React from "react";
import { Modal } from "component/modal";
import FormField from "component/formField";

class ModalRemoveFile extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      deleteChecked: false,
      abandonClaimChecked: false,
    };
  }

  handleDeleteCheckboxClicked(event) {
    this.setState({
      deleteChecked: event.target.checked,
    });
  }

  handleAbandonClaimCheckboxClicked(event) {
    this.setState({
      abandonClaimChecked: event.target.checked,
    });
  }

  render() {
    const { claimIsMine, closeModal, deleteFile, outpoint, title } = this.props;
    const { deleteChecked, abandonClaimChecked } = this.state;

    return (
      <Modal
        isOpen={true}
        contentLabel={__("Confirm File Remove")}
        type="confirm"
        confirmButtonLabel={__("Remove")}
        onConfirmed={() =>
          deleteFile(outpoint, deleteChecked, abandonClaimChecked)}
        onAborted={closeModal}
      >
        <p>
          {__("Are you sure you'd like to remove")} <cite>{title}</cite>{" "}
          {__("from LBRY?")}
        </p>

        <section>
          <label>
            <FormField
              type="checkbox"
              checked={deleteChecked}
              onClick={this.handleDeleteCheckboxClicked.bind(this)}
            />{" "}
            {__("Delete this file from my computer")}
          </label>
        </section>
        {claimIsMine &&
          <section>
            <label>
              <FormField
                type="checkbox"
                checked={abandonClaimChecked}
                onClick={this.handleAbandonClaimCheckboxClicked.bind(this)}
              />{" "}
              {__("Abandon the claim for this URI")}
            </label>
          </section>}
      </Modal>
    );
  }
}

export default ModalRemoveFile;
