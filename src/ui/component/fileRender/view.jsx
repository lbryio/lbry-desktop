// @flow
import { remote } from 'electron';
import React, { Suspense } from 'react';
import LoadingScreen from 'component/common/loading-screen';
import VideoViewer from 'component/viewers/videoViewer';
import path from 'path';
import fs from 'fs';

// This is half complete, the video viewer works fine for audio, it just doesn't look pretty
// const AudioViewer = React.lazy<*>(() =>
//   import(
//     /* webpackChunkName: "audioViewer" */
//     'component/viewers/audioViewer'
//   )
// );

const DocumentViewer = React.lazy<*>(() =>
  import(
    /* webpackChunkName: "documentViewer" */
    'component/viewers/documentViewer'
  )
);

const DocxViewer = React.lazy<*>(() =>
  import(
    /* webpackChunkName: "docxViewer" */
    'component/viewers/docxViewer'
  )
);

const HtmlViewer = React.lazy<*>(() =>
  import(
    /* webpackChunkName: "htmlViewer" */
    'component/viewers/htmlViewer'
  )
);

const PdfViewer = React.lazy<*>(() =>
  import(
    /* webpackChunkName: "pdfViewer" */
    'component/viewers/pdfViewer'
  )
);

// @if TARGET='app'
const ComicBookViewer = React.lazy<*>(() =>
  import(
    /* webpackChunkName: "comicBookViewer" */
    'component/viewers/comicBookViewer'
  )
);

const ThreeViewer = React.lazy<*>(() =>
  import(
    /* webpackChunkName: "threeViewer" */
    'component/viewers/threeViewer'
  )
);
// @endif

type Props = {
  mediaType: string,
  streamingUrl: string,
  contentType: string,
  claim: StreamClaim,
  currentTheme: string,
  downloadPath?: string,
  fileName?: string,
};

class FileRender extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    (this: any).escapeListener = this.escapeListener.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.escapeListener, true);

    // ugh
    // const { claim, streamingUrl, fileStatus, fileName, downloadPath, downloadCompleted, contentType } = this.props;
    // if(MediaPlayer.SANDBOX_TYPES.indexOf(contentType) > -1) {
    //   const outpoint = `${claim.txid}:${claim.nout}`;
    //   // Fetch unpacked url
    //   fetch(`${MediaPlayer.SANDBOX_SET_BASE_URL}${outpoint}`)
    //     .then(res => res.text())
    //     .then(url => {
    //       const source = {url: `${MediaPlayer.SANDBOX_CONTENT_BASE_URL}${url}`};
    //       this.setState({source});
    //     })
    //     .catch(err => {
    //       console.error(err);
    //     });
    // } else {
    // File to render
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.escapeListener, true);
  }

  // This should use React.createRef()
  // processSandboxRef(element: any) {
  //   if (!element) {
  //     return;
  //   }

  //   window.sandbox = element;

  //   element.addEventListener('permissionrequest', e => {
  //     console.log('permissionrequest', e);
  //   });

  //   element.addEventListener('console-message', (e: { message: string }) => {
  //     if (/^\$LBRY_IPC:/.test(e.message)) {
  //       // Process command
  //       let message = {};
  //       try {
  //         // $FlowFixMe
  //         message = JSON.parse(/^\$LBRY_IPC:(.*)/.exec(e.message)[1]);
  //       } catch (err) {}
  //       console.log('IPC', message);
  //     } else {
  //       console.log('Sandbox:', e.message);
  //     }
  //   });

  //   element.addEventListener('enter-html-full-screen', () => {
  //     // stub
  //   });

  //   element.addEventListener('leave-html-full-screen', () => {
  //     // stub
  //   });
  // }

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
    const { mediaType, currentTheme, claim, contentType, downloadPath, fileName, streamingUrl } = this.props;

    const fileType = fileName && path.extname(fileName).substring(1);

    // Human-readable files (scripts and plain-text files)
    const readableFiles = ['text', 'document', 'script'];

    // Supported mediaTypes
    const mediaTypes = {
      // @if TARGET='app'
      '3D-file': <ThreeViewer source={{ fileType, downloadPath }} theme={currentTheme} />,
      'comic-book': <ComicBookViewer source={{ fileType, downloadPath }} theme={currentTheme} />,
      // application: !source.url ? null : (
      //   <webview
      //     ref={element => this.processSandboxRef(element)}
      //     title=""
      //     sandbox="allow-scripts allow-forms allow-pointer-lock"
      //     src={source.url}
      //     autosize="on"
      //     style={{ border: 0, width: '100%', height: '100%' }}
      //     useragent="Mozilla/5.0 AppleWebKit/537 Chrome/60 Safari/537"
      //     enableremotemodule="false"
      //     webpreferences="sandbox=true,contextIsolation=true,webviewTag=false,enableRemoteModule=false,devTools=false"
      //   />
      // ),
      // @endif

      video: <VideoViewer source={streamingUrl} contentType={contentType} />,
      audio: <VideoViewer source={streamingUrl} contentType={contentType} />,
      // audio: (
      //   <AudioViewer
      //     claim={claim}
      //     source={{ url: streamingUrl, downloadPath, downloadCompleted, status }}
      //     contentType={contentType}
      //   />
      // ),
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
      viewer = (
        <DocumentViewer
          source={{
            stream: options => fs.createReadStream(downloadPath, options),
            fileType,
            contentType,
          }}
          theme={currentTheme}
        />
      );
    }

    // @if TARGET='web'
    // temp workaround to disabled paid content on web
    if (claim && claim.value.fee && Number(claim.value.fee.amount) > 0) {
      const paidMessage = __(
        'Currently, only free content is available on lbry.tv. Try viewing it in the desktop app.'
      );
      const paid = <LoadingScreen status={paidMessage} spinner={false} />;
      return paid;
    }
    // @endif

    // Message Error
    const unsupportedMessage = __("We can't preview this file.");
    const unsupported = <LoadingScreen status={unsupportedMessage} spinner={false} />;

    // Return viewer
    return viewer || unsupported;
  }

  render() {
    return (
      <div className="file-render">
        <Suspense fallback={<div />}>{this.renderViewer()}</Suspense>
      </div>
    );
  }
}

export default FileRender;
