// @flow
import { remote } from 'electron';
import React, { Suspense } from 'react';
import classnames from 'classnames';
import * as RENDER_MODES from 'constants/file_render_modes';
import VideoViewer from 'component/viewers/videoViewer';
import ImageViewer from 'component/viewers/imageViewer';
import AppViewer from 'component/viewers/appViewer';
import { withRouter } from 'react-router-dom';
import fs from 'fs';

import DocumentViewer from 'component/viewers/documentViewer';
import PdfViewer from 'component/viewers/pdfViewer';
import HtmlViewer from 'component/viewers/htmlViewer';

// @if TARGET='app'
// should match
import DocxViewer from 'component/viewers/docxViewer';
import ComicBookViewer from 'component/viewers/comicBookViewer';
import ThreeViewer from 'component/viewers/threeViewer';
// @endif

type Props = {
  uri: string,
  streamingUrl: string,
  embedded?: boolean,
  contentType: string,
  claim: StreamClaim,
  currentTheme: string,
  downloadPath: string,
  fileExtension: string,
  autoplay: boolean,
  renderMode: string,
  thumbnail: string,
};

class FileRender extends React.PureComponent<Props, State> {
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
    const { currentTheme, contentType, downloadPath, fileExtension, streamingUrl, uri, renderMode } = this.props;
    const source = streamingUrl;

    switch (renderMode) {
      case RENDER_MODES.AUDIO:
      case RENDER_MODES.VIDEO:
        return <VideoViewer uri={uri} source={source} contentType={contentType} />;
      case RENDER_MODES.IMAGE:
        return <ImageViewer uri={uri} source={source} />;
      case RENDER_MODES.HTML:
        return <HtmlViewer source={downloadPath || source} />;
      case RENDER_MODES.DOCUMENT:
      case RENDER_MODES.MARKDOWN:
        return (
          <DocumentViewer
            source={{
              // @if TARGET='app'
              file: options => fs.createReadStream(downloadPath, options),
              // @endif
              stream: source,
              fileExtension,
              contentType,
            }}
            renderMode={renderMode}
            theme={currentTheme}
          />
        );
      case RENDER_MODES.DOCX:
        return <DocxViewer source={downloadPath} />;
      case RENDER_MODES.PDF:
        return <PdfViewer source={downloadPath || source} />;
      case RENDER_MODES.CAD:
        return (
          <ThreeViewer
            source={{
              fileType: fileExtension,
              downloadPath,
            }}
            theme={currentTheme}
          />
        );
      case RENDER_MODES.COMIC:
        return <ComicBookViewer source={downloadPath} theme={currentTheme} />;
      case RENDER_MODES.APPLICATION:
        return <AppViewer uri={uri} />;
    }

    return null;
  }

  render() {
    const { embedded, renderMode } = this.props;

    return (
      <div
        className={classnames('file-render', {
          'file-render--document': RENDER_MODES.TEXT_MODES.includes(renderMode) && !embedded,
          'file-render--embed': embedded,
        })}
      >
        <Suspense fallback={<div />}>{this.renderViewer()}</Suspense>
      </div>
    );
  }
}

export default withRouter(FileRender);
