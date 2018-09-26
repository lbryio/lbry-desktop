import React from 'react';
import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import player from 'render-media';
import toBlobURL from 'stream-to-blob-url';
import FileRender from 'component/fileRender';
import Thumbnail from 'component/common/thumbnail';
import LoadingScreen from 'component/common/loading-screen';

// Handle fullscreen change for the Windows platform
const win32FullScreenChange = () => {
  const win = remote.BrowserWindow.getFocusedWindow();
  if (process.platform === 'win32') {
    win.setMenu(document.webkitIsFullScreen ? null : remote.Menu.getApplicationMenu());
  }
};

class MediaPlayer extends React.PureComponent {
  // static MP3_CONTENT_TYPES = ['audio/mpeg3', 'audio/mpeg'];
  static FILE_MEDIA_TYPES = [
    'video',
    'audio',
    'text',
    'script',
    'e-book',
    'comic-book',
    'document',
    '3D-file',
  ];

  constructor(props) {
    super(props);

    this.state = {
      hasMetadata: false,
      startedPlaying: false,
      unplayable: false,
      fileSource: null,
    };

    // this.togglePlayListener = this.togglePlay.bind(this);
    // this.toggleFullScreenVideo = this.toggleFullScreen.bind(this);
  }

  componentDidMount() {
    if (this.isSupportedFile()) {
      this.renderFile();
    }
  }

  componentDidUpdate() {
    const { fileName, downloadPath, contentType } = this.props;
    const { fileSource } = this.state;

    if (!fileSource && fileName && downloadPath && contentType) {
      this.renderFile();
    }
  }

  isSupportedFile() {
    // This files are supported using a custom viewer
    const { mediaType } = this.props;
    const isSupported = MediaPlayer.FILE_MEDIA_TYPES.includes(mediaType);
    return isSupported;
  }

  renderFile() {
    // We know we can render this file
    // Set the fileSource to state so the FileRender component will be rendered
    const { fileName, downloadPath, contentType } = this.props;

    if (!fileName || !downloadPath || !contentType) {
      return;
    }

    // File to render
    const fileSource = {
      fileName,
      contentType,
      downloadPath,
      fileType: path.extname(fileName).substring(1),
      // // Readable stream from file
      // stream: opts => fs.createReadStream(downloadPath, opts),
    };

    this.setState({ fileSource });
  }

  render() {
    const { mediaType, poster } = this.props;
    const { fileSource } = this.state;

    const isFileType = this.isSupportedFile();
    const isFileReady = fileSource && isFileType;

    return (
      <React.Fragment>
        {!isFileReady && <LoadingScreen status="loadingStatus" spinner />}
        {isFileReady && <FileRender source={fileSource} mediaType={mediaType} poster={poster} />}
      </React.Fragment>
    );
  }
}

export default MediaPlayer;
