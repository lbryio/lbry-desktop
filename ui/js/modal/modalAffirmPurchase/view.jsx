import React from "react";
import FilePrice from "component/filePrice";
import { Modal } from "modal/modal";

class ModalAffirmPurchase extends React.PureComponent {
  onAffirmPurchase() {
    this.props.closeModal();
    this.props.loadVideo(this.props.uri);
  }

  render() {
    const { closeModal, metadata: { title }, uri } = this.props;

    return (
      <Modal
        type="confirm"
        isOpen={true}
        contentLabel={__("Confirm Purchase")}
        onConfirmed={this.onAffirmPurchase.bind(this)}
        onAborted={closeModal}
      >
        {__("This will purchase")} <strong>{title}</strong> {__("for")}{" "}
        <strong>
          <FilePrice uri={uri} showFullPrice={true} look="plain" />
        </strong>{" "}
        {__("credits")}.
      </Modal>
    );
  }
}

export default ModalAffirmPurchase;
