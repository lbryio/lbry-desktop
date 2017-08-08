import React from "react";
import FilePrice from "component/filePrice";
import Link from "component/link";
import Modal from "component/modal";

class VideoPlayButton extends React.PureComponent {
  componentDidMount() {
    this.keyDownListener = this.onKeyDown.bind(this);
    document.addEventListener("keydown", this.keyDownListener);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyDownListener);
  }

  onPurchaseConfirmed() {
    this.props.closeModal();
    this.props.startPlaying();
    this.props.loadVideo(this.props.uri);
  }

  onKeyDown(event) {
    if (
      "input" !== event.target.tagName.toLowerCase() &&
      "Space" === event.code
    ) {
      event.preventDefault();
      this.onWatchClick();
    }
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

    const disabled = isLoading || fileInfo === undefined;
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
          type="confirm"
          isOpen={modal == "affirmPurchaseAndPlay"}
          contentLabel={__("Confirm Purchase")}
          onConfirmed={this.onPurchaseConfirmed.bind(this)}
          onAborted={closeModal}
        >
          {__("This will purchase")} <strong>{title}</strong> {__("for")}{" "}
          <strong>
            <FilePrice uri={uri} look="plain" />
          </strong>{" "}
          {__("credits")}.
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
