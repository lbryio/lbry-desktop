// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import React, { useState } from 'react';
import Button from 'component/button';

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
  costInfo: ?{ cost: string },
  buttonType: ?string,
  showLabel: ?boolean,
  hideOpenButton: boolean,
  hideDownloadStatus: boolean,
  streamingUrl: ?string,
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
    buttonType = 'alt',
    showLabel = false,
    hideOpenButton = false,
    hideDownloadStatus = false,
    streamingUrl,
  } = props;

  const [didClickDownloadButton, setDidClickDownloadButton] = useState(false);
  const { value } = claim;
  const fileName = value && value.source && value.source.name;

  React.useEffect(() => {
    if (didClickDownloadButton && streamingUrl) {
      let element = document.createElement('a');
      element.setAttribute('href', `${streamingUrl}?download=true`);
      element.setAttribute('download', fileName);
      element.style.display = 'none';
      // $FlowFixMe
      document.body.appendChild(element);
      element.click();
      // $FlowFixMe
      document.body.removeChild(element);

      setDidClickDownloadButton(false);
    }
  }, [streamingUrl, didClickDownloadButton]);

  function handleDownload(e) {
    setDidClickDownloadButton(true);
    e.preventDefault();
    download(uri);
  }

  if (!claim) {
    return null;
  }

  // @if TARGET='app'
  if (downloading || loading) {
    const progress = fileInfo && fileInfo.written_bytes > 0 ? (fileInfo.written_bytes / fileInfo.total_bytes) * 100 : 0;
    const label =
      fileInfo && fileInfo.written_bytes > 0 ? progress.toFixed(0) + __('% downloaded') : __('Connecting...');

    return hideDownloadStatus ? null : <span className="download-text">{label}</span>;
  }
  // @endif

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

  const label = __('Download');

  return (
    <Button
      button={buttonType}
      title={label}
      icon={ICONS.DOWNLOAD}
      label={showLabel ? label : null}
      onClick={handleDownload}
    />
  );
}

export default FileDownloadLink;
