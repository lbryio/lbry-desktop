// @flow
import React from 'react';
import Video from 'component/video';
import Overlay from 'component/overlay';
import VideoOverlayHeader from '../videoOverlayHeader';

type Props = {
  cancelPlay: () => void,
  playingUri: ?string,
};

class VideoOverlay extends React.Component<Props> {
  render() {
    const { playingUri, cancelPlay } = this.props;
    if (!playingUri) return '';
    return (
      <Overlay>
        <VideoOverlayHeader uri={playingUri} onClose={cancelPlay} />
        <div className="overlayeada">
          <Video className="content__embedded" uri={playingUri} overlayed hiddenControls />
        </div>
      </Overlay>
    );
  }
}

export default VideoOverlay;
