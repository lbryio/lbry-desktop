// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import React from 'react';
import Button from 'component/button';
import ToolTip from 'component/common/tooltip';
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
};

function FileDownloadLink(props: Props) {
  const { fileInfo, downloading, loading, openModal, pause, claimIsMine, download, uri, claim } = props;
  const { name, claim_id: claimId, value } = claim;
  const fileName = value && value.source && value.source.name;
  const downloadUrl = generateDownloadUrl(name, claimId, undefined, true);

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
          button="alt"
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
      <ToolTip label={IS_WEB ? __('Download') : __('Add to your library')}>
        <Button
          button="alt"
          icon={ICONS.DOWNLOAD}
          // @if TARGET='app'
          onClick={() => download(uri)}
          // @endif
          // @if TARGET='web'
          download={fileName}
          href={downloadUrl}
          // @endif
        />
      </ToolTip>
    );
  }
}

export default FileDownloadLink;
