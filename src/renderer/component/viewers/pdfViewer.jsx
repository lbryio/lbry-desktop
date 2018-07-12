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
  constructor(props) {
    super(props);
    this.viewer = React.createRef();
  }

  // TODO: Enable context-menu
  stopContextMenu = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  render() {
    const { source } = this.props;
    return (
      <div className="file-render__viewer" onContextMenu={this.stopContextMenu}>
        <webview
          ref={this.viewer}
          src={`chrome://pdf-viewer/index.html?src=file://${source.downloadPath}`}
        />
      </div>
    );
  }
}

export default PdfViewer;
