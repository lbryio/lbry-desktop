import React from "react";
import { Thumbnail } from "component/common";
import player from "render-media";
import fs from "fs";

class VideoPlayer extends React.PureComponent {
  componentDidMount() {
    const elem = this.refs.media;
    const { downloadPath, filename } = this.props;
    const file = {
      name: filename,
      createReadStream: opts => {
        return fs.createReadStream(downloadPath, opts);
      },
    };
    player.append(file, elem, {
      autoplay: true,
      controls: true,
    });
  }

  render() {
    const { downloadPath, mediaType, poster } = this.props;

    return (
      <div>
        {["audio", "application"].indexOf(mediaType) !== -1 &&
          <Thumbnail src={poster} className="video-embedded" />}
        <div ref="media" />
      </div>
    );
  }
}

export default VideoPlayer;
