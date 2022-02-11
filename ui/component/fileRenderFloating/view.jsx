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
import { generateListSearchUrlParams, formatLbryUrlForWeb } from 'util/url';
import { useIsMobile } from 'effects/use-screensize';
import debounce from 'util/debounce';
import { useHistory } from 'react-router';
import { isURIEqual } from 'util/lbryURI';
import AutoplayCountdown from 'component/autoplayCountdown';

// scss/init/vars.scss
// --header-height
const HEADER_HEIGHT = 60;
const HEADER_HEIGHT_MOBILE = 60;

const IS_DESKTOP_MAC = typeof process === 'object' ? process.platform === 'darwin' : false;
const DEBOUNCE_WINDOW_RESIZE_HANDLER_MS = 100;
export const INLINE_PLAYER_WRAPPER_CLASS = 'inline-player__wrapper';

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

function getFloatingPlayerRect() {
  // TODO: use 'fileViewerRect'?
  const FLOATING_PLAYER_CLASS = 'content__viewer--floating';
  const elem = document.querySelector(`.${FLOATING_PLAYER_CLASS}`);
  if (elem) {
    return elem.getBoundingClientRect();
  } else {
    return null;
  }
}

function clampRectToScreen(x, y, rect) {
  if (rect) {
    const ESTIMATED_SCROLL_BAR_PX = 50;
    const screenW = getScreenWidth();
    const screenH = getScreenHeight();

    if (x + rect.width > screenW - ESTIMATED_SCROLL_BAR_PX) {
      x = screenW - rect.width - ESTIMATED_SCROLL_BAR_PX;
    }

    if (y + rect.height > screenH) {
      y = screenH - rect.height;
    }
  }

  return { x, y };
}

function calculateRelativePos(x, y) {
  return {
    x: x / getScreenWidth(),
    y: y / getScreenHeight(),
  };
}

// ****************************************************************************
// ****************************************************************************

type Props = {
  isFloating: boolean,
  fileInfo: FileListItem,
  mature: boolean,
  uri: string,
  streamingUrl?: string,
  title: ?string,
  floatingPlayerEnabled: boolean,
  closeFloatingPlayer: () => void,
  clearSecondarySource: (string) => void,
  renderMode: string,
  playingUri: ?PlayingUri,
  primaryUri: ?string,
  videoTheaterMode: boolean,
  doFetchRecommendedContent: (string, boolean) => void,
  doPlayUri: (string, string, boolean) => void,
  collectionId: string,
  costInfo: any,
  claimWasPurchased: boolean,
  nextListUri: string,
  previousListUri: string,
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
    clearSecondarySource,
    floatingPlayerEnabled,
    renderMode,
    playingUri,
    primaryUri,
    videoTheaterMode,
    doFetchRecommendedContent,
    doPlayUri,
    collectionId,
    costInfo,
    claimWasPurchased,
    nextListUri,
    previousListUri,
  } = props;
  const { location, push } = useHistory();
  const hideFloatingPlayer = location.state && location.state.hideFloatingPlayer;
  const playingUriSource = playingUri && playingUri.source;
  const isComment = playingUriSource === 'comment';
  const isMobile = useIsMobile();
  const mainFilePlaying = !isFloating && primaryUri && isURIEqual(uri, primaryUri);

  const [fileViewerRect, setFileViewerRect] = useState();
  const [wasDragging, setWasDragging] = useState(false);
  const [doNavigate, setDoNavigate] = useState(false);
  const [playNextUrl, setPlayNextUrl] = useState(true);
  const [countdownCanceled, setCountdownCanceled] = useState(false);
  const [position, setPosition] = usePersistedState('floating-file-viewer:position', {
    x: -25,
    y: window.innerHeight - 400,
  });
  const relativePosRef = React.useRef({ x: 0, y: 0 });

  const navigateUrl =
    playingUri &&
    (playingUri.primaryUri || playingUri.uri) + (collectionId ? generateListSearchUrlParams(collectionId) : '');

  const isFree = costInfo && costInfo.cost === 0;
  const canViewFile = isFree || claimWasPurchased;
  const isPlayable = RENDER_MODES.FLOATING_MODES.includes(renderMode);
  const isReadyToPlay = isPlayable && (streamingUrl || (fileInfo && fileInfo.completed));
  const loadingMessage =
    fileInfo && fileInfo.blobs_completed >= 1 && (!fileInfo.download_path || !fileInfo.written_bytes)
      ? __("It looks like you deleted or moved this file. We're rebuilding it now. It will only take a few seconds.")
      : __('Loading');

  function restoreToRelativePosition() {
    const newX = Math.round(relativePosRef.current.x * getScreenWidth());
    const newY = Math.round(relativePosRef.current.y * getScreenHeight());
    setPosition(clampRectToScreen(newX, newY, getFloatingPlayerRect()));
  }

  const clampToScreenOnResize = React.useCallback(
    debounce(() => {
      restoreToRelativePosition();
    }, DEBOUNCE_WINDOW_RESIZE_HANDLER_MS),
    []
  );

  // ???
  useEffect(() => {
    if (isFloating) {
      // When the player begins floating, remove the comment source
      // so that it doesn't try to resize again in case of going back
      // to the origin's comment section and fail to position correctly
      if (isComment && playingUri) clearSecondarySource(playingUri.uri);
    }
  }, [isFloating, isComment, clearSecondarySource, playingUri]);

  // Initial update for relativePosRef:
  useEffect(() => {
    relativePosRef.current = calculateRelativePos(position.x, position.y);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Ensure player is within screen when 'isFloating' changes.
  useEffect(() => {
    if (isFloating) {
      restoreToRelativePosition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFloating]);

  // Listen to main-window resizing and adjust the fp position accordingly:
  useEffect(() => {
    if (isFloating) {
      window.addEventListener('resize', clampToScreenOnResize);
      return () => window.removeEventListener('resize', clampToScreenOnResize);
    }
  }, [isFloating, clampToScreenOnResize]);

  const handleResize = React.useCallback(() => {
    const element = mainFilePlaying
      ? document.querySelector(`.${PRIMARY_PLAYER_WRAPPER_CLASS}`)
      : document.querySelector(`.${INLINE_PLAYER_WRAPPER_CLASS}`);

    if (!element) return;

    const rect = element.getBoundingClientRect();

    // getBoundingClientRect returns a DomRect, not an object
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
  }, [mainFilePlaying]);

  useEffect(() => {
    if (playingUri && (playingUri.primaryUri || playingUri.uri)) {
      handleResize();
      setCountdownCanceled(false);
    }
  }, [handleResize, playingUri, videoTheaterMode]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    onFullscreenChange(window, 'add', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      onFullscreenChange(window, 'remove', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    if (isFloating) {
      doFetchRecommendedContent(uri, mature);
    }
  }, [doFetchRecommendedContent, isFloating, mature, uri]);

  const doPlay = React.useCallback(
    (playUri) => {
      setDoNavigate(false);
      if (!isFloating) {
        const navigateUrl = formatLbryUrlForWeb(playUri);
        push({
          pathname: navigateUrl,
          search: collectionId && generateListSearchUrlParams(collectionId),
          state: { collectionId, forceAutoplay: true, hideFloatingPlayer: true },
        });
      } else {
        doPlayUri(playUri, collectionId, true);
      }
    },
    [collectionId, doPlayUri, isFloating, push]
  );

  useEffect(() => {
    if (!doNavigate) return;

    if (playNextUrl && nextListUri) {
      doPlay(nextListUri);
    } else if (previousListUri) {
      doPlay(previousListUri);
    }
    setPlayNextUrl(true);
  }, [doNavigate, doPlay, nextListUri, playNextUrl, previousListUri]);

  if (
    !isPlayable ||
    !uri ||
    (isFloating && (isMobile || !floatingPlayerEnabled || hideFloatingPlayer)) ||
    (collectionId && !isFloating && ((!canViewFile && !nextListUri) || countdownCanceled))
  ) {
    return null;
  }

  function handleDragStart() {
    // Not really necessary, but reset just in case 'handleStop' didn't fire.
    setWasDragging(false);
  }

  function handleDragMove(e, ui) {
    const { x, y } = position;
    const newX = ui.x;
    const newY = ui.y;

    // Mark as dragging if the position changed and we were not dragging before.
    if (!wasDragging && (newX !== x || newY !== y)) {
      setWasDragging(true);
    }
  }

  function handleDragStop(e, ui) {
    if (wasDragging) {
      setWasDragging(false);
    }

    let newPos = { x: ui.x, y: ui.y };
    if (newPos.x !== position.x || newPos.y !== position.y) {
      newPos = clampRectToScreen(newPos.x, newPos.y, getFloatingPlayerRect());
      setPosition(newPos);
      relativePosRef.current = calculateRelativePos(newPos.x, newPos.y);
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
          'content__viewer--secondary': isComment,
          'content__viewer--theater-mode': !isFloating && videoTheaterMode && playingUri?.uri === primaryUri,
          'content__viewer--disable-click': wasDragging,
        })}
        style={
          !isFloating && fileViewerRect
            ? {
                width: fileViewerRect.width,
                height: fileViewerRect.height,
                left: fileViewerRect.x,
                top:
                  fileViewerRect.windowOffset +
                  fileViewerRect.top -
                  (isMobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT) -
                  (IS_DESKTOP_MAC ? 24 : 0),
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
            <FileRender className="draggable" uri={uri} />
          ) : (
            <>
              {collectionId && !canViewFile ? (
                <div className="content__loading">
                  <AutoplayCountdown
                    nextRecommendedUri={nextListUri}
                    doNavigate={() => setDoNavigate(true)}
                    doReplay={() => doPlayUri(uri, collectionId, false)}
                    doPrevious={() => {
                      setPlayNextUrl(false);
                      setDoNavigate(true);
                    }}
                    onCanceled={() => setCountdownCanceled(true)}
                    skipPaid
                  />
                </div>
              ) : (
                <LoadingScreen status={loadingMessage} />
              )}
            </>
          )}
          {isFloating && (
            <div className="draggable content__info">
              <div className="claim-preview__title" title={title || uri}>
                <Button label={title || uri} navigate={navigateUrl} button="link" className="content__floating-link" />
              </div>
              <UriIndicator link uri={uri} />
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
}
