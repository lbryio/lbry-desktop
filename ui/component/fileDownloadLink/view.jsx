// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import React, { useState } from 'react';
import Button from 'component/button';
import { generateDownloadUrl } from 'util/lbrytv';

type Props = {
  uri: string,
  claim: StreamClaim,
  claimIsMine: boolean,
  downloading: boolean,
  loading: boolean,
  isStreamable: boolean,
  fileInfo: ?FileListItem,
  openModal: (id: string, { path: string }) => void,
  pause: () => void,
  download: string => void,
  triggerViewEvent: string => void,
  costInfo: ?{ cost: string },
  hideOpenButton: boolean,
  hideDownloadStatus: boolean,
};

function FileDownloadLink(props: Props) {
  const {
    fileInfo,
    downloading,
    loading,
    openModal,
    pause,
    claimIsMine,
    download,
    uri,
    claim,
    triggerViewEvent,
    costInfo,
    hideOpenButton = false,
    hideDownloadStatus = false,
  } = props;

  const [viewEventSent, setViewEventSent] = useState(false);

  const cost = costInfo ? Number(costInfo.cost) : 0;
  const isPaidContent = cost > 0;
  if (!claim || (IS_WEB && isPaidContent)) {
    return null;
  }

  const { name, claim_id: claimId, value } = claim;
  const fileName = value && value.source && value.source.name;
  const downloadUrl = generateDownloadUrl(name, claimId);

  function handleDownload(e) {
    // @if TARGET='app'
    e.preventDefault();
    download(uri);
    // @endif;
    // @if TARGET='web'
    if (!viewEventSent) {
      triggerViewEvent(uri);
    }
    setViewEventSent(true);
    // @endif;
  }

  if (downloading || loading) {
    const progress = fileInfo && fileInfo.written_bytes > 0 ? (fileInfo.written_bytes / fileInfo.total_bytes) * 100 : 0;
    const label =
      fileInfo && fileInfo.written_bytes > 0 ? progress.toFixed(0) + __('% downloaded') : __('Connecting...');

    return hideDownloadStatus ? null : <span className="download-text">{label}</span>;
  }

  if (fileInfo && fileInfo.download_path && fileInfo.completed) {
    return hideOpenButton ? null : (
      <Button
        button="alt"
        title={__('Open file')}
        icon={ICONS.EXTERNAL}
        onClick={() => {
          pause();
          openModal(MODALS.CONFIRM_EXTERNAL_RESOURCE, { path: fileInfo.download_path, isMine: claimIsMine });
        }}
      />
    );
  }

  return (
    <Button
      button="alt"
      title={IS_WEB ? __('Download') : __('Add to your library')}
      icon={ICONS.DOWNLOAD}
      onClick={handleDownload}
      // @if TARGET='web'
      download={fileName}
      href={downloadUrl}
      // @endif
    />
  );
}

export default FileDownloadLink;
