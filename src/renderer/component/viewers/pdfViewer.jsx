// @flow
import * as React from 'react';
import { stopContextMenu } from 'util/context-menu';

type Props = {
  source: string,
};

class PdfViewer extends React.PureComponent<Props> {
  render() {
    const { source } = this.props;
    return (
      <div className="file-render__viewer" onContextMenu={stopContextMenu}>
        <webview src={`chrome://pdf-viewer/index.html?src=file://${source}`} />
      </div>
    );
  }
}

export default PdfViewer;
