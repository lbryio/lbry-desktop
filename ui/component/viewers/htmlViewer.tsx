import * as React from 'react';
import { stopContextMenu } from 'util/context-menu';

type Props = {
  source: string
};

type State = {
  loading: boolean
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
// @ts-expect-error - TS2339 - Property 'current' does not exist on type 'unknown'.
      const { scrollHeight, scrollWidth } = this.iframe.current.contentDocument.body;
// @ts-expect-error - TS2339 - Property 'current' does not exist on type 'unknown'.
      this.iframe.current.style.height = `${scrollHeight}px`;
// @ts-expect-error - TS2339 - Property 'current' does not exist on type 'unknown'.
      this.iframe.current.style.width = `${scrollWidth}px`;
    };
// @ts-expect-error - TS2339 - Property 'current' does not exist on type 'unknown'.
    this.iframe.current.onload = () => {
      this.setState({ loading: false });
      resize();
    };
// @ts-expect-error - TS2339 - Property 'current' does not exist on type 'unknown'.
    this.iframe.current.resize = () => resize();
  }

  render() {
    const { source } = this.props;
    const { loading } = this.state;
    return (
      <div className="file-viewer file-viewer--html file-viewer--iframe" onContextMenu={stopContextMenu}>
        {loading && <div className="placeholder--text-document" />}
{ /* @ts-expect-error - TS2322 - Type 'unknown' is not assignable to type 'LegacyRef<HTMLIFrameElement>'. */}
        <iframe ref={this.iframe} hidden={loading} sandbox="" title={__('File preview')} src={`file://${source}`} />
      </div>
    );
  }
}

export default HtmlViewer;
