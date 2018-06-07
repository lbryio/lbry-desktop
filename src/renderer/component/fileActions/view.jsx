// @flow
import React from 'react';
import Button from 'component/button';
import { MODALS } from 'lbry-redux';
import classnames from 'classnames';
import * as icons from 'constants/icons';

type FileInfo = {
  claim_id: string,
};

type Props = {
  uri: string,
  claimId: string,
  openModal: ({ id: string }, { uri: string }) => void,
  claimIsMine: boolean,
  fileInfo: FileInfo,
  vertical?: boolean, // should the buttons be stacked vertically?
};

class FileActions extends React.PureComponent<Props> {
  render() {
    const { fileInfo, uri, openModal, claimIsMine, vertical, claimId } = this.props;
    const showDelete = fileInfo && Object.keys(fileInfo).length > 0;

    return (
      <section className={classnames('card__actions', { 'card__actions--vertical': vertical })}>
        {showDelete && (
          <Button
            button="alt"
            icon={icons.TRASH}
            iconColor="red"
            label={__('Delete')}
            onClick={() => openModal({ id: MODALS.CONFIRM_FILE_REMOVE }, { uri })}
          />
        )}
        {!claimIsMine && (
          <Button
            button="alt"
            icon={icons.REPORT}
            href={`https://lbry.io/dmca?claim_id=${claimId}`}
            label={__('Report content')}
          />
        )}
      </section>
    );
  }
}

export default FileActions;
