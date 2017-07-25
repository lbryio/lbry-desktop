import React from "react";
import { Icon, BusyMessage } from "component/common";
import FilePrice from "component/filePrice";
import { FormField } from "component/form";
import { Modal } from "component/modal";
import Link from "component/link";
import { ToolTip } from "component/tooltip";
import { DropDownMenu, DropDownMenuItem } from "component/menu";
import ModalRemoveFile from "component/modalRemoveFile";
import * as modals from "constants/modal_types";

class FileActions extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      forceShowActions: false,
      showTipBox: false,
      feeAmount: "1.00",
    };
  }

  componentWillMount() {
    this.checkAvailability(this.props.uri);
  }

  componentWillReceiveProps(nextProps) {
    this.checkAvailability(nextProps.uri);
    this.restartDownload(nextProps);
  }

  restartDownload(props) {
    const { downloading, fileInfo, uri, restartDownload } = props;

    if (
      !downloading &&
      fileInfo &&
      !fileInfo.completed &&
      fileInfo.written_bytes !== false &&
      fileInfo.written_bytes < fileInfo.total_bytes
    ) {
      restartDownload(uri, fileInfo.outpoint);
    }
  }

  checkAvailability(uri) {
    if (!this._uri || uri !== this._uri) {
      this._uri = uri;
      this.props.checkAvailability(uri);
    }
  }

  onShowFileActionsRowClicked() {
    this.setState({
      forceShowActions: true,
    });
  }

  onAffirmPurchase() {
    this.props.closeModal();
    this.props.loadVideo(this.props.uri);
  }

  handleTipPublisherButtonClicked() {
    this.setState({
      showTipBox: true,
    });
  }

  handleTipButtonClicked() {
    let address = this.props.claim.address;
    let amount = this.state.feeAmount;

    this.props.setAddress(address);
    this.props.setAmount(amount);
    this.props.sendToAddress();

    this.setState({
      showTipBox: false,
    });
  }

  handleTipCancelButtonClicked() {
    this.setState({
      showTipBox: false,
    });
  }

  handleFeeAmountChange(event) {
    this.setState({
      feeAmount: event.target.value,
    });
  }

  render() {
    const {
      fileInfo,
      isAvailable,
      platform,
      downloading,
      uri,
      openInFolder,
      openInShell,
      modal,
      openModal,
      closeModal,
      startDownload,
      costInfo,
      loading,
      claimIsMine,
    } = this.props;

    const { showTipBox } = this.state;

    const metadata = fileInfo ? fileInfo.metadata : null,
      openInFolderMessage = platform.startsWith("Mac")
        ? __("Open in Finder")
        : __("Open in Folder"),
      showMenu = fileInfo && Object.keys(fileInfo).length > 0,
      title = metadata ? metadata.title : uri;

    let content;
    let tipLink = (
      <Link
        label={__("Tip Publisher")}
        button="text"
        icon="icon-gift"
        onClick={this.handleTipPublisherButtonClicked.bind(this)}
      />
    );

    let tipBox = (
      <span>
        <FormField
          type="number"
          className="form-field__input--inline"
          step="0.1"
          placeholder="1.00"
          defaultValue="1.00"
          min="0.01"
          postfix={__("LBC")}
          onChange={event => this.handleFeeAmountChange(event)}
        />
        {__("  ")}
        <Link
          label={__("Tip")}
          button="primary"
          onClick={this.handleTipButtonClicked.bind(this)}
        />
        <Link
          label={__("Cancel")}
          button="alt"
          onClick={this.handleTipCancelButtonClicked.bind(this)}
        />
      </span>
    );

    if (loading || downloading) {
      const progress = fileInfo && fileInfo.written_bytes
        ? fileInfo.written_bytes / fileInfo.total_bytes * 100
        : 0,
        label = fileInfo
          ? progress.toFixed(0) + __("% complete")
          : __("Connecting..."),
        labelWithIcon = (
          <span className="button__content">
            <Icon icon="icon-download" />
            <span>
              {label}
            </span>
          </span>
        );

      content = (
        <div className="faux-button-block file-actions__download-status-bar button-set-item">
          <div
            className="faux-button-block file-actions__download-status-bar-overlay"
            style={{ width: progress + "%" }}
          >
            {labelWithIcon}
          </div>
          {labelWithIcon}
        </div>
      );
    } else if (!fileInfo && isAvailable === undefined) {
      content = <BusyMessage message={__("Checking availability")} />;
    } else if (!fileInfo && !isAvailable && !this.state.forceShowActions) {
      content = (
        <div>
          <div className="button-set-item empty">
            {__("Content unavailable.")}
          </div>
          <ToolTip
            label={__("Why?")}
            body={__(
              "The content on LBRY is hosted by its users. It appears there are no users connected that have this file at the moment."
            )}
            className="button-set-item"
          />
          <Link
            label={__("Try Anyway")}
            onClick={this.onShowFileActionsRowClicked.bind(this)}
            className="button-text button-set-item"
          />
        </div>
      );
    } else if (fileInfo === null && !downloading) {
      if (!costInfo) {
        content = <BusyMessage message={__("Fetching cost info")} />;
      } else {
        content = (
          <Link
            button="text"
            label={__("Download")}
            icon="icon-download"
            onClick={() => {
              startDownload(uri);
            }}
          />
        );
      }
    } else if (fileInfo && fileInfo.download_path) {
      content = (
        <Link
          label={__("Open")}
          button="text"
          icon="icon-folder-open"
          onClick={() => openInShell(fileInfo)}
        />
      );
    } else if (!fileInfo) {
      content = <BusyMessage message={__("Fetching file info")} />;
    } else {
      console.log("handle this case of file action props?");
    }

    return (
      <section className="file-actions">
        {content}
        {showMenu
          ? <DropDownMenu>
              <DropDownMenuItem
                key={0}
                onClick={() => openInFolder(fileInfo)}
                label={openInFolderMessage}
              />
              <DropDownMenuItem
                key={1}
                onClick={() => openModal(modals.CONFIRM_FILE_REMOVE)}
                label={__("Remove...")}
              />
            </DropDownMenu>
          : ""}
        {showTipBox ? tipBox : tipLink}
        <Modal
          type="confirm"
          isOpen={modal == "affirmPurchase"}
          contentLabel={__("Confirm Purchase")}
          onConfirmed={this.onAffirmPurchase.bind(this)}
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
          contentLabel={__("Download failed")}
          onConfirmed={closeModal}
        >
          {__("LBRY was unable to download the stream")} <strong>{uri}</strong>.
        </Modal>
        {modal == modals.CONFIRM_FILE_REMOVE &&
          <ModalRemoveFile
            uri={uri}
            outpoint={fileInfo.outpoint}
            title={title}
          />}
        {modal == "insufficientBalance" &&
          <Modal
            isOpen={true}
            contentLabel={__("Insufficient balance")}
            onConfirmed={closeModal}
          >
            {__(
              "Insufficient balance: after this transaction you would have less than 1 LBC in your wallet."
            )}
          </Modal>}
        {modal == "transactionSuccessful" &&
          <Modal
            isOpen={true}
            contentLabel={__("Transaction successful")}
            onConfirmed={closeModal}
          >
            {__(
              "The publisher of the content was successfully tipped " +
                this.state.feeAmount +
                " LBC. Mahalo!"
            )}
          </Modal>}
        {modal == "transactionFailed" &&
          <Modal
            isOpen={true}
            contentLabel={__("Transaction failed")}
            onConfirmed={closeModal}
          >
            {__("Something went wrong")}:
          </Modal>}
      </section>
    );
  }
}

export default FileActions;
