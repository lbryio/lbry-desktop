// @flow
import React from 'react';
import Button from 'component/button';
import * as icons from 'constants/icons';

type Props = {
  uri: string,
  downloading: boolean,
  fileInfo: ?{
    written_bytes: number,
    total_bytes: number,
    outpoint: number,
    download_path: string,
  },
  loading: boolean,
  costInfo: ?{},
  restartDownload: (string, number) => void,
  checkAvailability: string => void,
  openInShell: string => void,
  purchaseUri: string => void,
  doPause: () => void,
};

class FileDownloadLink extends React.PureComponent<Props> {
  componentWillMount() {
    this.checkAvailability(this.props.uri);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.checkAvailability(nextProps.uri);
    this.restartDownload(nextProps);
  }

  uri: ?string;

  restartDownload = (props: Props) => {
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
  };

  checkAvailability(uri: string) {
    if (!this.uri || uri !== this.uri) {
      this.uri = uri;
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
      if (fileInfo) {
        openInShell(fileInfo.download_path);
        doPause();
      }
    };

    if (loading || downloading) {
      const progress =
        fileInfo && fileInfo.written_bytes
          ? fileInfo.written_bytes / fileInfo.total_bytes * 100
          : 0;
      const label = fileInfo
        ? __('Downloading: ') + progress.toFixed(0) + __('% complete')
        : __('Connecting...');

      return <span className="file-download">{label}</span>;
    } else if (fileInfo === null && !downloading) {
      if (!costInfo) {
        return null;
      }

      return (
        <Button
          button="alt"
          label={__('Download')}
          icon={icons.DOWNLOAD}
          onClick={() => {
            purchaseUri(uri);
          }}
        />
      );
    } else if (fileInfo && fileInfo.download_path) {
      return (
        <Button button="alt" label={__('Open File')} icon={icons.OPEN} onClick={() => openFile()} />
      );
    }

    return null;
  }
}

export default FileDownloadLink;
