// @flow
import React from 'react';
import { Lbry } from 'lbry-redux';
import classnames from 'classnames';
import type { Claim } from 'types/claim';
import VideoPlayer from './internal/player';
import VideoPlayButton from './internal/play-button';
import LoadingScreen from 'component/common/loading-screen';

const SPACE_BAR_KEYCODE = 32;

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
  autoplay: boolean,
  isLoading: boolean,
  isDownloading: boolean,
  playingUri: ?string,
  contentType: string,
  changeVolume: number => void,
  volume: number,
  claim: Claim,
  uri: string,
  doPlay: () => void,
  doPause: () => void,
  savePosition: (string, number) => void,
  mediaPaused: boolean,
  mediaPosition: ?number,
  className: ?string,
  obscureNsfw: boolean,
  play: string => void,
  searchBarFocused: boolean,
};

class Video extends React.PureComponent<Props> {
  constructor() {
    super();

    (this: any).playContent = this.playContent.bind(this);
    (this: any).handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    this.handleAutoplay(this.props);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.autoplay !== nextProps.autoplay ||
      this.props.fileInfo !== nextProps.fileInfo ||
      this.props.isDownloading !== nextProps.isDownloading ||
      this.props.playingUri !== nextProps.playingUri
    ) {
      this.handleAutoplay(nextProps);
    }
  }

  componentWillUnmount() {
    this.props.cancelPlay();
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event: SyntheticKeyboardEvent<*>) {
    const { searchBarFocused } = this.props;
    if (!searchBarFocused && event.keyCode === SPACE_BAR_KEYCODE) {
      event.preventDefault(); // prevent page scroll
      this.playContent();
    }
  }

  handleAutoplay = (props: Props) => {
    const { autoplay, playingUri, fileInfo, costInfo, isDownloading, uri, play, metadata } = props;

    const playable = autoplay && playingUri !== uri && metadata && !metadata.nsfw;

    if (playable && costInfo && costInfo.cost === 0 && !fileInfo && !isDownloading) {
      play(uri);
    } else if (playable && fileInfo && fileInfo.blobs_completed > 0) {
      play(uri);
    }
  };

  isMediaSame(nextProps: Props) {
    return (
      this.props.fileInfo &&
      nextProps.fileInfo &&
      this.props.fileInfo.outpoint === nextProps.fileInfo.outpoint
    );
  }

  playContent() {
    const { play, uri } = this.props;
    play(uri);
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
    } = this.props;

    const isPlaying = playingUri === uri;
    const isReadyToPlay = fileInfo && fileInfo.written_bytes > 0;
    const shouldObscureNsfw = obscureNsfw && metadata && metadata.nsfw;
    const mediaType = (fileInfo && Lbry.getMediaType(null, fileInfo.file_name)) || Lbry.getMediaType(contentType);

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
    const layoverClass = classnames('content__cover', { 'card__media--nsfw': shouldObscureNsfw });
    const layoverStyle =
      !shouldObscureNsfw && poster ? { backgroundImage: `url("${poster}")` } : {};

    return (
      <div className={classnames('video', {}, className)}>
        {isPlaying && (
          <div className="content__view">
            {!isReadyToPlay ? (
              <div className={layoverClass} style={layoverStyle}>
                <LoadingScreen status={loadStatusMessage} />
              </div>
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
            )}
          </div>
        )}
        {!isPlaying && (
          <div
            role="button"
            onClick={this.playContent}
            className={layoverClass}
            style={layoverStyle}
          >
            <VideoPlayButton
              play={e => {
                e.stopPropagation();
                this.playContent();
              }}
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
