// @flow
import React from 'react';
import { stopContextMenu } from 'util/context-menu';

type Props = {
  source: string,
};

class HtmlViewer extends React.PureComponent<Props> {
  render() {
    const { source } = this.props;
    return (
      <div className="file-render__viewer" onContextMenu={stopContextMenu}>
        {/* @if TARGET='app' */}
        <iframe sandbox="" title={__('File preview')} src={`file://${source}`} />
        {/* @endif */}
        {/* @if TARGET='web' */}
        <iframe sandbox="" title={__('File preview')} src={source} />
        {/* @endif */}
      </div>
    );
  }
}

export default HtmlViewer;
