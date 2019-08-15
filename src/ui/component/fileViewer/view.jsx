// @flow
import * as ICONS from 'constants/icons';
import React, { useState, useEffect } from 'react';
import Button from 'component/button';
import classnames from 'classnames';
import LoadingScreen from 'component/common/loading-screen';
import FileRender from 'component/fileRender';
import UriIndicator from 'component/uriIndicator';
import usePersistedState from 'util/use-persisted-state';
import usePrevious from 'util/use-previous';
import { FILE_WRAPPER_CLASS } from 'page/file/view';
import Draggable from 'react-draggable';
import Tooltip from 'component/common/tooltip';

type Props = {
  mediaType: string,
  isLoading: boolean,
  isPlaying: boolean,
  fileInfo: FileListItem,
  uri: string,
  obscurePreview: boolean,
  insufficientCredits: boolean,
  isStreamable: boolean,
  thumbnail?: string,
  streamingUrl?: string,
  floatingPlayer: boolean,
  pageUri: ?string,
  title: ?string,
  floatingPlayerEnabled: boolean,
  clearPlayingUri: () => void,
  triggerAnalyticsView: (string, number) => void,
  claimRewards: () => void,
};

export default function FileViewer(props: Props) {
  const {
    isPlaying,
    fileInfo,
    uri,
    streamingUrl,
    isStreamable,
    pageUri,
    title,
    clearPlayingUri,
    floatingPlayerEnabled,
    triggerAnalyticsView,
    claimRewards,
  } = props;
  const [playTime, setPlayTime] = useState();
  const [fileViewerRect, setFileViewerRect] = usePersistedState('inline-file-viewer:rect');
  const [position, setPosition] = usePersistedState('floating-file-viewer:position', {
    x: -25,
    y: window.innerHeight - 400,
  });

  const inline = pageUri === uri;
  const isReadyToPlay = (IS_WEB && isStreamable) || (isStreamable && streamingUrl) || (fileInfo && fileInfo.completed);
  const loadingMessage =
    !isStreamable && fileInfo && fileInfo.blobs_completed >= 1 && (!fileInfo.download_path || !fileInfo.written_bytes)
      ? __("It looks like you deleted or moved this file. We're rebuilding it now. It will only take a few seconds.")
      : __('Loading');

  const previousUri = usePrevious(uri);
  const previousIsReadyToPlay = usePrevious(isReadyToPlay);
  const isNewView = uri && previousUri !== uri && isPlaying;
  const wasntReadyButNowItIs = isReadyToPlay && !previousIsReadyToPlay;

  useEffect(() => {
    if (isNewView) {
      setPlayTime(Date.now());
    }
  }, [isNewView, uri]);

  useEffect(() => {
    if (playTime && isReadyToPlay && wasntReadyButNowItIs) {
      const timeToStart = Date.now() - playTime;
      triggerAnalyticsView(uri, timeToStart);
      claimRewards();
      setPlayTime(null);
    }
  }, [setPlayTime, triggerAnalyticsView, isReadyToPlay, wasntReadyButNowItIs, playTime, uri, claimRewards]);

  useEffect(() => {
    function handleResize() {
      const element = document.querySelector(`.${FILE_WRAPPER_CLASS}`);
      if (!element) {
        throw new Error("Can't find file viewer wrapper to attach to");
      }

      const rect = element.getBoundingClientRect();
      // @FlowFixMe
      setFileViewerRect(rect);
    }

    if (inline) {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [setFileViewerRect, inline]);

  function handleDrag(e, ui) {
    const { x, y } = position;
    const newX = x + ui.deltaX;
    const newY = y + ui.deltaY;
    setPosition({
      x: newX,
      y: newY,
    });
  }

  const hidePlayer = !isPlaying || !uri || (!inline && (!floatingPlayerEnabled || !isStreamable));
  if (hidePlayer) {
    return null;
  }

  return (
    <Draggable
      onDrag={handleDrag}
      defaultPosition={position}
      position={inline ? { x: 0, y: 0 } : position}
      bounds="parent"
      disabled={inline}
      handle=".content__info"
      cancel=".button"
    >
      <div
        className={classnames('content__viewer', {
          'content__viewer--floating': !inline,
        })}
        style={
          inline && fileViewerRect
            ? { width: fileViewerRect.width, height: fileViewerRect.height, left: fileViewerRect.x }
            : {}
        }
      >
        <div
          className={classnames('content__wrapper', {
            'content__wrapper--floating': !inline,
          })}
        >
          {!inline && (
            <div className="content__actions">
              <Tooltip label={__('View File')}>
                <Button navigate={uri} icon={ICONS.VIEW} button="primary" />
              </Tooltip>
              <Tooltip label={__('Close')}>
                <Button onClick={clearPlayingUri} icon={ICONS.REMOVE} button="primary" />
              </Tooltip>
            </div>
          )}

          {isReadyToPlay ? <FileRender uri={uri} /> : <LoadingScreen status={loadingMessage} />}
          {!inline && (
            <div className="content__info">
              <div className="claim-preview-title" title={title || uri}>
                {title || uri}
              </div>
              <UriIndicator link addTooltip={false} uri={uri} />
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
}
