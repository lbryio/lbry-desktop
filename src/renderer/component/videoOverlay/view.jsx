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
    this.destroyMediaPlayer();
  }

  returnToMedia() {
    const { navigate, playingUri, doHideOverlay } = this.props;
    doHideOverlay();
    this.destroyMediaPlayer(false);
    navigate('/show', { uri: playingUri, fromOverlay: true });
  }

  renderPlayOrPauseButton() {
    const { mediaPaused, doPause, doPlay } = this.props;
    if (mediaPaused) {
      return <Button noPadding button="secondary" icon={icons.PLAY} onClick={() => this.getPlayer().play()} />;
    }
    return <Button noPadding button="secondary" icon={icons.PAUSE} onClick={() => this.getPlayer().pause()} />;
  }

  getPlayer() {
    return document.getElementById('video__overlay_id').getElementsByTagName("video")[0];
  }

  destroyMediaPlayer(clearVideo = true){
    const topContainer = document.getElementById('video__overlay_id_top_container')
    const videoContainer = document.getElementById('video__overlay_id');
    topContainer.classList.add('hiddenContainer');
    if (clearVideo) videoContainer.innerHTML = '';
  }

  render() {
    const { playingUri, showOverlay } = this.props;

    return (
      <Overlay>
        {(showOverlay && <VideoOverlayHeader uri={playingUri} onClose={this.closeVideo} />)}

        <div className="video__overlay">
          {/* <Video className="content__embedded" uri={playingUri} overlayed hiddenControls /> */}
          {/* <div id="asdf"></div> */}
          <div className="video content__embedded hiddenContainer" id="video__overlay_id_top_container">
            <div className="content__view">
              <div className="content__view--container" id="video__overlay_id">
              </div>
            </div>
          </div>
          {(showOverlay && <div className="video__mask" id="video_mask">
            {this.renderPlayOrPauseButton()}
            <Button
              noPadding
              button="secondary"
              icon={icons.MAXIMIZE}
              onClick={() => this.returnToMedia()}
            />
          </div>)}
        </div>
      </Overlay>
    );
  }
}

export default VideoOverlay;
