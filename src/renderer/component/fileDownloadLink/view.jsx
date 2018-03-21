// I'll come back to this
/* eslint-disable */
import React from 'react';
import { BusyMessage } from 'component/common';
import Icon from 'component/common/icon';
import Link from 'component/link';

class FileDownloadLink extends React.PureComponent {
  componentWillMount() {
    this.checkAvailability(this.props.uri);
  }

  componentWillReceiveProps(nextProps) {
    this.checkAvailability(nextProps.uri);
    this.restartDownload(nextProps);
  }

  restartDownload(props) {
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

  checkAvailability(uri) {
    if (!this._uri || uri !== this._uri) {
      this._uri = uri;
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
            : 0,
        label = fileInfo ? progress.toFixed(0) + __('% complete') : __('Connecting...'),
        labelWithIcon = (
          <span className="button__content">
            <Icon icon="icon-download" />
            <span>{label}</span>
          </span>
        );

      return (
        <div className="faux-button-block file-download button-set-item">
          <div
            className="faux-button-block file-download__overlay"
            style={{ width: `${progress}%` }}
          >
            {labelWithIcon}
          </div>
          {labelWithIcon}
        </div>
      );
    } else if (fileInfo === null && !downloading) {
      if (!costInfo) {
        return <BusyMessage message={__('Fetching cost info')} />;
      }
      return (
        <Link
          label={__('Download')}
          icon="DownloadCloud"
          className="no-underline"
          onClick={() => {
            purchaseUri(uri);
          }}
        />
      );
    } else if (fileInfo && fileInfo.download_path) {
      return <Link label={__('Open')} icon="BookOpen" onClick={() => openFile()} />;
    }

    return null;
  }
}

export default FileDownloadLink;
/* eslint-enable */
