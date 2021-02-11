// @flow
import React from 'react';
import Card from 'component/common/card';
import ErrorText from 'component/common/error-text';
import * as MODALS from 'constants/modal_types';

type Props = {
  source: string,
  fileInfo: ?FileListItem,
  openModal: (id: string, { path: string }) => void,
  claimIsMine: boolean,
};

function ImageViewer(props: Props) {
  const { source, fileInfo, openModal, claimIsMine } = props;
  const [loadingError, setLoadingError] = React.useState(false);

  return (
    <React.Fragment>
      {loadingError && (
        <Card
          title={__('Error displaying image')}
          actions={<ErrorText>There was an error displaying the image. You may still download it.</ErrorText>}
        />
      )}
      {!loadingError && (
        <div className="file-viewer">
          <img
            src={source}
            onError={() => setLoadingError(true)}
            onClick={() => {
              openModal(MODALS.CONFIRM_EXTERNAL_RESOURCE, {
                path: (fileInfo && fileInfo.download_path) || '',
                isMine: claimIsMine,
              });
            }}
          />
        </div>
      )}
    </React.Fragment>
  );
}

export default ImageViewer;
