// @flow
import { URL } from 'config';
import { remote } from 'electron';
import React, { Suspense } from 'react';
import classnames from 'classnames';
import * as RENDER_MODES from 'constants/file_render_modes';
import VideoViewer from 'component/viewers/videoViewer';
import ImageViewer from 'component/viewers/imageViewer';
import AppViewer from 'component/viewers/appViewer';
import Button from 'component/button';
import { withRouter } from 'react-router-dom';
import AutoplayCountdown from 'component/autoplayCountdown';
import { formatLbryUrlForWeb } from 'util/url';
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
  setPlayingUri: (string | null) => void,
  currentlyFloating: boolean,
  renderMode: string,
  thumbnail: string,
};

type State = {
  showAutoplayCountdown: boolean,
  showEmbededMessage: boolean,
};

class FileRender extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showAutoplayCountdown: false,
      showEmbededMessage: false,
    };

    (this: any).escapeListener = this.escapeListener.bind(this);
    (this: any).onEndedAutoplay = this.onEndedAutoplay.bind(this);
    (this: any).onEndedEmbedded = this.onEndedEmbedded.bind(this);
    (this: any).getOnEndedCb = this.getOnEndedCb.bind(this);
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

  getOnEndedCb() {
    const { setPlayingUri, currentlyFloating, embedded } = this.props;

    if (embedded) {
      return this.onEndedEmbedded;
    }

    if (!currentlyFloating) {
      return this.onEndedAutoplay;
    }

    return () => setPlayingUri(null);
  }

  onEndedAutoplay() {
    const { autoplay } = this.props;
    if (autoplay) {
      this.setState({ showAutoplayCountdown: true });
    }
  }

  onEndedEmbedded() {
    this.setState({ showEmbededMessage: true });
  }

  renderViewer() {
    const { currentTheme, contentType, downloadPath, fileExtension, streamingUrl, uri, renderMode } = this.props;
    const source = streamingUrl;

    switch (renderMode) {
      case RENDER_MODES.AUDIO:
      case RENDER_MODES.VIDEO:
        return <VideoViewer uri={uri} source={source} contentType={contentType} onEndedCB={this.getOnEndedCb()} />;
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
        return <ThreeViewer source={{ fileExtension, downloadPath }} theme={currentTheme} />;
      case RENDER_MODES.COMIC:
        return <ComicBookViewer source={{ fileExtension, downloadPath }} theme={currentTheme} />;
      case RENDER_MODES.APPLICATION:
        return <AppViewer uri={uri} />;
    }

    return null;
  }

  render() {
    const { uri, currentlyFloating, embedded, renderMode } = this.props;
    const { showAutoplayCountdown, showEmbededMessage } = this.state;
    const lbrytvLink = `${URL}${formatLbryUrlForWeb(uri)}?src=embed`;

    return (
      <div
        className={classnames({
          'file-render': !embedded,
          'file-render--document': RENDER_MODES.TEXT_MODES.includes(renderMode) && !embedded,
          'file-render__embed': embedded,
        })}
      >
        {embedded && showEmbededMessage && (
          <div className="video-overlay__wrapper">
            <div className="video-overlay__title">{__('See more on lbry.tv')}</div>

            <div className="video-overlay__actions">
              <div className="section__actions--centered">
                <Button label={__('Explore')} button="primary" href={lbrytvLink} />
              </div>
            </div>
          </div>
        )}
        {!currentlyFloating && showAutoplayCountdown && <AutoplayCountdown uri={uri} />}
        <Suspense fallback={<div />}>{this.renderViewer()}</Suspense>
      </div>
    );
  }
}

export default withRouter(FileRender);
