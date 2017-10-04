import React from "react";
import Link from "component/link";
import FileDownloadLink from "component/fileDownloadLink";
import * as modals from "constants/modal_types";

class FileActions extends React.PureComponent {
  render() {
    const { fileInfo, uri, openModal, claimIsMine } = this.props;

    const claimId = fileInfo ? fileInfo.claim_id : null,
      showDelete = fileInfo && Object.keys(fileInfo).length > 0;

    const canEdit = fileInfo && claimIsMine;

    return (
      <section className="card__actions">
        {claimIsMine &&
          <Link
            button="text"
            icon="icon-edit"
            label={canEdit ? __("Edit") : __("Updating...")}
            disabled={!canEdit}
            navigate="/publish"
            navigateParams={{ id: claimId, uri }}
          />}
        <FileDownloadLink uri={uri} />
        <Link
          button="text"
          icon="icon-gift"
          label={__("Support")}
          navigate="/show"
          navigateParams={{ uri, tab: "tip" }}
        />
        {showDelete &&
          <Link
            button="text"
            icon="icon-trash"
            label={__("Remove")}
            className="card__action--right"
            onClick={() => openModal(modals.CONFIRM_FILE_REMOVE, { uri })}
          />}
      </section>
    );
  }
}

export default FileActions;
