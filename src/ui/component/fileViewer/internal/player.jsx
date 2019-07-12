// @flow
import type { ElementRef } from 'react';
import '@babel/polyfill';
import * as React from 'react';

// @if TARGET='app'
import fs from 'fs';
// @endif

import path from 'path';
import FileRender from 'component/fileRender';
import LoadingScreen from 'component/common/loading-screen';
import detectTyping from 'util/detect-typing';
import { fullscreenElement, requestFullscreen, exitFullscreen } from 'util/full-screen';

// Shorcut key code for fullscreen (f)
const F_KEYCODE = 70;

type Props = {
  contentType: string,
  mediaType: string,
  downloadCompleted: boolean,
  downloadPath: string,
  fileName: string,
  claim: StreamClaim,
  streamingUrl: string,
  fileStatus: string,
  viewerContainer: { current: ElementRef<any> },
};

type State = {
  unplayable: boolean,
  source: ?{
    url?: string,
    contentType?: string,
    downloadPath?: string,
    downloadCompleted?: boolean,
    fileType?: string,
    // Just using `any` because flow isn't working with `fs.createReadStream`
    stream?: ({}) => any,
    status?: string,
  },
};

class MediaPlayer extends React.PureComponent<Props, State> {
  static SANDBOX_TYPES = ['application/x-lbry', 'application/x-ext-lbry'];
  static FILE_MEDIA_TYPES = ['text', 'script', 'e-book', 'comic-book', 'document', '3D-file', 'video', 'audio'];
  static SANDBOX_SET_BASE_URL = 'http://localhost:5278/set/';
  static SANDBOX_CONTENT_BASE_URL = 'http://localhost:5278';

  constructor(props: Props) {
    super(props);

    this.state = {
      unplayable: false,
      source: null,
    };
  }

  componentDidMount() {
    if (this.isSupportedFile()) {
      this.renderFile();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { source } = this.state;
    const { downloadCompleted } = this.props;

    // Attemp to render a non-playable file once download is completed
    if (prevProps.downloadCompleted !== downloadCompleted) {
      const isFileType = this.isSupportedFile();

      if (isFileType && !source && downloadCompleted) {
        if (this.isSupportedFile()) {
          this.renderFile();
        }
      }
    }
  }

  handleKeyDown = (event: SyntheticKeyboardEvent<*>) => {
    const { searchBarFocused } = this.props;

    if (!searchBarFocused) {
      // Handle fullscreen shortcut key (f)
      if (event.keyCode === F_KEYCODE) {
        this.toggleFullscreen();
      }
    }
  };

  handleDoubleClick = (event: SyntheticInputEvent<*>) => {
    // Prevent pause / play
    event.preventDefault();
    event.stopPropagation();
    // Trigger fullscreen mode
    this.toggleFullscreen();
  };

  toggleFullscreen = () => {
    const { viewerContainer } = this.props;
    const isFullscreen = fullscreenElement();
    const isSupportedFile = this.isSupportedFile();
    const isPlayableType = this.playableType();

    if (!isFullscreen) {
      // Enter fullscreen mode if content is not playable
      // Otherwise it should be handle internally on the video player
      // or it will break the toggle fullscreen button
      if (!isPlayableType && isSupportedFile && viewerContainer && viewerContainer.current !== null) {
        requestFullscreen(viewerContainer.current);
      }
    } else {
      exitFullscreen();
    }
  };

  playableType(): boolean {
    const { mediaType } = this.props;
    return ['audio', 'video', 'image'].indexOf(mediaType) !== -1;
  }

  isSupportedFile() {
    // This files are supported using a custom viewer
    const { mediaType, contentType } = this.props;

    return MediaPlayer.FILE_MEDIA_TYPES.indexOf(mediaType) > -1 || MediaPlayer.SANDBOX_TYPES.indexOf(contentType) > -1;
  }

  renderFile() {
    // This is what render-media does with unplayable files
    const { claim, streamingUrl, fileStatus, fileName, downloadPath, downloadCompleted, contentType } = this.props;

    if (MediaPlayer.SANDBOX_TYPES.indexOf(contentType) > -1) {
      const outpoint = `${claim.txid}:${claim.nout}`;
      // Fetch unpacked url
      fetch(`${MediaPlayer.SANDBOX_SET_BASE_URL}${outpoint}`)
        .then(res => res.text())
        .then(url => {
          const source = { url: `${MediaPlayer.SANDBOX_CONTENT_BASE_URL}${url}` };
          this.setState({ source });
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      // File to render
      const source = {
        contentType,
        downloadPath,
        fileType: fileName && path.extname(fileName).substring(1),
        // Readable stream from file
        // @if TARGET='app'
        stream: opts => fs.createReadStream(downloadPath, opts),
        downloadCompleted: downloadPath !== null && downloadCompleted,
        url: streamingUrl,
        status: fileStatus,
        // @endif
      };

      // Update state
      this.setState({ source });
    }
  }

  showLoadingScreen(isFileType: boolean, isPlayableType: boolean) {
    const { mediaType } = this.props;
    const { unplayable, source } = this.state;

    // to do: need some way to call back from videojs if the file isn't playable

    if (IS_WEB && ['audio', 'video'].indexOf(mediaType) === -1) {
      return {
        isLoading: false,
        loadingStatus: __('This file type is not currently supported on lbry.tv. Try viewing it in the desktop app.'),
      };
    }

    const loader: { isLoading: boolean, loadingStatus: ?string } = {
      isLoading: false,
      loadingStatus: null,
    };

    // Loading message
    const noFileMessage = __('Waiting for stream...');

    // Error message
    const unplayableMessage = __("Sorry, looks like we can't play this file.");
    const unsupportedMessage = __("Sorry, looks like we can't preview this file.2");

    // Files
    const isLoadingFile = !source && isFileType;
    const isUnsupported = !isFileType && !isPlayableType;
    // Media (audio, video)
    const isUnplayable = isPlayableType && unplayable;

    // Show loading message
    if (isLoadingFile) {
      loader.loadingStatus = noFileMessage;
      loader.isLoading = true;

      // Show unsupported error message
    } else if (isUnsupported || isUnplayable) {
      loader.loadingStatus = isUnsupported ? unsupportedMessage : unplayableMessage;
    }

    return loader;
  }

  render() {
    const { mediaType, claim } = this.props;
    const { source } = this.state;
    const isFileType = this.isSupportedFile();
    const isFileReady = source !== null && isFileType;
    const isPlayableType = this.playableType();
    const { isLoading, loadingStatus } = this.showLoadingScreen(isFileType, isPlayableType);

    return (
      <React.Fragment>
        {loadingStatus && <LoadingScreen status={loadingStatus} spinner={isLoading} />}
        {isFileReady && <FileRender claim={claim} source={source} mediaType={mediaType} />}
      </React.Fragment>
    );
  }
}

export default MediaPlayer;
