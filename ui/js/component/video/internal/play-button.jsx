import React from "react";
import FilePrice from "component/filePrice";
import Link from "component/link";
import Modal from "component/modal";

class VideoPlayButton extends React.PureComponent {
  onPurchaseConfirmed() {
    this.props.closeModal();
    this.props.startPlaying();
    this.props.loadVideo(this.props.uri);
  }

  onWatchClick() {
    this.props.purchaseUri(this.props.uri).then(() => {
      if (!this.props.modal) {
        this.props.startPlaying();
      }
    });
  }

  render() {
    const {
      button,
      label,
      metadata,
      metadata: { title },
      uri,
      modal,
      closeModal,
      isLoading,
      costInfo,
      fileInfo,
      mediaType,
    } = this.props;

    /*
     title={
     isLoading ? "Video is Loading" :
     !costInfo ? "Waiting on cost info..." :
     fileInfo === undefined ? "Waiting on file info..." : ""
     }
     */

    const disabled =
      isLoading ||
      fileInfo === undefined ||
      (fileInfo === null && (!costInfo || costInfo.cost === undefined));
    const icon = ["audio", "video"].indexOf(mediaType) !== -1
      ? "icon-play"
      : "icon-folder-o";

    return (
      <div>
        <Link
          button={button ? button : null}
          disabled={disabled}
          label={label ? label : ""}
          className="video__play-button"
          icon={icon}
          onClick={this.onWatchClick.bind(this)}
        />
        <Modal
          contentLabel={__("Not enough credits")}
          isOpen={modal == "notEnoughCredits"}
          onConfirmed={closeModal}
        >
          {__("You don't have enough LBRY credits to pay for this stream.")}
        </Modal>
        <Modal
          type="confirm"
          isOpen={modal == "affirmPurchaseAndPlay"}
          contentLabel={__("Confirm Purchase")}
          onConfirmed={this.onPurchaseConfirmed.bind(this)}
          onAborted={closeModal}
        >
          {__("This will purchase")} <strong>{title}</strong> {__("for")}
          {" "}<strong><FilePrice uri={uri} look="plain" /></strong>
          {" "}{__("credits")}.
        </Modal>
        <Modal
          isOpen={modal == "timedOut"}
          onConfirmed={closeModal}
          contentLabel={__("Timed Out")}
        >
          {__("Sorry, your download timed out :(")}
        </Modal>
      </div>
    );
  }
}

export default VideoPlayButton;
