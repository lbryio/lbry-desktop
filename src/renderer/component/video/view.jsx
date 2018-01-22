import React from 'react';
import { Lbry } from 'lbry-redux';
import NsfwOverlay from 'component/nsfwOverlay';
import VideoPlayer from './internal/player';
import VideoPlayButton from './internal/play-button';
import LoadingScreen from './internal/loading-screen';

/* eslint-disable react/prop-types, react/jsx-no-bind */
class Video extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showNsfwHelp: false,
    };
  }

  componentWillUnmount() {
    this.props.cancelPlay();
  }

  isMediaSame(nextProps) {
    return (
      this.props.fileInfo &&
      nextProps.fileInfo &&
      this.props.fileInfo.outpoint === nextProps.fileInfo.outpoint
    );
  }

  handleMouseOver() {
    if (this.props.obscureNsfw && this.props.metadata && this.props.metadata.nsfw) {
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
      changeVolume,
      volume,
      claim,
      uri,
      doPlay,
      doPause,
      savePosition,
      mediaPaused,
      mediaPosition,
    } = this.props;

    const isPlaying = playingUri === uri;
    const isReadyToPlay = fileInfo && fileInfo.written_bytes > 0;
    const obscureNsfw = this.props.obscureNsfw && metadata && metadata.nsfw;
    const mediaType = Lbry.getMediaType(contentType, fileInfo && fileInfo.file_name);

    let loadStatusMessage = '';

    if (fileInfo && fileInfo.completed && !fileInfo.written_bytes) {
      loadStatusMessage = __(
        "It looks like you deleted or moved this file. We're rebuilding it now. It will only take a few seconds."
      );
    } else if (isLoading) {
      loadStatusMessage = __('Requesting stream...');
    } else if (isDownloading) {
      loadStatusMessage = __('Downloading stream... not long left now!');
    }

    const klasses = [];
    klasses.push(obscureNsfw ? 'video--obscured ' : '');
    if (isLoading || isDownloading) klasses.push('video-embedded', 'video');
    if (mediaType === 'video') {
      klasses.push('video-embedded', 'video');
      klasses.push(isPlaying ? 'video--active' : 'video--hidden');
    } else if (mediaType === 'application') {
      klasses.push('video-embedded');
    } else if (!isPlaying) klasses.push('video-embedded');
    const poster = metadata.thumbnail;

    return (
      <div
        className={klasses.join(' ')}
        onMouseEnter={this.handleMouseOver.bind(this)}
        onMouseLeave={this.handleMouseOut.bind(this)}
      >
        {isPlaying &&
          (!isReadyToPlay ? (
            <LoadingScreen status={loadStatusMessage} />
          ) : (
            <VideoPlayer
              filename={fileInfo.file_name}
              poster={poster}
              downloadPath={fileInfo.download_path}
              mediaType={mediaType}
              contentType={contentType}
              downloadCompleted={fileInfo.completed}
              changeVolume={changeVolume}
              volume={volume}
              doPlay={doPlay}
              doPause={doPause}
              savePosition={savePosition}
              claim={claim}
              uri={uri}
              paused={mediaPaused}
              position={mediaPosition}
            />
          ))}
        {!isPlaying && (
          <div className="video__cover" style={{ backgroundImage: `url("${metadata.thumbnail}")` }}>
            <VideoPlayButton {...this.props} mediaType={mediaType} />
          </div>
        )}
        {this.state.showNsfwHelp && <NsfwOverlay />}
      </div>
    );
  }
}

export default Video;
