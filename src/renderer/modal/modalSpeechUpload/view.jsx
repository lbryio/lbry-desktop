import React from "react";
import { Modal } from "modal/modal";
import FormField from "component/formField/index";

class ModalSpeechUpload extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log("ModalSpeechUpload constructor");
  }

  render() {
    const { closeModal, beginUpload, path } = this.props;

    return (
      <Modal
        isOpen={true}
        contentLabel={__("Confirm Thumbnail Upload")}
        type="confirm"
        confirmButtonLabel={__("Upload")}
        onConfirmed={() => beginUpload("haha")}
        onAborted={closeModal}
      >
        <p>{__("Please confirm spee.ch upload.")}</p>
        <p>{this.props.path}</p>
      </Modal>
    );
  }
}

export default ModalSpeechUpload;
