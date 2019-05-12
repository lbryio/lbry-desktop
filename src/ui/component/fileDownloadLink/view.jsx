// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import React from 'react';
import Button from 'component/button';
import ToolTip from 'component/common/tooltip';
import analytics from 'analytics';

type Props = {
  claim: StreamClaim,
  uri: string,
  downloading: boolean,
  fileInfo: ?{
    written_bytes: number,
    total_bytes: number,
    outpoint: number,
    download_path: string,
    completed: boolean,
    status: string,
  },
  loading: boolean,
  costInfo: ?{},
  restartDownload: (string, number) => void,
  openModal: (id: string, { path: string }) => void,
  purchaseUri: string => void,
  pause: () => void,
};

class FileDownloadLink extends React.PureComponent<Props> {
  componentDidMount() {
    const { fileInfo, uri, restartDownload } = this.props;
    if (
      fileInfo &&
      !fileInfo.completed &&
      fileInfo.status === 'running' &&
      fileInfo.written_bytes !== false &&
      fileInfo.written_bytes < fileInfo.total_bytes
    ) {
      // This calls file list to show the percentage
      restartDownload(uri, fileInfo.outpoint);
    }
  }

  uri: ?string;

  render() {
    const { fileInfo, downloading, uri, openModal, purchaseUri, costInfo, loading, pause, claim } = this.props;

    if (loading || downloading) {
      const progress = fileInfo && fileInfo.written_bytes ? (fileInfo.written_bytes / fileInfo.total_bytes) * 100 : 0;
      const label = fileInfo ? __('Downloading: ') + progress.toFixed(0) + __('% complete') : __('Connecting...');

      return <span className="file-download">{label}</span>;
    } else if ((fileInfo === null && !downloading) || (fileInfo && !fileInfo.download_path)) {
      if (!costInfo) {
        return null;
      }

      return (
        <ToolTip onComponent body={__('Download')}>
          <Button
            button="alt"
            icon={ICONS.DOWNLOAD}
            iconColor="green"
            onClick={() => {
              purchaseUri(uri);

              const { name, claim_id: claimId, nout, txid } = claim;
              // // ideally outpoint would exist inside of claim information
              // // we can use it after https://github.com/lbryio/lbry/issues/1306 is addressed
              const outpoint = `${txid}:${nout}`;
              analytics.apiLogView(`${name}#${claimId}`, outpoint, claimId);
            }}
          />
        </ToolTip>
      );
    } else if (fileInfo && fileInfo.download_path) {
      return (
        <ToolTip onComponent body={__('Open file')}>
          <Button
            button="alt"
            iconColor="green"
            icon={ICONS.EXTERNAL}
            onClick={
              () => {
                pause();
                openModal(MODALS.CONFIRM_EXTERNAL_RESOURCE, { path: fileInfo.download_path });
              }
            }
          />
        </ToolTip>
      );
    }

    return null;
  }
}

export default FileDownloadLink;
