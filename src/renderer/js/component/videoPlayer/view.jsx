const { remote } = require("electron");
import React from "react";
import player from "render-media";
import fs from "fs";
import lbry from "lbry";
import { Thumbnail, LoadingScreen } from "component/common";
import Link from "component/link";

class VideoPlayer extends React.PureComponent {
  static MP3_CONTENT_TYPES = ["audio/mpeg3", "audio/mpeg"];

  constructor(props) {
    super(props);

    const {
      file_name: _filename,
      download_path: _downloadPath,
      completed: _completed,
    } = this.props.fileInfo;

    const media_type = lbry.getMediaType(
      this.props.contentType,
      this.props.fileInfo && _filename
    );

    this.state = {
      hasMetadata: false,
      startedPlaying: false,
      unplayable: false,
      mediaType: media_type,
      filename: _filename,
      downloadPath: _downloadPath,
      completed: _completed,
      overlayable: false,
    };

    this.togglePlayListener = this.togglePlay.bind(this);
  }

  componentDidMount() {
    const container = this.media;
    const { contentType, changeVolume, volume, currentTime } = this.props;
    const { downloadPath, mediaType } = this.state;
    const loadedMetadata = e => {
      this.setState({ hasMetadata: true, startedPlaying: true });
      this.media.children[0].play();
    };
    const renderMediaCallback = err => {
      if (err) {
        this.setState({
          unplayable: true,
          overlayable: false,
        });
      }
    };
    // Handle fullscreen change for the Windows platform
    const win32FullScreenChange = e => {
      const win = remote.BrowserWindow.getFocusedWindow();
      if ("win32" === process.platform) {
        win.setMenu(
          document.webkitIsFullScreen ? null : remote.Menu.getApplicationMenu()
        );
      }
    };

    // not all media is "overlayable" so this has to manually set/unset for such media
    // by default it is true for A/V, but it is set to false if the player errs
    if (["video", "audio"].indexOf(mediaType) !== -1) {
      this.setState({ overlayable: true });
    } else {
      this.setState({ overlayable: false });
    }

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

    document.addEventListener("keydown", this.togglePlayListener);
    const mediaElement = this.media.children[0];
    if (mediaElement) {
      mediaElement.addEventListener("click", this.togglePlayListener);
      mediaElement.addEventListener(
        "loadedmetadata",
        loadedMetadata.bind(this),
        {
          once: true,
        }
      );
      mediaElement.addEventListener(
        "webkitfullscreenchange",
        win32FullScreenChange.bind(this)
      );
      mediaElement.addEventListener("volumechange", () => {
        changeVolume(mediaElement.volume);
      });
      if (currentTime && currentTime > 0) {
        mediaElement.currentTime = currentTime;
      }
      mediaElement.volume = volume;
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.togglePlayListener);
    const mediaElement = this.media.children[0];
    if (mediaElement) {
      mediaElement.removeEventListener("click", this.togglePlayListener);
      const currentTime = mediaElement.currentTime;
      if (currentTime) {
        this.props.setTime(mediaElement.currentTime);
      }
    }
  }

  renderAudio(container, autoplay) {
    if (container.firstChild) {
      container.firstChild.remove();
    }

    // clear the container
    const { downloadPath } = this.state;
    const audio = document.createElement("audio");
    audio.autoplay = autoplay;
    audio.controls = true;
    audio.src = downloadPath;
    container.appendChild(audio);
  }

  togglePlay(event) {
    // ignore all events except click and spacebar keydown, or input events in a form control
    if (
      "keydown" === event.type &&
      ("Space" !== event.code || "input" === event.target.tagName.toLowerCase())
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

  componentDidUpdate() {
    const { contentType } = this.props;
    const { startedPlaying, downloadCompleted } = this.state;

    if (this.isPlayableType() && !startedPlaying && downloadCompleted) {
      const container = this.media.children[0];

      if (VideoPlayer.MP3_CONTENT_TYPES.indexOf(contentType) > -1) {
        this.renderAudio(this.media, true);
      } else {
        player.render(this.file(), container, {
          autoplay: true,
          controls: true,
        });
      }
    }
  }

  file() {
    const { downloadPath, filename } = this.state;

    return {
      name: filename,
      createReadStream: opts => {
        return fs.createReadStream(downloadPath, opts);
      },
    };
  }

  isPlayableType() {
    const { mediaType } = this.state;

    return ["audio", "video"].indexOf(mediaType) !== -1;
  }

  render() {
    const {
      contentType,
      fileInfo,
      metadata,
      overlay,
      currentPage,
      playingUri,
      cancelPlay,
    } = this.props;
    const { mediaType } = this.state;
    const { hasMetadata, unplayable, overlayable } = this.state;
    const noMetadataMessage = "Waiting for metadata.";
    const unplayableMessage = "Sorry, looks like we can't play this file.";

    const poster = metadata.thumbnail;
    const needsMetadata = this.isPlayableType();
    const displayOverlay = overlay && overlayable;

    return (
      <div className={displayOverlay ? "overlay" : ""}>
        {["audio", "application"].indexOf(mediaType) !== -1 &&
          (!this.isPlayableType() || hasMetadata) &&
          !unplayable && <Thumbnail src={poster} className="video-embedded" />}
        {this.isPlayableType() &&
          !hasMetadata &&
          !unplayable && <LoadingScreen status={noMetadataMessage} />}
        {unplayable && (
          <LoadingScreen status={unplayableMessage} spinner={false} />
        )}

        {displayOverlay && (
          <Link
            className="button-close"
            icon="icon-times"
            onClick={() => cancelPlay()}
          />
        )}

        <div ref={ref => (this.media = ref)} className="media" />
      </div>
    );
  }
}

export default VideoPlayer;
