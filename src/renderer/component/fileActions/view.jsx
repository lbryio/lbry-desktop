// @flow
import React from 'react';
import Button from 'component/link';
import FileDownloadLink from 'component/fileDownloadLink';
import * as modals from 'constants/modal_types';
import classnames from 'classnames';

type FileInfo = {
  claim_id: string,
};

type Props = {
  uri: string,
  openModal: (string, any) => void,
  claimIsMine: boolean,
  fileInfo: FileInfo,
  vertical?: boolean, // should the buttons be stacked vertically?
};

class FileActions extends React.PureComponent<Props> {
  render() {
    const { fileInfo, uri, openModal, claimIsMine, vertical } = this.props;

    const claimId = fileInfo ? fileInfo.claim_id : '';
    const showDelete = fileInfo && Object.keys(fileInfo).length > 0;

    return (
      <section className={classnames('card__actions', { 'card__actions--vertical': vertical })}>
        <FileDownloadLink uri={uri} />
        {claimIsMine && (
          <Button
            icon="Edit3"
            className="btn--file-actions"
            description={__('Edit')}
            navigate="/publish"
            navigateParams={{ id: claimId }}
          />
        )}
        {showDelete && (
          <Button
            className="btn--file-actions"
            icon="Trash"
            description={__('Delete')}
            onClick={() => openModal(modals.CONFIRM_FILE_REMOVE, { uri })}
          />
        )}
        {!claimIsMine && (
          <Button
            className="btn--file-actions"
            icon="Flag"
            href={`https://lbry.io/dmca?claim_id=${claimId}`}
            description={__('Report content')}
          />
        )}
      </section>
    );
  }
}

export default FileActions;
