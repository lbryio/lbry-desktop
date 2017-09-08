import React from "react";
import Link from "component/link";
import FileDownloadLink from "component/fileDownloadLink";
import { DropDownMenu, DropDownMenuItem } from "component/menu";
import * as modals from "constants/modal_types";

class FileActions extends React.PureComponent {
  handleSupportButtonClicked() {
    this.props.onTipShow();
  }

  render() {
    const {
      fileInfo,
      platform,
      uri,
      openInFolder,
      openModal,
      claimIsMine,
      editClaim,
    } = this.props;

    const name = fileInfo ? fileInfo.name : null;
    const channel = fileInfo ? fileInfo.channel_name : null;

    const metadata = fileInfo ? fileInfo.metadata : null,
      openInFolderMessage = platform.startsWith("Mac")
        ? __("Open in Finder")
        : __("Open in Folder"),
      showMenu = fileInfo && Object.keys(fileInfo).length > 0,
      title = metadata ? metadata.title : uri;

    return (
      <section className="file-actions">
        <FileDownloadLink uri={uri} />
        <Link
          label={__("Support")}
          button="text"
          icon="icon-gift"
          onClick={this.handleSupportButtonClicked.bind(this)}
        />
        {showMenu
          ? <div className="button-set-item">
              <DropDownMenu>
                <DropDownMenuItem
                  key={0}
                  onClick={() => openInFolder(fileInfo)}
                  label={openInFolderMessage}
                />
                {claimIsMine &&
                  <DropDownMenuItem
                    key={1}
                    onClick={() => editClaim({ name, channel })}
                    label={__("Edit claim")}
                  />}
                <DropDownMenuItem
                  key={2}
                  onClick={() => openModal(modals.CONFIRM_FILE_REMOVE, { uri })}
                  label={__("Remove...")}
                />
              </DropDownMenu>
            </div>
          : ""}

      </section>
    );
  }
}

export default FileActions;
