// @flow
import React from 'react';
import Button from 'component/button';
import * as icons from 'constants/icons';
import ToolTip from 'component/common/tooltip';
import analytics from 'analytics';
import type { Claim } from 'types/claim';
import type { FileInfo } from 'types/file_info';
import { calculateDownloadProgress } from 'util/file_info';

type Props = {
  claim: Claim,
  uri: string,
  downloading: boolean,
  fileInfo: FileInfo,
  loading: boolean,
  costInfo: ?{},
  restartDownload: (string, string) => void,
  openInShell: string => void,
  purchaseUri: string => void,
  pause: () => void,
};

class FileDownloadLink extends React.PureComponent<Props> {
  componentWillUpdate() {
    const { downloading, fileInfo, uri, restartDownload } = this.props;
    if (
      !downloading &&
      fileInfo &&
      !fileInfo.completed &&
      fileInfo.written_bytes !== false &&
      fileInfo.written_bytes < fileInfo.total_bytes
    ) {
      restartDownload(uri, fileInfo.outpoint);
    }
  }

  uri: ?string;

  render() {
    const {
      fileInfo,
      downloading,
      uri,
      openInShell,
      purchaseUri,
      costInfo,
      loading,
      pause,
      claim,
    } = this.props;

    const openFile = () => {
      if (fileInfo) {
        openInShell(fileInfo.download_path);
        pause();
      }
    };

    if (loading || downloading) {
      const progress = fileInfo ? calculateDownloadProgress(fileInfo) : 0;
      const label = fileInfo
        ? __('Downloading: ') + progress.toFixed(0) + __('% complete')
        : __('Connecting...');

      return <span className="file-download">{label}</span>;
    } else if (fileInfo === null && !downloading) {
      if (!costInfo) {
        return null;
      }

      return (
        <ToolTip onComponent body={__('Download')}>
          <Button
            button="alt"
            icon={icons.DOWNLOAD}
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
          <Button button="alt" iconColor="green" icon={icons.LOCAL} onClick={() => openFile()} />
        </ToolTip>
      );
    }

    return null;
  }
}

export default FileDownloadLink;
