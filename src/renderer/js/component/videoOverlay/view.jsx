import React from "react";
import VideoPlayer from "component/videoPlayer";

class VideoOverlay extends React.PureComponent {
  render() {
    const { playingUri, currentPage } = this.props;

    const isDownloading = this.props.isDownloading(playingUri);
    const isLoading = this.props.isLoading(playingUri);
    const fileInfo = this.props.fileInfo(playingUri);
    const haveFileInfo = fileInfo && fileInfo.written_bytes > 0;

    const isReadyToPlay = (haveFileInfo || isDownloading) && !isLoading;

    if (isReadyToPlay && playingUri !== null && currentPage !== "show") {
      return <VideoPlayer overlay={true} uri={playingUri} />;
    }

    return null;
  }
}

export default VideoOverlay;
