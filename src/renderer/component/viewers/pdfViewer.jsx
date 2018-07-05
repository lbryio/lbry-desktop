// @flow
import React from 'react';

type Props = {
  source: {
    fileType: string,
    filePath: string,
    downloadPath: string,
  },
};

class PdfViewer extends React.PureComponent<Props> {
  render() {
    const { source } = this.props;
    return (
      <webview
        className="file-render__viewer"
        src={`chrome://pdf-viewer/index.html?src=file://${source.downloadPath}`}
      />
    );
  }
}

export default PdfViewer;
