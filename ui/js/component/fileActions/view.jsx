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
      fileInfo.fwritten_bytes < fileInfo.total_bytes
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

  onSupportClaimClicked(event) {
    if (this.state.showSupportClaimForm) {
      return;
    }

    let button;
    let parentCard;
    if ("a" === event.target.tagName.toLowerCase()) {
      button = event.target;
    }

    let parent = event.target.parentElement;
    do {
      if (!button && "a" === parent.tagName.toLowerCase()) {
        button = parent;
      }

      if ("card" === parent.className.trim()) {
        parentCard = parent;
      }
      parent = parent.parentElement;
    } while (parent && !parentCard);

    this.setState({
      showSupportClaimForm: true,
      supportClaimLinkOffset: button && parentCard
        ? button.getBoundingClientRect().left -
            parentCard.getBoundingClientRect().left -
            12 /* left pad + icon */
        : 0,
    });
  }

  sendSupportClaim() {
    this.setState({ supportInProgress: true });
    const { claim, setClaimSupport, claimNewSupport } = this.props;
    setClaimSupport(claim.claim_id, claim.name);
    claimNewSupport();
  }

  onClaimSupportSuccessful() {
    this.setState({
      showSupportClaimForm: false,
    });
    this.onClaimSupportCompleted();
  }

  onClaimSupportCompleted() {
    this.props.closeModal();
    this.setState({ supportInProgress: false });
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
      amount,
      setAmount,
    } = this.props;

    const metadata = fileInfo ? fileInfo.metadata : null,
      openInFolderMessage = platform.startsWith("Mac")
        ? __("Open in Finder")
        : __("Open in Folder"),
      showMenu = fileInfo && Object.keys(fileInfo).length > 0,
      title = metadata ? metadata.title : uri;

    let content;

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
        <Link
          label={__("Support Claim")}
          button="text"
          style={{ position: "relative" }}
          icon="icon-life-ring"
          onClick={this.onSupportClaimClicked.bind(this)}
        />
        {this.state.showSupportClaimForm &&
          <div
            className="file-actions__support_claim"
            style={{ marginLeft: this.state.supportClaimLinkOffset + "px" }}
          >
            <form onSubmit={this.sendSupportClaim.bind(this)}>
              <FormField
                type="number"
                min="0.01"
                placeholder="0.01"
                step="0.01"
                postfix="LBC"
                className="form-field__input--inline"
                onChange={setAmount}
              />
              <div className="file-actions__inline-buttons">
                <Link
                  button="primary"
                  label={__("Confirm")}
                  onClick={this.sendSupportClaim.bind(this)}
                  disabled={
                    !(parseFloat(amount) > 0.0) || this.state.supportInProgress
                  }
                />
                <Link
                  button="cancel"
                  label={__("Cancel")}
                  onClick={() => this.setState({ showSupportClaimForm: false })}
                />
              </div>
            </form>
          </div>}
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
            onConfirmed={this.onClaimSupportCompleted.bind(this)}
          >
            {__(
              "Insufficient balance: after supporting this claim, you would have less than 1 LBC in your wallet."
            )}
          </Modal>}
        {modal == "transactionSuccessful" &&
          <Modal
            isOpen={true}
            contentLabel={__("Transaction successful")}
            onConfirmed={this.onClaimSupportSuccessful.bind(this)}
          >
            {__(
              "Your claim support transaction was successfully placed in the queue."
            )}
          </Modal>}
        {modal == "transactionFailed" &&
          <Modal
            isOpen={true}
            contentLabel={__("Transaction failed")}
            onConfirmed={this.onClaimSupportCompleted.bind(this)}
          >
            {__("Something went wrong")}:
          </Modal>}
      </section>
    );
  }
}

export default FileActions;
