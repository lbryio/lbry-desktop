// @ts-expect-error - TS2305 - Module '"electron"' has no exported member 'ipcRenderer'.
import { ipcRenderer } from 'electron';
import React from 'react';
import classnames from 'classnames';
import * as RENDER_MODES from 'constants/file_render_modes';
import * as KEYCODES from 'constants/keycodes';
import VideoViewer from 'component/viewers/videoViewer';
import { withRouter } from 'react-router-dom';
import fs from 'fs';
import analytics from 'analytics';

import DocumentViewer from 'component/viewers/documentViewer';

// should match
import DocxViewer from 'component/viewers/docxViewer';
import ComicBookViewer from 'component/viewers/comicBookViewer';
import ThreeViewer from 'component/viewers/threeViewer';

import AppViewer from 'component/viewers/appViewer';
import HtmlViewer from 'component/viewers/htmlViewer';
import ImageViewer from 'component/viewers/imageViewer';
import PdfViewer from 'component/viewers/pdfViewer';

type Props = {
  uri: string;
  streamingUrl: string;
  embedded?: boolean;
  contentType: string;
  claim: StreamClaim;
  currentTheme: string;
  downloadPath: string;
  fileExtension: string;
  autoplay: boolean;
  renderMode: string;
  thumbnail: string;
  desktopPlayStartTime?: number;
  className?: string;
};

class FileRender extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    (this as any).escapeListener = this.escapeListener.bind(this);
  }

  componentDidMount() {
    const { embedded } = this.props;
    // @ts-expect-error - TS2769 - No overload matches this call.
    window.addEventListener('keydown', this.escapeListener, true);
    analytics.playerLoadedEvent(embedded);
  }

  componentWillUnmount() {
    // @ts-expect-error - TS2769 - No overload matches this call.
    window.removeEventListener('keydown', this.escapeListener, true);
  }

  escapeListener(e: React.KeyboardEvent<any>) {
    if (e.keyCode === KEYCODES.ESCAPE) {
      e.preventDefault();

      this.exitFullscreen();

      return false;
    }
  }

  exitFullscreen() {
    ipcRenderer.send('window:setFullScreen', false);
  }

  renderViewer() {
    const {
      currentTheme,
      contentType,
      downloadPath,
      fileExtension,
      streamingUrl,
      uri,
      renderMode,
      desktopPlayStartTime,
    } = this.props;
    const source = streamingUrl;

    switch (renderMode) {
      case RENDER_MODES.AUDIO:
      case RENDER_MODES.VIDEO:
        return (
          <VideoViewer
            uri={uri}
            source={source}
            contentType={contentType}
            desktopPlayStartTime={desktopPlayStartTime}
          />
        );
      case RENDER_MODES.IMAGE:
        // @ts-expect-error - TS2322 - Type '{ uri: string; source: string; }' is not assignable to type 'IntrinsicAttributes & Props'.
        return <ImageViewer uri={uri} source={source} />;
      case RENDER_MODES.HTML:
        return <HtmlViewer source={downloadPath || source} />;
      case RENDER_MODES.DOCUMENT:
      case RENDER_MODES.MARKDOWN:
        return (
          <DocumentViewer
            source={{
              // @if TARGET='app'
              // @ts-expect-error - TS2345 - Argument of type 'string' is not assignable to parameter of type 'BufferEncoding | ReadStreamOptions'.
              file: (options) => fs.createReadStream(downloadPath, options),
              // @endif
              stream: source,
              // @ts-expect-error - TS2322 - Type '{ file: (options: string) => ReadStream; stream: string; fileExtension: string; contentType: string; }' is not assignable to type '{ file: (arg1?: string) => any; stream: string; contentType: string; }'.
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
            // @ts-expect-error - TS2322 (ts-migration)
            theme={currentTheme}
          />
        );
      case RENDER_MODES.COMIC:
        return (
          <ComicBookViewer
            source={{
              // @if TARGET='app'
              // @ts-expect-error - TS2345 - Argument of type 'string' is not assignable to parameter of type 'BufferEncoding | ReadStreamOptions'.
              file: (options) => fs.createReadStream(downloadPath, options),
              // @endif
              stream: source,
            }}
            theme={currentTheme}
          />
        );
      case RENDER_MODES.APPLICATION:
        // @ts-expect-error - TS2322 (ts-migration)
        return <AppViewer uri={uri} />;
    }

    return null;
  }

  render() {
    const { embedded, renderMode, className } = this.props;

    return (
      <div
        className={classnames('file-render', className, {
          // @ts-expect-error - TS2345 - Argument of type 'string' is not assignable to parameter of type '"document" | "md" | "pdf" | "html" | "docx" | "plain_text"'.
          'file-render--document': RENDER_MODES.TEXT_MODES.includes(renderMode),
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
