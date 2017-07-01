import React from "react";
import { Thumbnail } from "component/common";
import player from "render-media";
import fs from "fs";
import LoadingScreen from "./loading-screen";

class VideoPlayer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hasMetadata: false,
      startedPlaying: false,
      unplayable: false,
    };

    this.togglePlayListener = this.togglePlay.bind(this);
  }

  componentDidMount() {
    const container = this.refs.media;
    const { mediaType } = this.props;
    const loadedMetadata = e => {
      this.setState({ hasMetadata: true, startedPlaying: true });
      this.refs.media.children[0].play();
    };
    const renderMediaCallback = err => {
      if (err) this.setState({ unplayable: true });
    };

    player.append(
      this.file(),
      container,
      { autoplay: false, controls: true, enableKeyboard: true },
      renderMediaCallback.bind(this)
    );

    document.addEventListener("keydown", this.togglePlayListener);
    const mediaElement = this.refs.media.children[0];
    if (mediaElement) {
      mediaElement.addEventListener(
        "loadedmetadata",
        loadedMetadata.bind(this),
        {
          once: true,
        }
      );
      mediaElement.addEventListener("click", this.togglePlayListener);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.togglePlayListener);
    const mediaElement = this.refs.media.children[0];
    if (mediaElement) {
      mediaElement.removeEventListener("click", this.togglePlayListener);
    }
  }

  togglePlay(event) {
    // ignore all events except click and spacebar keydown
    if ("keydown" === event.type && "Space" !== event.code) {
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
    const { mediaType, downloadCompleted } = this.props;
    const { startedPlaying } = this.state;

    if (this.playableType() && !startedPlaying && downloadCompleted) {
      const container = this.refs.media.children[0];

      player.render(this.file(), container, { autoplay: true, controls: true });
    }
  }

  file() {
    const { downloadPath, filename } = this.props;

    return {
      name: filename,
      createReadStream: opts => {
        return fs.createReadStream(downloadPath, opts);
      },
    };
  }

  playableType() {
    const { mediaType } = this.props;

    return ["audio", "video"].indexOf(mediaType) !== -1;
  }

  render() {
    const { mediaType, poster } = this.props;
    const { hasMetadata, unplayable } = this.state;
    const noMetadataMessage = "Waiting for metadata.";
    const unplayableMessage = "Sorry, looks like we can't play this file.";

    const needsMetadata = this.playableType();

    return (
      <div>
        {["audio", "application"].indexOf(mediaType) !== -1 &&
          (!this.playableType() || hasMetadata) &&
          !unplayable &&
          <Thumbnail src={poster} className="video-embedded" />}
        {this.playableType() &&
          !hasMetadata &&
          !unplayable &&
          <LoadingScreen status={noMetadataMessage} />}
        {unplayable &&
          <LoadingScreen status={unplayableMessage} spinner={false} />}
        <div ref="media" />
      </div>
    );
  }
}

export default VideoPlayer;
