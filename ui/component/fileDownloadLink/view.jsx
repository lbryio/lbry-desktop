// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import React, { useState } from 'react';
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
  triggerAnalyticsView: (string, number) => void,
};

function FileDownloadLink(props: Props) {
  const [shouldTrigger, setShouldTrigger] = useState(false);
  const { fileInfo, downloading, loading, openModal, pause, claimIsMine, download, uri, triggerAnalyticsView } = props;

  if (downloading || loading) {
    if (!shouldTrigger) {
      setShouldTrigger(true);
    }
    const progress = fileInfo && fileInfo.written_bytes > 0 ? (fileInfo.written_bytes / fileInfo.total_bytes) * 100 : 0;
    const label =
      fileInfo && fileInfo.written_bytes > 0 ? progress.toFixed(0) + __('% downloaded') : __('Connecting...');

    return <span>{label}</span>;
  }

  if (fileInfo && fileInfo.download_path && fileInfo.completed && shouldTrigger) {
    triggerAnalyticsView(uri, 0);
    setShouldTrigger(false);
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
