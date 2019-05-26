// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import Button from 'component/button';
import Tooltip from 'component/common/tooltip';

type FileInfo = {
  claim_id: string,
};

type Props = {
  uri: string,
  claimId: string,
  openModal: (id: string, { uri: string }) => void,
  claimIsMine: boolean,
  fileInfo: FileInfo,
  showFullscreen: boolean,
};

class FileActions extends React.PureComponent<Props> {
  MaximizeViewer() {
    // Get viewer container
    const viewer = document.getElementsByClassName('content__embedded')[0];
    viewer.webkitRequestFullscreen();
  }

  render() {
    const { fileInfo, uri, openModal, claimIsMine, claimId, showFullscreen } = this.props;
    const showDelete = claimIsMine || (fileInfo && Object.keys(fileInfo).length > 0);

    return (
      <React.Fragment>
        {showFullscreen && (
          <Tooltip onComponent body={__('Full screen (f)')}>
            <Button
              button="alt"
              description={__('Fullscreen')}
              icon={ICONS.FULLSCREEN}
              onClick={() => {
                this.MaximizeViewer();
              }}
            />
          </Tooltip>
        )}
        {showDelete && (
          <Tooltip onComponent body={__('Delete this file')}>
            <Button
              button="alt"
              icon={ICONS.DELETE}
              description={__('Delete')}
              onClick={() => openModal(MODALS.CONFIRM_FILE_REMOVE, { uri })}
            />
          </Tooltip>
        )}
        {!claimIsMine && (
          <Tooltip onComponent body={__('Report content')}>
            <Button icon={ICONS.REPORT} href={`https://lbry.com/dmca?claim_id=${claimId}`} />
          </Tooltip>
        )}
      </React.Fragment>
    );
  }
}

export default FileActions;
