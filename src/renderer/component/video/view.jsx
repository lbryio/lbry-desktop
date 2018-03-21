// @flow
import React from 'react';
import lbry from 'lbry';
import classnames from 'classnames';
import VideoPlayer from './internal/player';
import VideoPlayButton from './internal/play-button';
import LoadingScreen from './internal/loading-screen';

type Props = {
  cancelPlay: () => void,
  fileInfo: {
    outpoint: string,
    file_name: string,
    written_bytes: number,
    download_path: string,
    completed: boolean,
  },
  metadata: ?{
    nsfw: boolean,
    thumbnail: string,
  },
  isLoading: boolean,
  isDownloading: boolean,
  playingUri: ?string,
  contentType: string,
  changeVolume: number => void,
  volume: number,
  claim: {},
  uri: string,
  doPlay: () => void,
  doPause: () => void,
  savePosition: (string, number) => void,
  mediaPaused: boolean,
  mediaPosition: ?number,
  className: ?string,
  obscureNsfw: boolean,
  play: string => void,
};

class Video extends React.PureComponent<Props> {
  componentWillUnmount() {
    this.props.cancelPlay();
  }

  isMediaSame(nextProps: Props) {
    return (
      this.props.fileInfo &&
      nextProps.fileInfo &&
      this.props.fileInfo.outpoint === nextProps.fileInfo.outpoint
    );
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
      className,
      obscureNsfw,
      play,
    } = this.props;

    const isPlaying = playingUri === uri;
    const isReadyToPlay = fileInfo && fileInfo.written_bytes > 0;
    const shouldObscureNsfw = obscureNsfw && metadata && metadata.nsfw;
    const mediaType = lbry.getMediaType(contentType, fileInfo && fileInfo.file_name);

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

    const poster = metadata && metadata.thumbnail;

    return (
      <div className={classnames('video', {}, className)}>
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
          <div
            className={classnames('video__cover', { 'card--obscured': shouldObscureNsfw })}
            style={!shouldObscureNsfw && poster ? { backgroundImage: `url("${poster}")` } : {}}
          >
            <VideoPlayButton
              play={play}
              fileInfo={fileInfo}
              uri={uri}
              isLoading={isLoading}
              mediaType={mediaType}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Video;
