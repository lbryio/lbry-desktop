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
    // showDelete = fileInfo && Object.keys(fileInfo).length > 0;

    const showDelete = true;
    return (
      <section className={classnames('card__actions', { 'card__actions--vertical': vertical })}>
        <FileDownloadLink uri={uri} />
        {showDelete && (
          <Button
            alt
            icon="Trash"
            label={__('Remove')}
            onClick={() => openModal(modals.CONFIRM_FILE_REMOVE, { uri })}
          />
        )}
        {!claimIsMine && (
          <Button
            alt
            icon="Flag"
            href={`https://lbry.io/dmca?claim_id=${claimId}`}
            label={__('Report')}
          />
        )}

        {claimIsMine && (
          <Button
            icon="Edit3"
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
