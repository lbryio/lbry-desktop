// @flow
import { remote } from 'electron';
import React from 'react';
import LoadingScreen from 'component/common/loading-screen';
import PdfViewer from 'component/viewers/pdfViewer';
import DocumentViewer from 'component/viewers/documentViewer';
import DocxViewer from 'component/viewers/docxViewer';
import HtmlViewer from 'component/viewers/htmlViewer';
import AudioVideoViewer from 'component/viewers/audioVideoViewer';
// @if TARGET='app'
import ThreeViewer from 'component/viewers/threeViewer';
// @endif

type Props = {
  mediaType: string,
  poster?: string,
  source: {
    stream: string => void,
    fileName: string,
    fileType: string,
    contentType: string,
    downloadPath: string,
    url: ?string,
  },
  currentTheme: string,
};

class FileRender extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    (this: any).escapeListener = this.escapeListener.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.escapeListener, true);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.escapeListener, true);
  }

  // This should use React.createRef()
  processSandboxRef(element: any) {
    if (!element) {
      return;
    }

    window.sandbox = element;

    element.addEventListener('permissionrequest', e => {
      console.log('permissionrequest', e);
    });

    element.addEventListener('console-message', (e: { message: string }) => {
      if (/^\$LBRY_IPC:/.test(e.message)) {
        // Process command
        let message = {};
        try {
          // $FlowFixMe
          message = JSON.parse(/^\$LBRY_IPC:(.*)/.exec(e.message)[1]);
        } catch (err) {}
        console.log('IPC', message);
      } else {
        console.log('Sandbox:', e.message);
      }
    });

    element.addEventListener('enter-html-full-screen', () => {
      // stub
    });

    element.addEventListener('leave-html-full-screen', () => {
      // stub
    });
  }

  escapeListener(e: SyntheticKeyboardEvent<*>) {
    if (e.keyCode === 27) {
      e.preventDefault();

      this.exitFullscreen();

      return false;
    }
  }

  exitFullscreen() {
    remote.getCurrentWindow().setFullScreen(false);
  }

  renderViewer() {
    const { source, mediaType, currentTheme, poster, claim } = this.props;

    // Extract relevant data to render file
    const { stream, fileType, contentType, downloadPath, fileName } = source;

    // Human-readable files (scripts and plain-text files)
    const readableFiles = ['text', 'document', 'script'];

    // Supported mediaTypes
    const mediaTypes = {
      // @if TARGET='app'
      '3D-file': <ThreeViewer source={{ fileType, downloadPath }} theme={currentTheme} />,
      // @endif

      application: !source.url ? null : (
        <webview
          ref={element => this.processSandboxRef(element)}
          title=""
          sandbox="allow-scripts allow-forms allow-pointer-lock"
          src={source.url}
          autosize="on"
          style={{ border: 0, width: '100%', height: '100%' }}
          useragent="Mozilla/5.0 AppleWebKit/537 Chrome/60 Safari/537"
          enableremotemodule="false"
          webpreferences="sandbox=true,contextIsolation=true,webviewTag=false,enableRemoteModule=false,devTools=false"
        />
      ),
      video: (
        <AudioVideoViewer
          claim={claim}
          source={{ downloadPath, fileName }}
          contentType={contentType}
          poster={poster}
        />
      ),
      audio: (
        <AudioVideoViewer
          claim={claim}
          source={{ downloadPath, fileName }}
          contentType={contentType}
        />
      ),
      // Add routes to viewer...
    };

    // Supported fileType
    const fileTypes = {
      pdf: <PdfViewer source={downloadPath} />,
      docx: <DocxViewer source={downloadPath} />,
      html: <HtmlViewer source={downloadPath} />,
      // Add routes to viewer...
    };

    // Check for a valid fileType or mediaType
    let viewer = fileTypes[fileType] || mediaTypes[mediaType];

    // Check for Human-readable files
    if (!viewer && readableFiles.includes(mediaType)) {
      viewer = <DocumentViewer source={{ stream, fileType, contentType }} theme={currentTheme} />;
    }
    // temp workaround
    if (claim && claim.value.stream.metadata.fee && claim.value.stream.metadata.fee.amount > 0) {
      const paidMessage = __(
        'Currently, only free content is available on lbry.tv. Try viewing it in the desktop app.'
      );
      const paid = <LoadingScreen status={paidMessage} spinner={false} />;
      return paid;
    }
    // Message Error
    const unsupportedMessage = __("Sorry, looks like we can't preview this file.");
    const unsupported = <LoadingScreen status={unsupportedMessage} spinner={false} />;

    // Return viewer
    return viewer || unsupported;
  }

  render() {
    return <div className="file-render">{this.renderViewer()}</div>;
  }
}

export default FileRender;
