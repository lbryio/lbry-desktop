// @flow
import React from 'react';
import { stopContextMenu } from 'util/contextMenu';

type Props = {
  source: string,
};

class HtmlViewer extends React.PureComponent<Props> {
  render() {
    const { source } = this.props;
    return (
      <div className="file-render__viewer" onContextMenu={stopContextMenu}>
        <iframe sandbox="" title={__('File preview')} src={`file://${source}`} />
      </div>
    );
  }
}

export default HtmlViewer;
