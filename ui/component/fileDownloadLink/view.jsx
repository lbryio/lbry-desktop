// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import React, { useState } from 'react';
import Button from 'component/button';
import { generateDownloadUrl } from 'util/web';

type Props = {
  uri: string,
  claim: StreamClaim,
  claimIsMine: boolean,
  downloading: boolean,
  loading: boolean,
  fileInfo: ?FileListItem,
  openModal: (id: string, { path: string }) => void,
  pause: () => void,
  download: string => void,
  triggerViewEvent: string => void,
  costInfo: ?{ cost: string },
  buttonType: ?string,
  showLabel: ?boolean,
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
    buttonType = 'alt',
    showLabel = false,
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
    const openLabel = __('Open file');
    return hideOpenButton ? null : (
      <Button
        button={buttonType}
        title={openLabel}
        label={showLabel ? openLabel : null}
        icon={ICONS.EXTERNAL}
        onClick={() => {
          pause();
          openModal(MODALS.CONFIRM_EXTERNAL_RESOURCE, { path: fileInfo.download_path, isMine: claimIsMine });
        }}
      />
    );
  }

  const label = IS_WEB ? __('Download') : __('Download to your Library');

  return (
    <Button
      button={buttonType}
      title={label}
      icon={ICONS.DOWNLOAD}
      label={showLabel ? label : null}
      onClick={handleDownload}
      // @if TARGET='web'
      download={fileName}
      href={downloadUrl}
      // @endif
    />
  );
}

export default FileDownloadLink;
