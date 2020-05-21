// @flow
import * as ICONS from 'constants/icons';
import * as RENDER_MODES from 'constants/file_render_modes';
import React, { useEffect, useState } from 'react';
import Button from 'component/button';
import classnames from 'classnames';
import LoadingScreen from 'component/common/loading-screen';
import FileRender from 'component/fileRender';
import UriIndicator from 'component/uriIndicator';
import usePersistedState from 'effects/use-persisted-state';
import { FILE_WRAPPER_CLASS } from 'page/file/view';
import Draggable from 'react-draggable';
import Tooltip from 'component/common/tooltip';
import { onFullscreenChange } from 'util/full-screen';
import useIsMobile from 'effects/use-is-mobile';

type Props = {
  isFloating: boolean,
  fileInfo: FileListItem,
  uri: string,
  streamingUrl?: string,
  title: ?string,
  floatingPlayerEnabled: boolean,
  closeFloatingPlayer: () => void,
  renderMode: string,
  setPlayingUri: string => void,
};

export default function FileRenderFloating(props: Props) {
  const {
    fileInfo,
    uri,
    streamingUrl,
    title,
    isFloating,
    closeFloatingPlayer,
    floatingPlayerEnabled,
    renderMode,
    setPlayingUri,
  } = props;

  const isMobile = useIsMobile();
  const [fileViewerRect, setFileViewerRect] = useState();
  const [desktopPlayStartTime, setDesktopPlayStartTime] = useState();
  const [position, setPosition] = usePersistedState('floating-file-viewer:position', {
    x: -25,
    y: window.innerHeight - 400,
  });

  const isPlayable = RENDER_MODES.FLOATING_MODES.includes(renderMode);
  const isReadyToPlay = isPlayable && (streamingUrl || (fileInfo && fileInfo.completed));
  const loadingMessage =
    fileInfo && fileInfo.blobs_completed >= 1 && (!fileInfo.download_path || !fileInfo.written_bytes)
      ? __("It looks like you deleted or moved this file. We're rebuilding it now. It will only take a few seconds.")
      : __('Loading');

  useEffect(() => {
    function handleResize() {
      const element = document.querySelector(`.${FILE_WRAPPER_CLASS}`);
      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      // $FlowFixMe
      setFileViewerRect(rect);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    onFullscreenChange(window, 'add', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      onFullscreenChange(window, 'remove', handleResize);
    };
  }, [setFileViewerRect, isFloating]);

  useEffect(() => {
    // @if TARGET='app'
    setDesktopPlayStartTime(Date.now());
    // @endif

    return () => {
      // @if TARGET='app'
      setDesktopPlayStartTime(undefined);
      // @endif
    };
  }, [uri]);

  if (!isPlayable || !uri || (isFloating && (isMobile || !floatingPlayerEnabled))) {
    return null;
  }

  function handleDrag(e, ui) {
    const { x, y } = position;
    const newX = x + ui.deltaX;
    const newY = y + ui.deltaY;
    setPosition({
      x: newX,
      y: newY,
    });
  }

  return (
    <Draggable
      onDrag={handleDrag}
      defaultPosition={position}
      position={isFloating ? position : { x: 0, y: 0 }}
      bounds="parent"
      disabled={!isFloating}
      handle=".draggable"
      cancel=".button"
    >
      <div
        className={classnames('content__viewer', {
          'content__viewer--floating': isFloating,
          'content__viewer--inline': !isFloating,
        })}
        style={
          !isFloating && fileViewerRect
            ? { width: fileViewerRect.width, height: fileViewerRect.height, left: fileViewerRect.x }
            : {}
        }
      >
        <div
          className={classnames('content__wrapper', {
            'content__wrapper--floating': isFloating,
          })}
        >
          {isFloating && (
            <div className="draggable content__floating-header">
              <span className="media__uri--inline">{uri}</span>
              <div className="content__actions">
                <Tooltip label={__('View File')}>
                  <Button
                    navigate={uri}
                    onClick={() => {
                      setPlayingUri(uri);
                    }}
                    icon={ICONS.VIEW}
                    button="primary"
                  />
                </Tooltip>
                <Tooltip label={__('Close')}>
                  <Button onClick={closeFloatingPlayer} icon={ICONS.REMOVE} button="primary" />
                </Tooltip>
              </div>
            </div>
          )}

          {isReadyToPlay ? (
            <FileRender
              uri={uri}
              // @if TARGET='app'
              desktopPlayStartTime={desktopPlayStartTime}
              // @endif
            />
          ) : (
            <LoadingScreen status={loadingMessage} />
          )}
          {isFloating && (
            <div className="draggable content__info">
              <div className="claim-preview__title" title={title || uri}>
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
