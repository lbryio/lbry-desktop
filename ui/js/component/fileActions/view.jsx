import React from "react";
import Link from "component/link";
import FileDownloadLink from "component/fileDownloadLink";
import * as modals from "constants/modal_types";

class FileActions extends React.PureComponent {
  render() {
    const { fileInfo, uri, openModal, claimIsMine } = this.props;

    const claimId = fileInfo ? fileInfo.claim_id : null,
      showDelete = fileInfo && Object.keys(fileInfo).length > 0;

    return (
      <section className="card__actions">
        {claimIsMine &&
          <Link
            button="text"
            icon="icon-edit"
            label={__("Edit")}
            navigate="/publish"
            className="no-underline"
            navigateParams={{ id: claimId }}
          />}
        <FileDownloadLink uri={uri} />
        <Link
          button="text"
          icon="icon-gift"
          label={__("Support")}
          navigate="/show"
          className="no-underline"
          navigateParams={{ uri, tab: "tip" }}
        />
        <Link
          button="text"
          icon="icon-flag"
          href={`https://lbry.io/dmca?claim_id=${claimId}`}
          className="card__action--right no-underline"
          label={__("report")}
        />
        {showDelete &&
          <Link
            button="text"
            icon="icon-trash"
            label={__("Remove")}
            className="card__action--right no-underline"
            onClick={() => openModal(modals.CONFIRM_FILE_REMOVE, { uri })}
          />}

      </section>
    );
  }
}

export default FileActions;
