import React from "react";
import Link from "component/link";
import FileDownloadLink from "component/fileDownloadLink";
import * as modals from "constants/modal_types";

class FileActions extends React.PureComponent {
  render() {
    const {
      fileInfo,
      uri,
      openModal,
      claimIsMine,
      subscribe,
      claim,
    } = this.props;

    const claimId = fileInfo ? fileInfo.claim_id : null,
      showDelete = fileInfo && Object.keys(fileInfo).length > 0;

    const account = claim.channel_name &&
      claim.value &&
      claim.value.publisherSignature &&
      claim.value.publisherSignature.certificateId
      ? `${claim.channel_name}#${claim.value.publisherSignature.certificateId}`
      : null;

    return (
      <section className="card__actions">
        {claimIsMine &&
          <Link
            button="text"
            icon="icon-edit"
            label={__("Edit")}
            navigate="/publish"
            navigateParams={{ id: claimId }}
          />}
        <FileDownloadLink uri={uri} />
        <Link
          button="text"
          icon="icon-gift"
          label={__("Support")}
          navigate="/show"
          navigateParams={{ uri, tab: "tip" }}
        />
        <Link
          button="text"
          icon="icon-bell"
          label={__("Subscribe")}
          onClick={() => {
            subscribe(account);
          }}
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
