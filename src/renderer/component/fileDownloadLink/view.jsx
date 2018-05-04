/* eslint-disable react/prop-types */
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import * as icons from 'constants/icons';

class FileDownloadLink extends React.PureComponent {
  static restartDownload(props) {
    const { downloading, fileInfo, uri, restartDownload } = props;

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

  componentWillMount() {
    this.checkAvailability(this.props.uri);
  }

  componentWillReceiveProps(nextProps) {
    this.checkAvailability(nextProps.uri);
    FileDownloadLink.restartDownload(nextProps);
  }

  checkAvailability(uri) {
    if (!this.thisUri || uri !== this.thisUri) {
      this.thisUri = uri;
      this.props.checkAvailability(uri);
    }
  }

  render() {
    const {
      fileInfo,
      downloading,
      uri,
      openInShell,
      purchaseUri,
      costInfo,
      loading,
      doPause,
    } = this.props;

    const openFile = () => {
      openInShell(fileInfo.download_path);
      doPause();
    };

    if (loading || downloading) {
      const progress =
        fileInfo && fileInfo.written_bytes
          ? fileInfo.written_bytes / fileInfo.total_bytes * 100
          : 0;
      const label = fileInfo ? progress.toFixed(0) + __('% complete') : __('Connecting...');

      return (
        <div className="file-download btn__content">
          <div
            className={classnames('file-download__overlay', {
              btn__content: !!progress,
            })}
          >
            {label}
          </div>
          {label}
        </div>
      );
    } else if (fileInfo === null && !downloading) {
      if (!costInfo) {
        return null;
      }

      return (
        <Button
          button="alt"
          className="btn--file-actions"
          description={__('Download')}
          icon={icons.DOWNLOAD}
          onClick={() => {
            purchaseUri(uri);
          }}
        />
      );
    } else if (fileInfo && fileInfo.download_path) {
      return (
        <Button
          button="alt"
          className="btn--file-actions"
          description={__('Open')}
          icon={icons.OPEN}
          onClick={() => openFile()}
        />
      );
    }

    return null;
  }
}

export default FileDownloadLink;
