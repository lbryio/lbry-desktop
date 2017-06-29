import React from "react";
import { Icon, BusyMessage } from "component/common";
import FilePrice from "component/filePrice";
import { Modal } from "component/modal";
import { FormField } from "component/form";
import Link from "component/link";
import { ToolTip } from "component/tooltip";
import { DropDownMenu, DropDownMenuItem } from "component/menu";

class FileActions extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      forceShowActions: false,
      deleteChecked: false,
      abandonClaimChecked: false,
    };
  }

  componentWillMount() {
    this.checkAvailability(this.props.uri);
  }

  componentWillReceiveProps(nextProps) {
    this.checkAvailability(nextProps.uri);
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

  onAffirmPurchase() {
    this.props.closeModal();
    this.props.loadVideo(this.props.uri);
  }

  render() {
    const {
      fileInfo,
      isAvailable,
      platform,
      downloading,
      uri,
      deleteFile,
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

    const deleteChecked = this.state.deleteChecked,
      abandonClaimChecked = this.state.abandonClaimChecked,
      metadata = fileInfo ? fileInfo.metadata : null,
      openInFolderMessage = platform.startsWith("Mac")
        ? __("Open in Finder")
        : __("Open in Folder"),
      showMenu = fileInfo && Object.keys(fileInfo).length > 0,
      title = metadata ? metadata.title : uri;

    let content;

    if (loading || downloading) {
      const progress =
          fileInfo && fileInfo.written_bytes
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
                onClick={() => openModal("confirmRemove")}
                label={__("Remove...")}
              />
            </DropDownMenu>
          : ""}
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
          isOpen={modal == "notEnoughCredits"}
          contentLabel={__("Not enough credits")}
          onConfirmed={closeModal}
        >
          {__("You don't have enough LBRY credits to pay for this stream.")}
        </Modal>
        <Modal
          isOpen={modal == "timedOut"}
          contentLabel={__("Download failed")}
          onConfirmed={closeModal}
        >
          {__("LBRY was unable to download the stream")} <strong>{uri}</strong>.
        </Modal>
        <Modal
          isOpen={modal == "confirmRemove"}
          contentLabel={__("Not enough credits")}
          type="confirm"
          confirmButtonLabel={__("Remove")}
          onConfirmed={() =>
            deleteFile(fileInfo.outpoint, deleteChecked, abandonClaimChecked)}
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
      </section>
    );
  }
}

export default FileActions;
