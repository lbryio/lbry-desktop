// @flow
import { remote } from 'electron';
import React from 'react';
import { lazyImport } from 'util/lazyImport';
import classnames from 'classnames';
import * as RENDER_MODES from 'constants/file_render_modes';
import * as KEYCODES from 'constants/keycodes';
import VideoViewer from 'component/viewers/videoViewer';
import { withRouter } from 'react-router-dom';
import fs from 'fs';
import analytics from 'analytics';

import DocumentViewer from 'component/viewers/documentViewer';

// @if TARGET='app'
// should match
import DocxViewer from 'component/viewers/docxViewer';
import ComicBookViewer from 'component/viewers/comicBookViewer';
import ThreeViewer from 'component/viewers/threeViewer';
// @endif

const AppViewer = lazyImport(() => import('component/viewers/appViewer' /* webpackChunkName: "appViewer" */));
const HtmlViewer = lazyImport(() => import('component/viewers/htmlViewer' /* webpackChunkName: "htmlViewer" */));
const ImageViewer = lazyImport(() => import('component/viewers/imageViewer' /* webpackChunkName: "imageViewer" */));
const PdfViewer = lazyImport(() => import('component/viewers/pdfViewer' /* webpackChunkName: "pdfViewer" */));

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
  className?: string,
};

class FileRender extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    (this: any).escapeListener = this.escapeListener.bind(this);
  }

  componentDidMount() {
    const { renderMode, embedded } = this.props;
    window.addEventListener('keydown', this.escapeListener, true);
    analytics.playerLoadedEvent(renderMode, embedded);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.escapeListener, true);
  }

  escapeListener(e: SyntheticKeyboardEvent<*>) {
    if (e.keyCode === KEYCODES.ESCAPE) {
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
        return (
          <React.Suspense fallback={null}>
            <ImageViewer uri={uri} source={source} />
          </React.Suspense>
        );
      case RENDER_MODES.HTML:
        return (
          <React.Suspense fallback={null}>
            <HtmlViewer source={downloadPath || source} />
          </React.Suspense>
        );
      case RENDER_MODES.DOCUMENT:
      case RENDER_MODES.MARKDOWN:
        return (
          <DocumentViewer
            source={{
              // @if TARGET='app'
              file: (options) => fs.createReadStream(downloadPath, options),
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
        return (
          <React.Suspense fallback={null}>
            <PdfViewer source={downloadPath || source} />
          </React.Suspense>
        );
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
        return (
          <ComicBookViewer
            source={{
              // @if TARGET='app'
              file: (options) => fs.createReadStream(downloadPath, options),
              // @endif
              stream: source,
            }}
            theme={currentTheme}
          />
        );
      case RENDER_MODES.APPLICATION:
        return (
          <React.Suspense fallback={null}>
            <AppViewer uri={uri} />
          </React.Suspense>
        );
    }

    return null;
  }

  render() {
    const { embedded, renderMode, className } = this.props;

    return (
      <div
        className={classnames('file-render', className, {
          'file-render--document': RENDER_MODES.TEXT_MODES.includes(renderMode) && !embedded,
          'file-render--embed': embedded,
          'file-render--video': renderMode === RENDER_MODES.VIDEO || renderMode === RENDER_MODES.AUDIO,
        })}
      >
        {this.renderViewer()}
      </div>
    );
  }
}

export default withRouter(FileRender);
