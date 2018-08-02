// @flow
import React from 'react';
import { stopContextMenu } from 'util/contextMenu';

type Props = {
  source: string,
};

class PdfViewer extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.viewer = React.createRef();
  }

  render() {
    const { source } = this.props;
    return (
      <div className="file-render__viewer" onContextMenu={stopContextMenu}>
        <webview ref={this.viewer} src={`chrome://pdf-viewer/index.html?src=file://${source}`} />
      </div>
    );
  }
}

export default PdfViewer;
