import React from "react";
import lbry from "lbry";
import VideoPlayer from "./internal/player";
import VideoPlayButton from "./internal/play-button";
import LoadingScreen from "./internal/loading-screen";

class Video extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { isPlaying: false };
  }

  startPlaying() {
    this.setState({
      isPlaying: true,
    });
  }

  render() {
    const {
      metadata,
      isLoading,
      isDownloading,
      fileInfo,
      contentType,
    } = this.props;
    const { isPlaying = false } = this.state;

    const isReadyToPlay = fileInfo && fileInfo.written_bytes > 0;
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
      loadStatusMessage = __(
        "Requesting stream... it may sit here for like 15-20 seconds in a really awkward way... we're working on it"
      );
    } else if (isDownloading) {
      loadStatusMessage = __("Downloading stream... not long left now!");
    }

    let klasses = [];
    if (isLoading || isDownloading) klasses.push("video-embedded", "video");
    if (mediaType === "video") {
      klasses.push("video-embedded", "video");
      klasses.push(isPlaying ? "video--active" : "video--hidden");
    } else if (mediaType === "application") {
      klasses.push("video-embedded");
    } else {
      if (!isPlaying) klasses.push("video-embedded");
    }
    const poster = metadata.thumbnail;

    return (
      <div className={klasses.join(" ")}>
        {isPlaying &&
          (!isReadyToPlay
            ? <LoadingScreen status={loadStatusMessage} />
            : <VideoPlayer
                filename={fileInfo.file_name}
                poster={poster}
                downloadPath={fileInfo.download_path}
                mediaType={mediaType}
                downloadCompleted={fileInfo.completed}
              />)}
        {!isPlaying &&
          <div
            className="video__cover"
            style={{ backgroundImage: 'url("' + metadata.thumbnail + '")' }}
          >
            <VideoPlayButton
              startPlaying={this.startPlaying.bind(this)}
              {...this.props}
              mediaType={mediaType}
            />
          </div>}
      </div>
    );
  }
}

export default Video;
