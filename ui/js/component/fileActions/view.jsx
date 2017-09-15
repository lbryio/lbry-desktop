import React from "react";
import Link from "component/link";
import FileDownloadLink from "component/fileDownloadLink";
import * as modals from "constants/modal_types";

class FileActions extends React.PureComponent {
  handleSupportButtonClicked() {
    this.props.onTipShow();
  }

  render() {
    const { fileInfo, uri, openModal, claimIsMine, editClaim } = this.props;

    const name = fileInfo ? fileInfo.name : null;
    const channel = fileInfo ? fileInfo.channel_name : null;

    const metadata = fileInfo ? fileInfo.metadata : null,
      showMenu = fileInfo && Object.keys(fileInfo).length > 0,
      title = metadata ? metadata.title : uri;

    return (
      <section className="card__actions">
        {claimIsMine &&
          <Link
            button="text"
            icon="icon-edit"
            label={__("Edit")}
            onClick={() => editClaim({ name, channel })}
          />}
        <FileDownloadLink uri={uri} />
        <Link
          button="text"
          icon="icon-gift"
          label={__("Support")}
          onClick={this.handleSupportButtonClicked.bind(this)}
        />
        <Link
          button="text"
          icon="icon-trash"
          label={__("Remove")}
          className="card__action--right"
          onClick={() => openModal(modals.CONFIRM_FILE_REMOVE, { uri })}
        />
      </section>
    );
  }
}

export default FileActions;
