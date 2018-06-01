// @flow
import React from 'react';
import Video from 'component/video';
import Overlay from 'component/overlay';
import VideoOverlayHeader from 'component/videoOverlayHeader';
import Button from 'component/button';
import * as icons from 'constants/icons';

type Props = {
  cancelPlay: () => void,
  navigate: (string, ?{}) => void,
  doPlay: () => void,
  doPause: () => void,
  playingUri: ?string,
  mediaPaused: boolean,
};

class VideoOverlay extends React.Component<Props> {
  renderPlayOrPauseButton() {
    const { mediaPaused, doPause, doPlay } = this.props;
    if (mediaPaused) {
      return <Button noPadding button="secondary" icon={icons.PLAY} onClick={() => doPlay()} />;
    }
    return <Button noPadding button="secondary" icon={icons.PAUSE} onClick={() => doPause()} />;
  }

  render() {
    const { playingUri, cancelPlay, navigate } = this.props;
    if (!playingUri) return '';
    const returnToMedia = () => navigate('/show', { uri: playingUri });
    return (
      <Overlay>
        <VideoOverlayHeader uri={playingUri} onClose={cancelPlay} />

        <div className="video__overlay">
          <Video className="content__embedded" uri={playingUri} overlayed hiddenControls />
          <div className="video__mask">
            {this.renderPlayOrPauseButton()}
            <Button
              noPadding
              button="secondary"
              icon={icons.MAXIMIZE}
              onClick={() => returnToMedia()}
            />
          </div>
        </div>
      </Overlay>
    );
  }
}

export default VideoOverlay;
