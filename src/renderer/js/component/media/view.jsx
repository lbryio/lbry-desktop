import React from "react";
import lbry from "lbry";
import VideoPlayButton from "./internal/play-button";
import { LoadingScreen } from "component/common";
import VideoPlayer from "component/videoPlayer";
import NsfwOverlay from "component/nsfwOverlay";

class Media extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showNsfwHelp: false,
    };
  }

  componentWillMount() {
    const { uri, playingUri } = this.props;

    // If not on the same uri cancel playback
    if (uri !== playingUri) {
      this.props.cancelPlay();
    }
  }

  isNSFW() {
    const { obscureNsfw, metadata } = this.props;
    return obscureNsfw && metadata && metadata.nsfw;
  }

  handleMouseOver() {
    if (this.isNSFW()) this.setState({ showNsfwHelp: true });
  }

  handleMouseOut() {
    this.setState({ showNsfwHelp: false });
  }

  determineLoadStatusMessage() {
    const { fileInfo, isLoading, isDownloading } = this.props;

    let loadStatusMessage = "";

    if (fileInfo && fileInfo.completed && !fileInfo.written_bytes) {
      loadStatusMessage = __(
        "It looks like you deleted or moved this file. We're rebuilding it now. It will only take a few seconds."
      );
    } else if (isLoading) {
      loadStatusMessage = __("Requesting stream...");
    } else if (isDownloading) {
      loadStatusMessage = __("Downloading stream... not long left now!");
    }

    return loadStatusMessage;
  }

  determineClasses(isPlaying, mediaType) {
    const { isLoading, isDownloading, overlay, overlayable } = this.props;

    let classes = [];
    classes.push(this.isNSFW() ? "video--obscured " : "");

    if (isLoading || isDownloading) classes.push("media-embedded", "video");

    if (mediaType === "video") {
      classes.push("media-embedded", "video");
      classes.push(isPlaying ? "video--active" : "video--hidden");
    } else if (mediaType === "application") {
      classes.push("media-embedded");
    } else if (!isPlaying) {
      classes.push("media-embedded");
    }
    if (overlay && overlayable) {
      classes.push("overlay");

      // We remove media-embedded on the overlay
      if (classes.indexOf("media-embedded") != -1) {
        classes.splice(classes.indexOf("media-embedded"), 1);
      }
    }

    return classes.join(" ").trim();
  }

  render() {
    const {
      metadata,
      playingUri,
      fileInfo,
      contentType,
      uri,
      overlay,
      overlayable,
    } = this.props;

    const isPlaying = playingUri === uri;
    const isReadyToPlay = fileInfo && fileInfo.written_bytes > 0;
    const mediaType = lbry.getMediaType(
      contentType,
      fileInfo && fileInfo.file_name
    );

    if (overlay && !overlayable) {
      return null;
    }

    return (
      <div
        className={this.determineClasses(isPlaying, mediaType)}
        onMouseEnter={this.handleMouseOver.bind(this)}
        onMouseLeave={this.handleMouseOut.bind(this)}
      >
        {isPlaying &&
          (!isReadyToPlay ? (
            <LoadingScreen status={this.determineLoadStatusMessage()} />
          ) : (
            <VideoPlayer overlay={overlay} uri={uri} />
          ))}
        {!isPlaying && (
          <div
            className="video__cover"
            style={{ backgroundImage: 'url("' + metadata.thumbnail + '")' }}
          >
            <VideoPlayButton {...this.props} mediaType={mediaType} />
          </div>
        )}
        {this.state.showNsfwHelp && <NsfwOverlay />}
      </div>
    );
  }
}

export default Media;
