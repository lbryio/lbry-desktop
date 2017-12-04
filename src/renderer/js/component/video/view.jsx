import React from "react";
import lbry from "lbry";
import VideoPlayButton from "./internal/play-button";
import { LoadingScreen } from "component/common";
import VideoPlayer from "component/videoPlayer";
import NsfwOverlay from "component/nsfwOverlay";

class Video extends React.PureComponent {
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

  handleMouseOver() {
    if (
      this.props.obscureNsfw &&
      this.props.metadata &&
      this.props.metadata.nsfw
    ) {
      this.setState({
        showNsfwHelp: true,
      });
    }
  }

  handleMouseOut() {
    if (this.state.showNsfwHelp) {
      this.setState({
        showNsfwHelp: false,
      });
    }
  }

  render() {
    const {
      metadata,
      isLoading,
      isDownloading,
      playingUri,
      fileInfo,
      contentType,
      uri,
    } = this.props;

    const isPlaying = playingUri === uri;
    const isReadyToPlay = fileInfo && fileInfo.written_bytes > 0;
    const obscureNsfw = this.props.obscureNsfw && metadata && metadata.nsfw;
    const mediaType = lbry.getMediaType(
      contentType,
      fileInfo && fileInfo.file_name
    );

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

    let classes = [];
    classes.push(obscureNsfw ? "video--obscured " : "");
    if (isLoading || isDownloading) classes.push("video-embedded", "video");
    if (mediaType === "video") {
      classes.push("video-embedded", "video");
      classes.push(isPlaying ? "video--active" : "video--hidden");
    } else if (mediaType === "application") {
      classes.push("video-embedded");
    } else {
      if (!isPlaying) classes.push("video-embedded");
    }

    return (
      <div
        className={classes.join(" ")}
        onMouseEnter={this.handleMouseOver.bind(this)}
        onMouseLeave={this.handleMouseOut.bind(this)}
      >
        {isPlaying &&
          (!isReadyToPlay ? (
            <LoadingScreen status={loadStatusMessage} />
          ) : (
            <VideoPlayer overlay={false} uri={uri} />
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

export default Video;
