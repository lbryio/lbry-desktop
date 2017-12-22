const { remote } = require('electron');

import React from 'react';
import { Thumbnail } from 'component/common';
import player from 'render-media';
import fs from 'fs';
import LoadingScreen from './loading-screen';

class VideoPlayer extends React.PureComponent {
  static MP3_CONTENT_TYPES = ['audio/mpeg3', 'audio/mpeg'];

  constructor(props) {
    super(props);

    this.state = {
      hasMetadata: false,
      startedPlaying: false,
      unplayable: false,
    };

    this.togglePlayListener = this.togglePlay.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.videoPause) {
      this.refs.media.children[0].pause();
      this.props.setVideoPause(false);
    }
  }

  componentDidMount() {
    const container = this.refs.media;
    const { contentType, downloadPath, mediaType, changeVolume, volume } = this.props;
    const loadedMetadata = e => {
      this.setState({ hasMetadata: true, startedPlaying: true });
      this.refs.media.children[0].play();
    };
    const renderMediaCallback = err => {
      if (err) this.setState({ unplayable: true });
    };
    // Handle fullscreen change for the Windows platform
    const win32FullScreenChange = e => {
      const win = remote.BrowserWindow.getFocusedWindow();
      if (process.platform === 'win32') {
        win.setMenu(document.webkitIsFullScreen ? null : remote.Menu.getApplicationMenu());
      }
    };

    // use renderAudio override for mp3
    if (VideoPlayer.MP3_CONTENT_TYPES.indexOf(contentType) > -1) {
      this.renderAudio(container, null, false);
    } else {
      player.append(
        this.file(),
        container,
        { autoplay: false, controls: true },
        renderMediaCallback.bind(this)
      );
    }

    document.addEventListener('keydown', this.togglePlayListener);
    const mediaElement = this.refs.media.children[0];
    if (mediaElement) {
      mediaElement.addEventListener('click', this.togglePlayListener);
      mediaElement.addEventListener('loadedmetadata', loadedMetadata.bind(this), {
        once: true,
      });
      mediaElement.addEventListener('webkitfullscreenchange', win32FullScreenChange.bind(this));
      mediaElement.addEventListener('volumechange', () => {
        changeVolume(mediaElement.volume);
      });
      mediaElement.volume = volume;
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.togglePlayListener);
    const mediaElement = this.refs.media.children[0];
    if (mediaElement) {
      mediaElement.removeEventListener('click', this.togglePlayListener);
    }
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

  togglePlay(event) {
    // ignore all events except click and spacebar keydown, or input events in a form control
    if (
      event.type === 'keydown' &&
      (event.code !== 'Space' || event.target.tagName.toLowerCase() === 'input')
    ) {
      return;
    }
    event.preventDefault();
    const mediaElement = this.refs.media.children[0];
    if (mediaElement) {
      if (!mediaElement.paused) {
        mediaElement.pause();
      } else {
        mediaElement.play();
      }
    }
  }

  componentDidUpdate() {
    const { contentType, downloadCompleted } = this.props;
    const { startedPlaying } = this.state;

    if (this.playableType() && !startedPlaying && downloadCompleted) {
      const container = this.refs.media.children[0];

      if (VideoPlayer.MP3_CONTENT_TYPES.indexOf(contentType) > -1) {
        this.renderAudio(this.refs.media, true);
      } else {
        player.render(this.file(), container, {
          autoplay: true,
          controls: true,
        });
      }
    }
  }

  file() {
    const { downloadPath, filename } = this.props;

    return {
      name: filename,
      createReadStream: opts => fs.createReadStream(downloadPath, opts),
    };
  }

  playableType() {
    const { mediaType } = this.props;

    return ['audio', 'video'].indexOf(mediaType) !== -1;
  }

  render() {
    const { mediaType, poster } = this.props;
    const { hasMetadata, unplayable } = this.state;
    const noMetadataMessage = 'Waiting for metadata.';
    const unplayableMessage = "Sorry, looks like we can't play this file.";

    const needsMetadata = this.playableType();

    return (
      <div>
        {['audio', 'application'].indexOf(mediaType) !== -1 &&
          (!this.playableType() || hasMetadata) &&
          !unplayable && <Thumbnail src={poster} className="video-embedded" />}
        {this.playableType() &&
          !hasMetadata &&
          !unplayable && <LoadingScreen status={noMetadataMessage} />}
        {unplayable && <LoadingScreen status={unplayableMessage} spinner={false} />}
        <div ref="media" className="media" />
      </div>
    );
  }
}

export default VideoPlayer;
