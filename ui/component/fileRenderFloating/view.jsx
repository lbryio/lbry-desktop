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
import { PRIMARY_PLAYER_WRAPPER_CLASS } from 'page/file/view';
import Draggable from 'react-draggable';
import { onFullscreenChange } from 'util/full-screen';
import { useIsMobile } from 'effects/use-screensize';
import debounce from 'util/debounce';
import { useHistory } from 'react-router';

const IS_DESKTOP_MAC = typeof process === 'object' ? process.platform === 'darwin' : false;
const DEBOUNCE_WINDOW_RESIZE_HANDLER_MS = 60;
export const INLINE_PLAYER_WRAPPER_CLASS = 'inline-player__wrapper';

type Props = {
  isFloating: boolean,
  fileInfo: FileListItem,
  mature: boolean,
  uri: string,
  streamingUrl?: string,
  title: ?string,
  floatingPlayerEnabled: boolean,
  closeFloatingPlayer: () => void,
  renderMode: string,
  playingUri: ?PlayingUri,
  primaryUri: ?string,
  videoTheaterMode: boolean,
  doFetchRecommendedContent: (string, boolean) => void,
};

export default function FileRenderFloating(props: Props) {
  const {
    fileInfo,
    mature,
    uri,
    streamingUrl,
    title,
    isFloating,
    closeFloatingPlayer,
    floatingPlayerEnabled,
    renderMode,
    playingUri,
    primaryUri,
    videoTheaterMode,
    doFetchRecommendedContent,
  } = props;
  const {
    location: { pathname },
  } = useHistory();
  const isMobile = useIsMobile();
  const mainFilePlaying = playingUri && playingUri.uri === primaryUri;
  const [fileViewerRect, setFileViewerRect] = useState();
  const [desktopPlayStartTime, setDesktopPlayStartTime] = useState();
  const [wasDragging, setWasDragging] = useState(false);
  const [position, setPosition] = usePersistedState('floating-file-viewer:position', {
    x: -25,
    y: window.innerHeight - 400,
  });
  const [relativePos, setRelativePos] = useState({
    x: 0,
    y: 0,
  });

  const playingUriSource = playingUri && playingUri.source;
  const isPlayable = RENDER_MODES.FLOATING_MODES.includes(renderMode);
  const isReadyToPlay = isPlayable && (streamingUrl || (fileInfo && fileInfo.completed));
  const loadingMessage =
    fileInfo && fileInfo.blobs_completed >= 1 && (!fileInfo.download_path || !fileInfo.written_bytes)
      ? __("It looks like you deleted or moved this file. We're rebuilding it now. It will only take a few seconds.")
      : __('Loading');

  function getScreenWidth() {
    if (document && document.documentElement) {
      return document.documentElement.clientWidth;
    } else {
      return window.innerWidth;
    }
  }

  function getScreenHeight() {
    if (document && document.documentElement) {
      return document.documentElement.clientHeight;
    } else {
      return window.innerHeight;
    }
  }

  function clampToScreen(pos) {
    const ESTIMATED_SCROLL_BAR_PX = 50;
    const FLOATING_PLAYER_CLASS = 'content__viewer--floating';
    const fpPlayerElem = document.querySelector(`.${FLOATING_PLAYER_CLASS}`);

    if (fpPlayerElem) {
      if (pos.x + fpPlayerElem.getBoundingClientRect().width > getScreenWidth() - ESTIMATED_SCROLL_BAR_PX) {
        pos.x = getScreenWidth() - fpPlayerElem.getBoundingClientRect().width - ESTIMATED_SCROLL_BAR_PX;
      }
      if (pos.y + fpPlayerElem.getBoundingClientRect().height > getScreenHeight()) {
        pos.y = getScreenHeight() - fpPlayerElem.getBoundingClientRect().height;
      }
    }
  }

  // Updated 'relativePos' based on persisted 'position':
  const stringifiedPosition = JSON.stringify(position);
  useEffect(() => {
    const jsonPosition = JSON.parse(stringifiedPosition);

    setRelativePos({
      x: jsonPosition.x / getScreenWidth(),
      y: jsonPosition.y / getScreenHeight(),
    });
  }, [stringifiedPosition]);

  // Ensure player is within screen when 'isFloating' changes.
  useEffect(() => {
    const jsonPosition = JSON.parse(stringifiedPosition);

    if (isFloating) {
      let pos = { x: jsonPosition.x, y: jsonPosition.y };
      clampToScreen(pos);
      if (pos.x !== position.x || pos.y !== position.y) {
        setPosition({ x: pos.x, y: pos.y });
      }
    }
  }, [isFloating, stringifiedPosition]);

  // Listen to main-window resizing and adjust the fp position accordingly:
  useEffect(() => {
    const handleMainWindowResize = debounce((e) => {
      let newPos = {
        x: Math.round(relativePos.x * getScreenWidth()),
        y: Math.round(relativePos.y * getScreenHeight()),
      };
      clampToScreen(newPos);
      setPosition({ x: newPos.x, y: newPos.y });
    }, DEBOUNCE_WINDOW_RESIZE_HANDLER_MS);

    window.addEventListener('resize', handleMainWindowResize);
    return () => window.removeEventListener('resize', handleMainWindowResize);

    // 'relativePos' is needed in the dependency list to avoid stale closure.
    // Otherwise, this could just be changed to a one-time effect.
  }, [relativePos]);

  function handleResize() {
    const element = mainFilePlaying
      ? document.querySelector(`.${PRIMARY_PLAYER_WRAPPER_CLASS}`)
      : document.querySelector(`.${INLINE_PLAYER_WRAPPER_CLASS}`);

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();

    // getBoundingCLientRect returns a DomRect, not an object
    const objectRect = {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      // $FlowFixMe
      x: rect.x,
    };

    // $FlowFixMe
    setFileViewerRect({ ...objectRect, windowOffset: window.pageYOffset });
  }

  useEffect(() => {
    if (streamingUrl) {
      handleResize();
    }
  }, [streamingUrl, pathname, playingUriSource, isFloating, mainFilePlaying]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    onFullscreenChange(window, 'add', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      onFullscreenChange(window, 'remove', handleResize);
    };
  }, [setFileViewerRect, isFloating, playingUriSource, mainFilePlaying, videoTheaterMode]);

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

  useEffect(() => {
    if (isFloating) {
      doFetchRecommendedContent(uri, mature);
    }
  }, [uri, mature, isFloating]);

  if (!isPlayable || !uri || (isFloating && (isMobile || !floatingPlayerEnabled))) {
    return null;
  }

  function handleDragStart(e, ui) {
    // Not really necessary, but reset just in case 'handleStop' didn't fire.
    setWasDragging(false);
  }

  function handleDragMove(e, ui) {
    setWasDragging(true);
    const { x, y } = position;
    const newX = x + ui.deltaX;
    const newY = y + ui.deltaY;
    setPosition({
      x: newX,
      y: newY,
    });
  }

  function handleDragStop(e, ui) {
    if (wasDragging) {
      e.stopPropagation();
      setWasDragging(false);
      setRelativePos({
        x: position.x / getScreenWidth(),
        y: position.y / getScreenHeight(),
      });
    }
  }

  return (
    <Draggable
      onDrag={handleDragMove}
      onStart={handleDragStart}
      onStop={handleDragStop}
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
          'content__viewer--secondary': playingUriSource === 'comment',
          'content__viewer--theater-mode': !isFloating && videoTheaterMode,
        })}
        style={
          !isFloating && fileViewerRect
            ? {
                width: fileViewerRect.width,
                height: fileViewerRect.height,
                left: fileViewerRect.x,
                // 80px is header height in scss/init/vars.scss
                top: fileViewerRect.windowOffset + fileViewerRect.top - 80 - (IS_DESKTOP_MAC ? 24 : 0),
              }
            : {}
        }
      >
        <div
          className={classnames('content__wrapper', {
            'content__wrapper--floating': isFloating,
          })}
        >
          {isFloating && (
            <Button
              title={__('Close')}
              onClick={closeFloatingPlayer}
              icon={ICONS.REMOVE}
              button="primary"
              className="content__floating-close"
            />
          )}

          {isReadyToPlay ? (
            <FileRender
              className="draggable"
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
                <Button label={title || uri} navigate={uri} button="link" className="content__floating-link" />
              </div>
              <UriIndicator link uri={uri} />
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
}
