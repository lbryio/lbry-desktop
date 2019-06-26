// @flow
import type { Node } from 'react';
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import Tooltip from 'component/common/tooltip';
import { requestFullscreen, fullscreenElement } from 'util/full-screen';

type FileInfo = {
  claim_id: string,
};

type Props = {
  uri: string,
  claimId: string,
  openModal: (id: string, { uri: string }) => void,
  claimIsMine: boolean,
  fileInfo: FileInfo,
  viewerContainer: ?{ current: Node },
  showFullscreen: boolean,
};

class FileActions extends React.PureComponent<Props> {
  maximizeViewer = () => {
    const { viewerContainer } = this.props;
    const isFullscreen = fullscreenElement();
    // Request fullscreen if viewer is ready
    // And if there is no fullscreen element active
    if (!isFullscreen && viewerContainer && viewerContainer.current !== null) {
      requestFullscreen(viewerContainer.current);
    }
  };

  render() {
    const { fileInfo, uri, openModal, claimIsMine, claimId, showFullscreen } = this.props;
    const showDelete = claimIsMine || (fileInfo && Object.keys(fileInfo).length > 0);

    return (
      <React.Fragment>
        {showFullscreen && (
          <Tooltip label={__('Full screen (f)')}>
            <Button
              button="link"
              description={__('Fullscreen')}
              icon={ICONS.FULLSCREEN}
              onClick={this.maximizeViewer}
            />
          </Tooltip>
        )}
        {showDelete && (
          <Tooltip label={__('Remove from your library')}>
            <Button
              button="link"
              icon={ICONS.DELETE}
              description={__('Delete')}
              onClick={() => openModal(MODALS.CONFIRM_FILE_REMOVE, { uri })}
            />
          </Tooltip>
        )}
        {!claimIsMine && (
          <Tooltip label={__('Report content')}>
            <Button button="link" icon={ICONS.REPORT} href={`https://lbry.com/dmca?claim_id=${claimId}`} />
          </Tooltip>
        )}
      </React.Fragment>
    );
  }
}

export default FileActions;
