/* eslint-disable */
import React from 'react';
import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import player from 'render-media';
import toBlobURL from 'stream-to-blob-url';
import FileRender from 'component/fileRender';
import Thumbnail from 'component/common/thumbnail';
import LoadingScreen from 'component/common/loading-screen';

class MediaPlayer extends React.PureComponent {
  static MP3_CONTENT_TYPES = ['audio/mpeg3', 'audio/mpeg'];
  static FILE_MEDIA_TYPES = ['text', 'script', 'e-book', 'comic-book', 'document', '3D-file'];

  constructor(props) {
    super(props);

    this.state = {
      hasMetadata: false,
      startedPlaying: false,
      unplayable: false,
      fileSource: null,
    };

    this.togglePlayListener = this.togglePlay.bind(this);
    this.toggleFullScreenVideo = this.toggleFullScreen.bind(this);
  }

  componentDidUpdate(nextProps) {
    const el = this.refs.media.children[0];
    if (this.props.playingUri && !nextProps.playingUri && !el.paused) {
      el.pause();
    }
  }

  componentDidMount() {
    const container = this.media;
    const {
      downloadCompleted,
      contentType,
      changeVolume,
      volume,
      position,
      claim,
      startedPlayingCb,
    } = this.props;

    const loadedMetadata = () => {
      this.setState({ hasMetadata: true, startedPlaying: true });

      if (startedPlayingCb) {
        startedPlayingCb();
      }
      this.media.children[0].play();
    };

    const renderMediaCallback = error => {
      if (error) this.setState({ unplayable: true });
    };

    // Handle fullscreen change for the Windows platform
    const win32FullScreenChange = () => {
      const win = remote.BrowserWindow.getFocusedWindow();
      if (process.platform === 'win32') {
        win.setMenu(document.webkitIsFullScreen ? null : remote.Menu.getApplicationMenu());
      }
    };

    // use renderAudio override for mp3
    if (MediaPlayer.MP3_CONTENT_TYPES.indexOf(contentType) > -1) {
      this.renderAudio(container, null, false);
    }
    // Render custom viewer: FileRender
    else if (this.fileType()) {
      downloadCompleted && this.renderFile();
    }
    // Render default viewer: render-media (video, audio, img, iframe)
    else {
      player.append(
        this.file(),
        container,
        { autoplay: true, controls: true },
        renderMediaCallback.bind(this)
      );
    }

    document.addEventListener('keydown', this.togglePlayListener);
    const mediaElement = this.media.children[0];
    if (mediaElement) {
      if (position) {
        mediaElement.currentTime = position;
      }
      mediaElement.addEventListener('timeupdate', () =>
        this.props.savePosition(
          claim.claim_id,
          `${claim.txid}:${claim.nout}`,
          mediaElement.currentTime
        )
      );
      mediaElement.addEventListener('click', this.togglePlayListener);
      mediaElement.addEventListener('loadedmetadata', loadedMetadata.bind(this), {
        once: true,
      });
      mediaElement.addEventListener('webkitfullscreenchange', win32FullScreenChange.bind(this));
      mediaElement.addEventListener('volumechange', () => {
        changeVolume(mediaElement.volume);
      });
      mediaElement.volume = volume;
      mediaElement.addEventListener('dblclick', this.toggleFullScreenVideo);
    }
  }

  componentWillReceiveProps(next) {
    const el = this.media.children[0];
    if (!this.props.paused && next.paused && !el.paused) el.pause();
  }

  componentDidUpdate() {
    const { contentType, downloadCompleted } = this.props;
    const { startedPlaying, fileSource } = this.state;

    if (this.playableType() && !startedPlaying && downloadCompleted) {
      const container = this.media.children[0];

      if (MediaPlayer.MP3_CONTENT_TYPES.indexOf(contentType) > -1) {
        this.renderAudio(this.media, true);
      } else {
        player.render(this.file(), container, {
          autoplay: true,
          controls: true,
        });
      }
    } else if (this.fileType() && !fileSource && downloadCompleted) {
      this.renderFile();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.togglePlayListener);
    const mediaElement = this.media.children[0];
    if (mediaElement) {
      mediaElement.removeEventListener('click', this.togglePlayListener);
    }
  }

  toggleFullScreen(event) {
    const mediaElement = this.media.children[0];
    if (mediaElement) {
      if (document.webkitIsFullScreen) {
        document.webkitExitFullscreen();
      } else {
        mediaElement.webkitRequestFullScreen();
      }
    }
  }

  togglePlay(event) {
    // ignore all events except click and spacebar keydown, or input events in a form control
    if (
      event.type === 'keydown' &&
      (event.code !== 'Space' || event.target.tagName.toLowerCase() === 'input')
    ) {
      return;
    }
    event.preventDefault();
    const mediaElement = this.media.children[0];
    if (mediaElement) {
      if (!mediaElement.paused) {
        mediaElement.pause();
      } else {
        mediaElement.play();
      }
    }
  }

  file() {
    const { downloadPath, fileName } = this.props;

    return {
      name: fileName,
      createReadStream: opts => fs.createReadStream(downloadPath, opts),
    };
  }

  playableType() {
    const { mediaType } = this.props;

    return ['audio', 'video'].indexOf(mediaType) !== -1;
  }

  supportedType() {
    // Files supported by render-media
    const { contentType, mediaType } = this.props;

    return Object.values(player.mime).indexOf(contentType) !== -1;
  }

  fileType() {
    // This files are supported using a custom viewer
    const { mediaType } = this.props;

    return MediaPlayer.FILE_MEDIA_TYPES.indexOf(mediaType) > -1;
  }

  renderFile() {
    // This is what render-media does with unplayable files
    const { fileName, downloadPath, contentType, mediaType } = this.props;

    // File to render
    const fileSource = {
      fileName,
      contentType,
      downloadPath,
      fileType: path.extname(fileName).substring(1),
    };

    // Readable stream from file
    fileSource.stream = opts => fs.createReadStream(downloadPath, opts);

    // Blob url from stream
    fileSource.blob = callback =>
      toBlobURL(fs.createReadStream(downloadPath), contentType, callback);

    // Update state
    this.setState({ fileSource });
  }

  renderAudio(container, autoplay) {
    if (container.firstChild) {
      container.firstChild.remove();
    }

    // clear the container
    const { downloadPath } = this.props;
    const audio = document.createElement('audio');
    audio.autoplay = autoplay;
    audio.controls = true;
    audio.src = downloadPath;
    container.appendChild(audio);
  }

  showLoadingScreen(isFileType, isPlayableType) {
    const { mediaType } = this.props;
    const { hasMetadata, unplayable, unsupported, fileSource } = this.state;

    const loader = {
      isLoading: false,
      loadingStatus: null,
    };

    // Loading message
    const noFileMessage = __('Waiting for blob.');
    const noMetadataMessage = __('Waiting for metadata.');

    // Error message
    const unplayableMessage = __("Sorry, looks like we can't play this file.");
    const unsupportedMessage = __("Sorry, looks like we can't preview this file.");

    // Files
    const isLoadingFile = !fileSource && isFileType;
    const isUnsupported =
      (mediaType === 'application' || !this.supportedType()) && !isFileType && !isPlayableType;

    // Media (audio, video)
    const isUnplayable = isPlayableType && unplayable;
    const isLoadingMetadata = isPlayableType && (!hasMetadata && !unplayable);

    // Show loading message
    if (isLoadingFile || isLoadingMetadata) {
      loader.loadingStatus = isFileType ? noFileMessage : noMetadataMessage;
      loader.isLoading = true;

      // Show unsupported error message
    } else if (isUnsupported || isUnplayable) {
      loader.loadingStatus = isUnsupported ? unsupportedMessage : unplayableMessage;
    }

    return loader;
  }

  render() {
    const { mediaType } = this.props;
    const { fileSource } = this.state;

    const isFileType = this.fileType();
    const isFileReady = fileSource && isFileType;
    const isPlayableType = this.playableType();
    const { isLoading, loadingStatus } = this.showLoadingScreen(isFileType, isPlayableType);

    return (
      <React.Fragment>
        {loadingStatus && <LoadingScreen status={loadingStatus} spinner={isLoading} />}
        {isFileReady && <FileRender source={fileSource} mediaType={mediaType} />}
        <div
          className={'content__view--container'}
          style={{ opacity: isLoading ? 0 : 1 }}
          ref={container => {
            this.media = container;
          }}
        />
      </React.Fragment>
    );
  }
}

export default MediaPlayer;
/* eslint-disable */
