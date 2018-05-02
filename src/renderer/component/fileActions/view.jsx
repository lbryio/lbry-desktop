// @flow
import React from 'react';
import Button from 'component/button';
import FileDownloadLink from 'component/fileDownloadLink';
import * as modals from 'constants/modal_types';
import classnames from 'classnames';
import * as icons from 'constants/icons';

type FileInfo = {
  claim_id: string,
};

type Props = {
  uri: string,
  openModal: ({ id: string }, { uri: string }) => void,
  claimIsMine: boolean,
  fileInfo: FileInfo,
  vertical?: boolean, // should the buttons be stacked vertically?,
  navigate: (string, ?{}) => void,
};

class FileActions extends React.PureComponent<Props> {
  render() {
    const { fileInfo, uri, openModal, claimIsMine, vertical, navigate } = this.props;
    const showDelete = fileInfo && Object.keys(fileInfo).length > 0;

    return (
      <section className={classnames('card__actions', { 'card__actions--vertical': vertical })}>
        <FileDownloadLink uri={uri} />
        {showDelete && (
          <Button
            className="btn--file-actions"
            icon={icons.TRASH}
            description={__('Delete')}
            onClick={() => openModal({ id: modals.CONFIRM_FILE_REMOVE }, { uri })}
          />
        )}
        {!claimIsMine && (
          <Button
            className="btn--file-actions"
            icon={icons.REPORT}
            onClick={() => navigate(`/reportcontent`, { uri })}
            description={__('Report content')}
          />
        )}
      </section>
    );
  }
}

export default FileActions;
