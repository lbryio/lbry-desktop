// @flow
import React from 'react';
import Button from 'component/button';
import FileDownloadLink from 'component/fileDownloadLink';
import * as modals from 'constants/modal_types';
import * as icons from 'constants/icons';

type FileInfo = {
  claim_id: string,
};

type Props = {
  uri: string,
  openModal: ({ id: string }, { uri: string }) => void,
  claimIsMine: boolean,
  fileInfo: FileInfo,
};

class FileActions extends React.PureComponent<Props> {
  render() {
    const { fileInfo, uri, openModal, claimIsMine } = this.props;

    const claimId = fileInfo ? fileInfo.claim_id : '';
    const showDelete = fileInfo && Object.keys(fileInfo).length > 0;

    return (
      <section className="card__actions file__actions">
        <FileDownloadLink uri={uri} />
        {showDelete && (
          <Button
            button="alt"
            className="btn--file-actions"
            icon={icons.TRASH}
            description={__('Delete')}
            onClick={() => openModal({ id: modals.CONFIRM_FILE_REMOVE }, { uri })}
          />
        )}
        {!claimIsMine && (
          <Button
            button="alt"
            className="btn--file-actions"
            icon={icons.REPORT}
            href={`https://lbry.io/dmca?claim_id=${claimId}`}
            description={__('Report content')}
          />
        )}
      </section>
    );
  }
}

export default FileActions;
