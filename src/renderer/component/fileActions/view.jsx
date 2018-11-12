// @flow
import * as React from 'react';
import Button from 'component/button';
import { MODALS } from 'lbry-redux';
import * as icons from 'constants/icons';
import Tooltip from 'component/common/tooltip';

type FileInfo = {
  claim_id: string,
};

type Props = {
  uri: string,
  claimId: string,
  openModal: ({ id: string }, { uri: string }) => void,
  claimIsMine: boolean,
  fileInfo: FileInfo,
};

class FileActions extends React.PureComponent<Props> {
  render() {
    const { fileInfo, uri, openModal, claimIsMine, claimId } = this.props;
    const showDelete = fileInfo && Object.keys(fileInfo).length > 0;

    return (
      <React.Fragment>
        {showDelete && (
          <Tooltip onComponent body={__('Delete this file')}>
            <Button
              button="alt"
              icon={icons.TRASH}
              description={__('Delete')}
              onClick={() => openModal({ id: MODALS.CONFIRM_FILE_REMOVE }, { uri })}
            />
          </Tooltip>
        )}
        {!claimIsMine && (
          <Tooltip onComponent body={__('Report content')}>
            <Button
              button="alt"
              icon={icons.REPORT}
              href={`https://lbry.io/dmca?claim_id=${claimId}`}
            />
          </Tooltip>
        )}
      </React.Fragment>
    );
  }
}

export default FileActions;
