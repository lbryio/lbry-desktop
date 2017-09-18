import React from "react";
import { Icon, BusyMessage } from "component/common";
import Link from "component/link";

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
    } = this.props;

    if (loading || downloading) {
      const progress = fileInfo && fileInfo.written_bytes
        ? fileInfo.written_bytes / fileInfo.total_bytes * 100
        : 0,
        label = fileInfo
          ? progress.toFixed(0) + __("% complete")
          : __("Connecting..."),
        labelWithIcon = (
          <span className="button__content">
            <Icon icon="icon-download" />
            <span>
              {label}
            </span>
          </span>
        );

      return (
        <div className="faux-button-block file-download button-set-item">
          <div
            className="faux-button-block file-download__overlay"
            style={{ width: progress + "%" }}
          >
            {labelWithIcon}
          </div>
          {labelWithIcon}
        </div>
      );
    } else if (fileInfo === null && !downloading) {
      if (!costInfo) {
        return <BusyMessage message={__("Fetching cost info")} />;
      } else {
        return (
          <Link
            button="text"
            label={__("Download")}
            icon="icon-download"
            onClick={() => {
              purchaseUri(uri);
            }}
          />
        );
      }
    } else if (fileInfo && fileInfo.download_path) {
      return (
        <Link
          label={__("Open")}
          button="text"
          icon="icon-external-link-square"
          onClick={() => openInShell(fileInfo)}
        />
      );
    }

    return null;
  }
}

export default FileDownloadLink;
