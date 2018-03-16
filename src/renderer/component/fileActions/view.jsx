import React from 'react';
import Link from 'component/link';
import FileDownloadLink from 'component/fileDownloadLink';
import * as modals from 'constants/modal_types';

class FileActions extends React.PureComponent {
  render() {
    const { fileInfo, uri, openModal, claimIsMine } = this.props;

    const claimId = fileInfo ? fileInfo.claim_id : null,
      showDelete = fileInfo && Object.keys(fileInfo).length > 0;
    
    const speechSharable = fileInfo.mime_type ? ["video", "image"].includes(fileInfo.mime_type.split("/")[0]) : false;

    console.log("fileInfo:", fileInfo);
    console.log("uri:", uri);

    return (
      <section className="card__actions">
        <FileDownloadLink uri={uri} />
        {showDelete && (
          <Link
            button="text"
            icon="icon-trash"
            label={__('Remove')}
            className="no-underline"
            onClick={() => openModal(modals.CONFIRM_FILE_REMOVE, { uri })}
          />
        )}
        {!claimIsMine && (
          <Link
            button="text"
            icon="icon-flag"
            href={`https://lbry.io/dmca?claim_id=${claimId}`}
            className="no-underline"
            label={__('report')}
          />
        )}
        {speechSharable && (
          <Link
            button="text"
            iconRight="icon-globe"
            href={`https://spee.ch/${fileInfo.claim_name}#${claimId}`}
            className="no-underline"
            label={__('View on Web')}
          />
        )}
        <Link
          button="primary"
          icon="icon-gift"
          label={__('Support')}
          navigate="/show"
          className="card__action--right"
          navigateParams={{ uri, tab: 'tip' }}
        />
        {claimIsMine && (
          <Link
            button="alt"
            icon="icon-edit"
            label={__('Edit')}
            navigate="/publish"
            className="card__action--right"
            navigateParams={{ id: claimId }}
          />
        )}
      </section>
    );
  }
}

export default FileActions;
