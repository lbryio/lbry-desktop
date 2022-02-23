// @flow
import * as ICONS from 'constants/icons';
import * as RENDER_MODES from 'constants/file_render_modes';
import React from 'react';
import Button from 'component/button';
import classnames from 'classnames';
import LoadingScreen from 'component/common/loading-screen';
import FileRender from 'component/fileRender';
import UriIndicator from 'component/uriIndicator';
import usePersistedState from 'effects/use-persisted-state';
import { PRIMARY_PLAYER_WRAPPER_CLASS } from 'page/file/view';
import Draggable from 'react-draggable';
import { onFullscreenChange } from 'util/full-screen';
import { generateListSearchUrlParams } from 'util/url';
import { useIsMobile } from 'effects/use-screensize';
import debounce from 'util/debounce';
import { useHistory } from 'react-router';
import { isURIEqual } from 'util/lbryURI';
import AutoplayCountdown from 'component/autoplayCountdown';
import LivestreamIframeRender from 'component/livestreamLayout/iframe-render';
import usePlayNext from 'effects/use-play-next';
import { getScreenWidth, getScreenHeight, clampFloatingPlayerToScreen, calculateRelativePos } from './helper-functions';

// scss/init/vars.scss
// --header-height
const HEADER_HEIGHT = 60;
// --header-height-mobile
export const HEADER_HEIGHT_MOBILE = 56;

const IS_DESKTOP_MAC = typeof process === 'object' ? process.platform === 'darwin' : false;
const DEBOUNCE_WINDOW_RESIZE_HANDLER_MS = 100;
export const INLINE_PLAYER_WRAPPER_CLASS = 'inline-player__wrapper';
export const FLOATING_PLAYER_CLASS = 'content__viewer--floating';

// ****************************************************************************
// ****************************************************************************

type Props = {
  isFloating: boolean,
  uri: string,
  streamingUrl?: string,
  title: ?string,
  floatingPlayerEnabled: boolean,
  renderMode: string,
  playingUri: ?PlayingUri,
  primaryUri: ?string,
  videoTheaterMode: boolean,
  collectionId: string,
  costInfo: any,
  claimWasPurchased: boolean,
  nextListUri: string,
  previousListUri: string,
  doFetchRecommendedContent: (uri: string) => void,
  doUriInitiatePlay: (uri: string, collectionId: ?string, isPlayable: ?boolean, isFloating: ?boolean) => void,
  doSetPlayingUri: ({ uri?: ?string }) => void,
  // mobile only
  isCurrentClaimLive?: boolean,
  channelClaimId?: any,
  mobilePlayerDimensions?: any,
  doSetMobilePlayerDimensions: ({ height?: ?number, width?: ?number }) => void,
};

export default function FileRenderFloating(props: Props) {
  const {
    uri,
    streamingUrl,
    title,
    isFloating,
    floatingPlayerEnabled,
    renderMode,
    playingUri,
    primaryUri,
    videoTheaterMode,
    collectionId,
    costInfo,
    claimWasPurchased,
    nextListUri,
    previousListUri,
    doFetchRecommendedContent,
    doUriInitiatePlay,
    doSetPlayingUri,
    // mobile only
    isCurrentClaimLive,
    channelClaimId,
    mobilePlayerDimensions,
    doSetMobilePlayerDimensions,
  } = props;

  const isMobile = useIsMobile();

  const {
    location: { state },
  } = useHistory();
  const hideFloatingPlayer = state && state.hideFloatingPlayer;

  const playingUriSource = playingUri && playingUri.source;
  const isComment = playingUriSource === 'comment';
  const mainFilePlaying = (!isFloating || !isMobile) && primaryUri && isURIEqual(uri, primaryUri);
  const noFloatingPlayer = !isFloating || isMobile || !floatingPlayerEnabled || hideFloatingPlayer;

  const [fileViewerRect, setFileViewerRect] = React.useState();
  const [wasDragging, setWasDragging] = React.useState(false);
  const [doNavigate, setDoNavigate] = React.useState(false);
  const [shouldPlayNext, setPlayNext] = React.useState(true);
  const [countdownCanceled, setCountdownCanceled] = React.useState(false);
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
  const isPlayable = RENDER_MODES.FLOATING_MODES.includes(renderMode) || isCurrentClaimLive;
  const isReadyToPlay = isPlayable && streamingUrl;

  // ****************************************************************************
  // FUNCTIONS
  // ****************************************************************************

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

    if (!mobilePlayerDimensions || mobilePlayerDimensions.height !== rect.height) {
      doSetMobilePlayerDimensions({ height: rect.height, width: getScreenWidth() });
    }
  }, [doSetMobilePlayerDimensions, mainFilePlaying, mobilePlayerDimensions]);

  const restoreToRelativePosition = React.useCallback(() => {
    const SCROLL_BAR_PX = 12; // root: --body-scrollbar-width
    const screenW = getScreenWidth() - SCROLL_BAR_PX;
    const screenH = getScreenHeight();

    const newX = Math.round(relativePosRef.current.x * screenW);
    const newY = Math.round(relativePosRef.current.y * screenH);

    setPosition(clampFloatingPlayerToScreen(newX, newY));
  }, [setPosition]);

  const clampToScreenOnResize = React.useCallback(
    debounce(restoreToRelativePosition, DEBOUNCE_WINDOW_RESIZE_HANDLER_MS),
    []
  );

  // For playlists when pressing next/previous etc and switching players
  function resetState() {
    setCountdownCanceled(false);
    setDoNavigate(false);
    setPlayNext(true);
  }

  // ****************************************************************************
  // EFFECTS
  // ****************************************************************************

  usePlayNext(
    isFloating,
    collectionId,
    shouldPlayNext,
    nextListUri,
    previousListUri,
    doNavigate,
    doUriInitiatePlay,
    resetState
  );

  React.useEffect(() => {
    if (playingUri && (playingUri.primaryUri || playingUri.uri)) {
      handleResize();
    }
  }, [handleResize, playingUri, videoTheaterMode]);

  // Listen to main-window resizing and adjust the floating player position accordingly:
  React.useEffect(() => {
    if (isFloating) {
      // Ensure player is within screen when 'isFloating' changes.
      restoreToRelativePosition();
    } else {
      handleResize();
    }

    function onWindowResize() {
      return isFloating ? clampToScreenOnResize() : handleResize();
    }

    window.addEventListener('resize', onWindowResize);
    if (!isFloating) onFullscreenChange(window, 'add', handleResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (!isFloating) onFullscreenChange(window, 'remove', handleResize);
    };

    // Only listen to these and avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clampToScreenOnResize, handleResize, isFloating]);

  React.useEffect(() => {
    // Initial update for relativePosRef:
    relativePosRef.current = calculateRelativePos(position.x, position.y);

    // only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (isFloating && isComment) {
      // When the player begins floating, remove the comment source
      // so that it doesn't try to resize again in case of going back
      // to the origin's comment section and fail to position correctly
      doSetPlayingUri({ ...playingUri, source: null });
    }
  }, [doSetPlayingUri, isComment, isFloating, playingUri]);

  React.useEffect(() => {
    if (isFloating) doFetchRecommendedContent(uri);
  }, [doFetchRecommendedContent, isFloating, uri]);

  React.useEffect(() => {
    if (isFloating && isMobile) {
      doSetMobilePlayerDimensions({ height: null, width: null });
    }
  }, [doSetMobilePlayerDimensions, doSetPlayingUri, isFloating, isMobile]);

  if (
    !isPlayable ||
    !uri ||
    (isFloating && noFloatingPlayer) ||
    (collectionId && !isFloating && ((!canViewFile && !nextListUri) || countdownCanceled))
  ) {
    return null;
  }

  // ****************************************************************************
  // RENDER
  // ****************************************************************************

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
    if (wasDragging) setWasDragging(false);
    const { x, y } = ui;
    let newPos = { x, y };

    if (newPos.x !== position.x || newPos.y !== position.y) {
      newPos = clampFloatingPlayerToScreen(newPos.x, newPos.y);

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
      disabled={noFloatingPlayer}
      handle=".draggable"
      cancel=".button"
    >
      <div
        className={classnames('content__viewer', {
          [FLOATING_PLAYER_CLASS]: isFloating,
          'content__viewer--inline': !isFloating,
          'content__viewer--secondary': isComment,
          'content__viewer--theater-mode': !isFloating && videoTheaterMode && playingUri?.uri === primaryUri,
          'content__viewer--disable-click': wasDragging,
          'content__viewer--mobile': isMobile,
        })}
        style={
          !isFloating && fileViewerRect
            ? {
                width: fileViewerRect.width,
                height: fileViewerRect.height,
                left: fileViewerRect.x,
                top: isMobile
                  ? HEADER_HEIGHT_MOBILE
                  : fileViewerRect.windowOffset + fileViewerRect.top - HEADER_HEIGHT - (IS_DESKTOP_MAC ? 24 : 0),
              }
            : {}
        }
      >
        <div className={classnames('content__wrapper', { 'content__wrapper--floating': isFloating })}>
          {isFloating && (
            <Button
              title={__('Close')}
              onClick={() => doSetPlayingUri({ uri: null })}
              icon={ICONS.REMOVE}
              button="primary"
              className="content__floating-close"
            />
          )}

          {isCurrentClaimLive && channelClaimId ? (
            <LivestreamIframeRender channelClaimId={channelClaimId} showLivestream mobileVersion />
          ) : isReadyToPlay ? (
            <FileRender className="draggable" uri={uri} />
          ) : collectionId && !canViewFile ? (
            <div className="content__loading">
              <AutoplayCountdown
                nextRecommendedUri={nextListUri}
                doNavigate={() => setDoNavigate(true)}
                doReplay={() => doUriInitiatePlay(uri, collectionId, false, isFloating)}
                doPrevious={() => {
                  setPlayNext(false);
                  setDoNavigate(true);
                }}
                onCanceled={() => setCountdownCanceled(true)}
                skipPaid
              />
            </div>
          ) : (
            <LoadingScreen status={__('Loading')} />
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
