// @flow
import React from 'react';
import Video from 'component/video';
import FileActions from 'component/fileActions';
import Overlay from 'component/overlay';

type Props = {
  playingUri: ?string,
};

class VideoOverlay extends React.Component<Props> {
  render() {
    const { playingUri } = this.props;
    return (
      <Overlay>
        <div className="card-media__internal-links">
          <FileActions uri={playingUri} vertical />
        </div>
        {playingUri ? <Video className="content__embedded" uri={playingUri} overlayed /> : ''}
      </Overlay>
    );
  }
}

export default VideoOverlay;
