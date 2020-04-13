// @flow
import * as React from 'react';
import { stopContextMenu } from 'util/context-menu';

type Props = {
  source: string,
};

type State = {
  loading: boolean,
};

class HtmlViewer extends React.PureComponent<Props, State> {
  iframe: React.ElementRef<any>;
  constructor(props: Props) {
    super(props);
    this.state = { loading: true };
    this.iframe = React.createRef();
  }

  componentDidMount() {
    const resize = () => {
      const { scrollHeight, scrollWidth } = this.iframe.current.contentDocument.body;
      this.iframe.current.style.height = `${scrollHeight}px`;
      this.iframe.current.style.width = `${scrollWidth}px`;
    };
    this.iframe.current.onload = () => {
      this.setState({ loading: false });
      resize();
    };
    this.iframe.current.resize = () => resize();
  }

  render() {
    const { source } = this.props;
    const { loading } = this.state;
    return (
      <div className="file-viewer file-viewer--html file-viewer--iframe" onContextMenu={stopContextMenu}>
        {loading && <div className="placeholder--text-document" />}
        {/* @if TARGET='app' */}
        <iframe ref={this.iframe} hidden={loading} sandbox="" title={__('File preview')} src={`file://${source}`} />
        {/* @endif */}
        {/* @if TARGET='web' */}
        <iframe ref={this.iframe} hidden={loading} sandbox="" title={__('File preview')} src={source} />
        {/* @endif */}
      </div>
    );
  }
}

export default HtmlViewer;
