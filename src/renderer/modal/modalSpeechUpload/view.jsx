import React from "react";
import { Modal } from "modal/modal";
import FormField from "component/formField/index";

class ModalSpeechUpload extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      nsfw: false,
    };
  }

  handleNsfwCheckboxClicked(event) {
    this.setState({
      nsfw: event.target.checked,
    });
  }

  upload() {
    this.props.beginUpload(this.props.path, this.state.nsfw);
    this.props.closeModal();
  }

  render() {
    const { closeModal } = this.props;
    const { nsfw } = this.state;

    return (
      <Modal
        isOpen={true}
        contentLabel={__("Confirm Thumbnail Upload")}
        type="confirm"
        confirmButtonLabel={__("Upload")}
        onConfirmed={() => this.upload()}
        onAborted={closeModal}
      >
        <p>{`Confirm upload: ${this.props.path}`}</p>

        <section>
          <FormField
            type="checkbox"
            checked={nsfw}
            onClick={this.handleNsfwCheckboxClicked.bind(this)}
            label={__("NSFW")}
          />
        </section>
      </Modal>
    );
  }
}

export default ModalSpeechUpload;
