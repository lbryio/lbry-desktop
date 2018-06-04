// @flow
import React from 'react';
import Video from 'component/video';
import Overlay from 'component/overlay';
import VideoOverlayHeader from 'component/videoOverlayHeader';
import Button from 'component/button';
import * as icons from 'constants/icons';

type Props = {
  doCancelPlay: () => void,
  doHideOverlay: () => void,
  navigate: (string, ?{}) => void,
  doPlay: () => void,
  doPause: () => void,
  playingUri: ?string,
  mediaPaused: boolean,
  showOverlay: boolean,
};

class VideoOverlay extends React.Component<Props> {
  constructor() {
    super();

    (this: any).closeVideo = this.closeVideo.bind(this);
    (this: any).returnToMedia = this.returnToMedia.bind(this);
  }

  closeVideo() {
    const { doCancelPlay, doHideOverlay } = this.props;
    doCancelPlay();
    doHideOverlay();
  }

  returnToMedia() {
    const { navigate, playingUri, doHideOverlay } = this.props;
    doHideOverlay();
    navigate('/show', { uri: playingUri });
  }

  renderPlayOrPauseButton() {
    const { mediaPaused, doPause, doPlay } = this.props;
    if (mediaPaused) {
      return <Button noPadding button="secondary" icon={icons.PLAY} onClick={() => doPlay()} />;
    }
    return <Button noPadding button="secondary" icon={icons.PAUSE} onClick={() => doPause()} />;
  }

  render() {
    const { playingUri, showOverlay } = this.props;
    if (!showOverlay) return '';

    return (
      <Overlay>
        <VideoOverlayHeader uri={playingUri} onClose={this.closeVideo} />

        <div className="video__overlay">
          <Video className="content__embedded" uri={playingUri} overlayed hiddenControls />
          <div className="video__mask">
            {this.renderPlayOrPauseButton()}
            <Button
              noPadding
              button="secondary"
              icon={icons.MAXIMIZE}
              onClick={() => this.returnToMedia()}
            />
          </div>
        </div>
      </Overlay>
    );
  }
}

export default VideoOverlay;
