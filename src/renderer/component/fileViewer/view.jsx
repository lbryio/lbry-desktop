// @flow
import React from 'react';
import classnames from 'classnames';
import analytics from 'analytics';
import type { Claim } from 'types/claim';
import LoadingScreen from 'component/common/loading-screen';
import Player from './internal/player';
import PlayButton from './internal/play-button';

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
  fileInfoErrors: ?{
    [string]: boolean,
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
  savePosition: (string, string, number) => void,
  position: ?number,
  className: ?string,
  obscureNsfw: boolean,
  play: string => void,
  searchBarFocused: boolean,
  mediaType: string,
  claimRewards: () => void,
};

class FileViewer extends React.PureComponent<Props> {
  constructor() {
    super();
    (this: any).playContent = this.playContent.bind(this);
    (this: any).handleKeyDown = this.handleKeyDown.bind(this);
    (this: any).logTimeToStart = this.logTimeToStart.bind(this);
    (this: any).startedPlayingCb = undefined;

    // Don't add these variables to state because we don't need to re-render when their values change
    (this: any).startTime = undefined;
    (this: any).playTime = undefined;
  }

  componentDidMount() {
    const { fileInfo } = this.props;
    if (!fileInfo) {
      this.startedPlayingCb = this.logTimeToStart;
    }

    this.handleAutoplay(this.props);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate(prev: Props) {
    const { fileInfo } = this.props;

    if (this.props.uri !== prev.uri) {
      // User just directly navigated to another piece of content
      if (this.startTime && !this.playTime) {
        // They started playing a file but it didn't start streaming
        // Fire the analytics event with the previous file
        this.fireAnalyticsEvent(prev.claim);
      }

      this.startTime = null;
      this.playTime = null;

      // If this new file is already downloaded, remove the startedPlayingCallback
      if (fileInfo && this.startedPlayingCb) {
        this.startedPlayingCb = null;
      } else if (!fileInfo && !this.startedPlayingCb) {
        this.startedPlayingCb = this.logTimeToStart;
      }
    }

    if (
      this.props.autoplay !== prev.autoplay ||
      this.props.fileInfo !== prev.fileInfo ||
      this.props.isDownloading !== prev.isDownloading ||
      this.props.playingUri !== prev.playingUri
    ) {
      // suppress autoplay after download error
      if (!(this.props.uri in this.props.fileInfoErrors)) {
        this.handleAutoplay(this.props);
      }
    }
  }

  componentWillUnmount() {
    const { claim } = this.props;

    if (this.startTime && !this.playTime) {
      // The user is navigating away before the file started playing, or a play time was never set
      // Currently will not be set for files that don't use render-media
      this.fireAnalyticsEvent(claim);
    }

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
    const { autoplay, playingUri, fileInfo, costInfo, isDownloading, uri, metadata } = props;

    const playable = autoplay && playingUri !== uri && metadata && !metadata.nsfw;

    if (playable && costInfo && costInfo.cost === 0 && !fileInfo && !isDownloading) {
      this.playContent();
    } else if (playable && fileInfo && fileInfo.blobs_completed > 0) {
      this.playContent();
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
    const { play, uri, fileInfo, isDownloading, isLoading } = this.props;

    if (fileInfo || isDownloading || isLoading) {
      // User may have pressed download before clicking play
      this.startedPlayingCb = null;
    }

    if (this.startedPlayingCb) {
      this.startTime = Date.now();
    }

    play(uri);
  }

  logTimeToStart() {
    const { claim } = this.props;

    if (this.startTime) {
      this.playTime = Date.now();
      this.fireAnalyticsEvent(claim, this.startTime, this.playTime);
    }
  }

  fireAnalyticsEvent(claim, startTime, playTime) {
    const { claimRewards } = this.props;
    const { name, claim_id: claimId, txid, nout } = claim;

    // ideally outpoint would exist inside of claim information
    // we can use it after https://github.com/lbryio/lbry/issues/1306 is addressed
    const outpoint = `${txid}:${nout}`;

    let timeToStart;
    if (playTime && startTime) {
      timeToStart = playTime - startTime;
    }

    analytics.apiLogView(`${name}#${claimId}`, outpoint, claimId, timeToStart, claimRewards);
  }

  startedPlayingCb: ?() => void;
  startTime: ?number;
  playTime: ?number;

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
      savePosition,
      position,
      className,
      obscureNsfw,
      mediaType,
    } = this.props;

    const isPlaying = playingUri === uri;
    const isReadyToPlay = fileInfo && fileInfo.written_bytes > 0;
    const shouldObscureNsfw = obscureNsfw && metadata && metadata.nsfw;

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
              <Player
                fileName={fileInfo.file_name}
                poster={poster}
                downloadPath={fileInfo.download_path}
                mediaType={mediaType}
                contentType={contentType}
                downloadCompleted={fileInfo.completed}
                changeVolume={changeVolume}
                volume={volume}
                savePosition={savePosition}
                claim={claim}
                uri={uri}
                position={position}
                startedPlayingCb={this.startedPlayingCb}
                playingUri={playingUri}
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
            <PlayButton
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

export default FileViewer;
