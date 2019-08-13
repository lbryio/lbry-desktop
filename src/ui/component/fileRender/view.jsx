// @flow
import { remote } from 'electron';
import React, { Suspense } from 'react';
import LoadingScreen from 'component/common/loading-screen';
import VideoViewer from 'component/viewers/videoViewer';
import ImageViewer from 'component/viewers/imageViewer';
import AppViewer from 'component/viewers/appViewer';
import path from 'path';
import fs from 'fs';

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
  uri: string,
  mediaType: string,
  streamingUrl: string,
  contentType: string,
  claim: StreamClaim,
  currentTheme: string,
  downloadPath: string,
  fileName: string,
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
    const { mediaType, currentTheme, claim, contentType, downloadPath, fileName, streamingUrl, uri } = this.props;
    const fileType = fileName && path.extname(fileName).substring(1);

    // Ideally the lbrytv api server would just replace the streaming_url returned by the sdk so we don't need this check
    // https://github.com/lbryio/lbrytv/issues/51
    const source = IS_WEB ? `https://api.lbry.tv/content/claims/${claim.name}/${claim.claim_id}/stream` : streamingUrl;

    // Human-readable files (scripts and plain-text files)
    const readableFiles = ['text', 'document', 'script'];

    // Supported mediaTypes
    const mediaTypes = {
      // @if TARGET='app'
      '3D-file': <ThreeViewer source={{ fileType, downloadPath }} theme={currentTheme} />,
      'comic-book': <ComicBookViewer source={{ fileType, downloadPath }} theme={currentTheme} />,
      application: <AppViewer uri={uri} />,
      // @endif

      video: <VideoViewer uri={uri} source={source} contentType={contentType} />,
      audio: <VideoViewer uri={uri} source={source} contentType={contentType} />,
      image: <ImageViewer uri={uri} source={source} />,
      // Add routes to viewer...
    };

    // Supported fileType
    const fileTypes = {
      // @if TARGET='app'
      pdf: <PdfViewer source={downloadPath} />,
      docx: <DocxViewer source={downloadPath} />,
      html: <HtmlViewer source={downloadPath} />,
      // @endif
      // Add routes to viewer...
    };

    // Check for a valid fileType or mediaType
    let viewer = (fileType && fileTypes[fileType]) || mediaTypes[mediaType];

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
    const unsupportedMessage = __("Sorry, we can't preview this file.");
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
