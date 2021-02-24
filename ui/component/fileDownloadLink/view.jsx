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
  download: (string) => void,
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
    buttonType,
    showLabel = false,
    hideOpenButton = false,
    hideDownloadStatus = false,
    streamingUrl,
  } = props;

  const [didClickDownloadButton, setDidClickDownloadButton] = useState(false);
  const fileName = claim && claim.value && claim.value.source && claim.value.source.name;

  // @if TARGET='web'
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
  }, [streamingUrl, didClickDownloadButton, fileName]);
  // @endif

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
    if (hideDownloadStatus) {
      return null;
    }

    if (fileInfo && fileInfo.written_bytes > 0) {
      const progress = (fileInfo.written_bytes / fileInfo.total_bytes) * 100;
      return <span className="download-text">{__('%percent%% downloaded', { percent: progress.toFixed(0) })}</span>;
    } else {
      return <span className="download-text">{__('Connecting...')}</span>;
    }
  }
  // @endif

  if (fileInfo && fileInfo.download_path && fileInfo.completed) {
    const openLabel = __('Open file');
    return hideOpenButton ? null : (
      <Button
        button={buttonType}
        className={buttonType ? undefined : 'button--file-action'}
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
      className={buttonType ? undefined : 'button--file-action'}
      title={label}
      icon={ICONS.DOWNLOAD}
      label={showLabel ? label : null}
      onClick={handleDownload}
    />
  );
}

export default FileDownloadLink;
