// @flow
import * as ICONS from 'constants/icons';
import React, { useState, useEffect } from 'react';
import Button from 'component/button';
import classnames from 'classnames';
import LoadingScreen from 'component/common/loading-screen';
import FileRender from 'component/fileRender';
import UriIndicator from 'component/uriIndicator';
import usePersistedState from 'effects/use-persisted-state';
import usePrevious from 'effects/use-previous';
import { FILE_WRAPPER_CLASS } from 'component/layoutWrapperFile/view';
import Draggable from 'react-draggable';
import Tooltip from 'component/common/tooltip';
import { onFullscreenChange } from 'util/full-screen';
import useIsMobile from 'effects/use-is-mobile';

type Props = {
  mediaType: string,
  contentType: string,
  isText: boolean,
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
  triggerAnalyticsView: (string, number) => Promise<any>,
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
    mediaType,
    contentType,
    isText,
  } = props;
  const isMobile = useIsMobile();
  const [playTime, setPlayTime] = useState();
  const [fileViewerRect, setFileViewerRect] = usePersistedState('inline-file-viewer:rect');
  const [position, setPosition] = usePersistedState('floating-file-viewer:position', {
    x: -25,
    y: window.innerHeight - 400,
  });

  const inline = pageUri === uri;
  const forceVideo = ['application/x-ext-mkv', 'video/x-matroska'].includes(contentType);
  const webStreamOnly = contentType === 'application/pdf' || mediaType === 'text';
  const isReadyToPlay =
    (IS_WEB && (isStreamable || webStreamOnly || forceVideo)) ||
    ((isStreamable || forceVideo) && streamingUrl) ||
    (fileInfo && fileInfo.completed);
  const loadingMessage =
    !isStreamable && fileInfo && fileInfo.blobs_completed >= 1 && (!fileInfo.download_path || !fileInfo.written_bytes)
      ? __("It looks like you deleted or moved this file. We're rebuilding it now. It will only take a few seconds.")
      : __('Loading');

  const previousUri = usePrevious(uri);
  const isNewView = uri && previousUri !== uri && isPlaying;
  const [hasRecordedView, setHasRecordedView] = useState(false);

  useEffect(() => {
    if (isNewView) {
      setPlayTime(Date.now());
    }
  }, [isNewView, uri]);

  useEffect(() => {
    if (playTime && isReadyToPlay && !hasRecordedView) {
      const timeToStart = Date.now() - playTime;
      triggerAnalyticsView(uri, timeToStart).then(() => {
        claimRewards();
        setHasRecordedView(false);
        setPlayTime(null);
      });
    }
  }, [setPlayTime, triggerAnalyticsView, isReadyToPlay, hasRecordedView, playTime, uri, claimRewards]);

  useEffect(() => {
    function handleResize() {
      const element = document.querySelector(`.${FILE_WRAPPER_CLASS}`);
      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      // @FlowFixMe
      setFileViewerRect(rect);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    onFullscreenChange(window, 'add', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      onFullscreenChange(window, 'remove', handleResize);
    };
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

  const hidePlayer =
    isText ||
    !isPlaying ||
    !uri ||
    (!inline && (isMobile || !floatingPlayerEnabled || !['audio', 'video'].includes(mediaType)));

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
      handle=".draggable"
      cancel=".button"
    >
      <div
        className={classnames('content__viewer', {
          'content__viewer--floating': !inline,
          'content__viewer--inline': inline,
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
            <div className="draggable content__floating-header">
              <span className="media__uri--inline">{uri}</span>
              <div className="content__actions">
                <Tooltip label={__('View File')}>
                  <Button navigate={uri} icon={ICONS.VIEW} button="primary" />
                </Tooltip>
                <Tooltip label={__('Close')}>
                  <Button onClick={clearPlayingUri} icon={ICONS.REMOVE} button="primary" />
                </Tooltip>
              </div>
            </div>
          )}

          {isReadyToPlay ? <FileRender uri={uri} /> : <LoadingScreen status={loadingMessage} />}
          {!inline && (
            <div className="draggable content__info">
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
