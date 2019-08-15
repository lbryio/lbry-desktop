// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import React from 'react';
import Button from 'component/button';
import ToolTip from 'component/common/tooltip';

type Props = {
  uri: string,
  claimIsMine: boolean,
  downloading: boolean,
  loading: boolean,
  isStreamable: boolean,
  fileInfo: ?FileListItem,
  openModal: (id: string, { path: string }) => void,
  pause: () => void,
  download: string => void,
};

function FileDownloadLink(props: Props) {
  const { fileInfo, downloading, loading, openModal, pause, claimIsMine, download, uri } = props;

  if (downloading || loading) {
    const progress = fileInfo && fileInfo.written_bytes > 0 ? (fileInfo.written_bytes / fileInfo.total_bytes) * 100 : 0;
    const label =
      fileInfo && fileInfo.written_bytes > 0 ? progress.toFixed(0) + __('% downloaded') : __('Connecting...');

    return <span>{label}</span>;
  }

  if (fileInfo && fileInfo.download_path && fileInfo.completed) {
    return (
      <ToolTip label={__('Open file')}>
        <Button
          button="link"
          icon={ICONS.EXTERNAL}
          onClick={() => {
            pause();
            openModal(MODALS.CONFIRM_EXTERNAL_RESOURCE, { path: fileInfo.download_path, isMine: claimIsMine });
          }}
        />
      </ToolTip>
    );
  } else {
    return (
      <ToolTip label={__('Add to your library')}>
        <Button
          button="link"
          icon={ICONS.DOWNLOAD}
          onClick={() => {
            download(uri);
          }}
        />
      </ToolTip>
    );
  }
}

export default FileDownloadLink;
