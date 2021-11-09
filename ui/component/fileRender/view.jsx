// @flow
import * as remote from '@electron/remote';
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
  uri: string,
  streamingUrl: string,
  contentType: string,
  claim: StreamClaim,
  currentTheme: string,
  downloadPath: string,
  fileExtension: string,
  autoplay: boolean,
  renderMode: string,
  thumbnail: string,
  desktopPlayStartTime?: number,
  className?: string,
};

class FileRender extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    (this: any).escapeListener = this.escapeListener.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.escapeListener, true);
    analytics.playerLoadedEvent();
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
        return <ImageViewer uri={uri} source={source} />;
      case RENDER_MODES.HTML:
        return <HtmlViewer source={downloadPath || source} />;
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
        return <AppViewer uri={uri} />;
    }

    return null;
  }

  render() {
    const { renderMode, className } = this.props;

    return (
      <div
        className={classnames('file-render', className, {
          'file-render--document': RENDER_MODES.TEXT_MODES.includes(renderMode),
          'file-render--video': renderMode === RENDER_MODES.VIDEO || renderMode === RENDER_MODES.AUDIO,
        })}
      >
        {this.renderViewer()}
      </div>
    );
  }
}

export default withRouter(FileRender);
