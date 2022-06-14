// @flow

// $FlowFixMe
import { Global } from '@emotion/react';

import type { ElementRef } from 'react';
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
import { generateListSearchUrlParams, formatLbryChannelName } from 'util/url';
import { useIsMobile, useIsMobileLandscape, useIsLandscapeScreen } from 'effects/use-screensize';
import debounce from 'util/debounce';
import { useHistory } from 'react-router';
import { isURIEqual } from 'util/lbryURI';
import AutoplayCountdown from 'component/autoplayCountdown';
import usePlayNext from 'effects/use-play-next';
import {
  getRootEl,
  getScreenWidth,
  getScreenHeight,
  clampFloatingPlayerToScreen,
  calculateRelativePos,
  getMaxLandscapeHeight,
  getAmountNeededToCenterVideo,
  getPossiblePlayerHeight,
} from './helper-functions';

// scss/init/vars.scss
// --header-height
const HEADER_HEIGHT = 60;
// --header-height-mobile
export const HEADER_HEIGHT_MOBILE = 56;

const DEBOUNCE_WINDOW_RESIZE_HANDLER_MS = 100;

export const INLINE_PLAYER_WRAPPER_CLASS = 'inline-player__wrapper';
export const CONTENT_VIEWER_CLASS = 'content__viewer';
export const FLOATING_PLAYER_CLASS = 'content__viewer--floating';

// ****************************************************************************
// ****************************************************************************

type Props = {
  claimId: ?string,
  channelUrl: ?string,
  isFloating: boolean,
  uri: string,
  streamingUrl?: string,
  title: ?string,
  floatingPlayerEnabled: boolean,
  renderMode: string,
  playingUri: PlayingUri,
  primaryUri: ?string,
  videoTheaterMode: boolean,
  collectionId: string,
  costInfo: any,
  claimWasPurchased: boolean,
  nextListUri: string,
  previousListUri: string,
  doFetchRecommendedContent: (uri: string) => void,
  doUriInitiatePlay: (playingOptions: PlayingUri, isPlayable: ?boolean, isFloating: ?boolean) => void,
  doSetPlayingUri: ({ uri?: ?string }) => void,
  isCurrentClaimLive?: boolean,
  videoAspectRatio: number,
  socketConnection: { connected: ?boolean },
  isLivestreamClaim: boolean,
  geoRestriction: ?GeoRestriction,
  appDrawerOpen: boolean,
  doCommentSocketConnect: (string, string, string) => void,
  doCommentSocketDisconnect: (string, string) => void,
  doClearPlayingUri: () => void,
};

export default function FileRenderFloating(props: Props) {
  const {
    claimId,
    channelUrl,
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
    socketConnection,
    isLivestreamClaim,
    doFetchRecommendedContent,
    doUriInitiatePlay,
    doSetPlayingUri,
    isCurrentClaimLive,
    videoAspectRatio,
    geoRestriction,
    appDrawerOpen,
    doCommentSocketConnect,
    doCommentSocketDisconnect,
    doClearPlayingUri,
  } = props;

  const isMobile = useIsMobile();
  const isTabletLandscape = useIsLandscapeScreen() && !isMobile;
  const isLandscapeRotated = useIsMobileLandscape();

  const initialMobileState = React.useRef(isMobile);
  const initialPlayerHeight = React.useRef();
  const resizedBetweenFloating = React.useRef();

  const {
    location: { state },
  } = useHistory();
  const hideFloatingPlayer = state && state.hideFloatingPlayer;

  const { uri: playingUrl, source: playingUriSource, primaryUri: playingPrimaryUri } = playingUri;

  const isComment = playingUriSource === 'comment';
  const mainFilePlaying = Boolean(!isFloating && primaryUri && isURIEqual(uri, primaryUri));
  const noFloatingPlayer = !isFloating || !floatingPlayerEnabled || hideFloatingPlayer;

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
  const noPlayerHeight = fileViewerRect?.height === 0;

  const navigateUrl =
    (playingPrimaryUri || playingUrl || '') + (collectionId ? generateListSearchUrlParams(collectionId) : '');

  const isFree = costInfo && costInfo.cost === 0;
  const canViewFile = isFree || claimWasPurchased;
  const isPlayable = RENDER_MODES.FLOATING_MODES.includes(renderMode) || isCurrentClaimLive;
  const isReadyToPlay = isCurrentClaimLive || (isPlayable && streamingUrl);

  const theaterMode = renderMode === 'video' || renderMode === 'audio' ? videoTheaterMode : false;

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

    // replace the initial value every time the window is resized if isMobile is true,
    // since it could be a portrait -> landscape rotation switch, or if it was a mobile - desktop
    // switch, so use the ref to compare the initial state
    const resizedEnoughForMobileSwitch = isMobile !== initialMobileState.current;
    if (videoAspectRatio && (!initialPlayerHeight.current || isMobile || resizedEnoughForMobileSwitch)) {
      const heightForRect = getPossiblePlayerHeight(videoAspectRatio * rect.width, isMobile);
      initialPlayerHeight.current = heightForRect;
    }

    // $FlowFixMe
    setFileViewerRect({ ...objectRect, windowOffset: window.pageYOffset });
  }, [isMobile, mainFilePlaying, videoAspectRatio]);

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

  // Establish web socket connection for viewer count.
  React.useEffect(() => {
    if (!claimId || !channelUrl || !isCurrentClaimLive) return;

    const channelName = formatLbryChannelName(channelUrl);

    // Only connect if not yet connected, so for example clicked on an embed instead of accessing
    // from the Livestream page
    if (!socketConnection?.connected) {
      doCommentSocketConnect(uri, channelName, claimId);
    }

    // This will be used to disconnect for every case, since this is the main player component
    return () => {
      if (socketConnection?.connected) {
        doCommentSocketDisconnect(claimId, channelName);
      }
    };
  }, [
    channelUrl,
    claimId,
    doCommentSocketConnect,
    doCommentSocketDisconnect,
    isCurrentClaimLive,
    socketConnection,
    uri,
  ]);

  React.useEffect(() => {
    if (playingPrimaryUri || playingUrl || noPlayerHeight) {
      handleResize();
    }
  }, [handleResize, playingPrimaryUri, theaterMode, playingUrl, noPlayerHeight]);

  // Listen to main-window resizing and adjust the floating player position accordingly:
  React.useEffect(() => {
    // intended to only run once: when floating player switches between true - false
    // otherwise handleResize() can run twice when this effect re-runs, so use
    // resizedBetweenFloating ref
    if (isFloating) {
      // Ensure player is within screen when 'isFloating' changes.
      restoreToRelativePosition();
      resizedBetweenFloating.current = false;
    } else if (!resizedBetweenFloating.current) {
      handleResize();
      resizedBetweenFloating.current = true;
    }

    function onWindowResize() {
      return isFloating ? clampToScreenOnResize() : handleResize();
    }

    window.addEventListener('resize', onWindowResize);
    if (!isFloating && !isMobile) onFullscreenChange(window, 'add', handleResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (!isFloating && !isMobile) onFullscreenChange(window, 'remove', handleResize);
    };

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
    return () => {
      // basically if switched videos (playingUrl change or unmount),
      // erase the data so it can be re-calculated
      if (playingUrl) {
        initialPlayerHeight.current = undefined;
      }
    };
  }, [playingUrl]);

  React.useEffect(() => {
    if (!primaryUri && !floatingPlayerEnabled && playingUrl && !playingUriSource) {
      doClearPlayingUri();
    }
  }, [doClearPlayingUri, floatingPlayerEnabled, playingUriSource, playingUrl, primaryUri]);

  if (
    geoRestriction ||
    !isPlayable ||
    !uri ||
    (isFloating && noFloatingPlayer) ||
    (collectionId && !isFloating && ((!canViewFile && !nextListUri) || countdownCanceled)) ||
    (isLivestreamClaim && !isCurrentClaimLive)
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
      handle=".draggable"
      cancel=".button"
      disabled={noFloatingPlayer}
    >
      <div
        className={classnames([CONTENT_VIEWER_CLASS], {
          [FLOATING_PLAYER_CLASS]: isFloating,
          'content__viewer--inline': !isFloating,
          'content__viewer--secondary': isComment,
          'content__viewer--theater-mode': theaterMode && mainFilePlaying && !isCurrentClaimLive && !isMobile,
          'content__viewer--disable-click': wasDragging,
          'content__viewer--mobile': isMobile && !isLandscapeRotated && !playingUriSource,
        })}
        style={
          !isFloating && fileViewerRect
            ? {
                width: fileViewerRect.width,
                height: appDrawerOpen ? `${getMaxLandscapeHeight()}px` : fileViewerRect.height,
                left: fileViewerRect.x,
                top:
                  isMobile && !playingUriSource
                    ? HEADER_HEIGHT_MOBILE
                    : fileViewerRect.windowOffset + fileViewerRect.top - HEADER_HEIGHT,
              }
            : {}
        }
      >
        {uri && videoAspectRatio && fileViewerRect ? (
          <PlayerGlobalStyles
            videoAspectRatio={videoAspectRatio}
            theaterMode={theaterMode}
            appDrawerOpen={appDrawerOpen && !isLandscapeRotated && !isTabletLandscape}
            initialPlayerHeight={initialPlayerHeight}
            isFloating={isFloating}
            fileViewerRect={fileViewerRect}
            mainFilePlaying={mainFilePlaying}
            isLandscapeRotated={isLandscapeRotated}
            isTabletLandscape={isTabletLandscape}
          />
        ) : null}

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

          {isReadyToPlay ? (
            <FileRender className={classnames({ draggable: !isMobile })} uri={uri} />
          ) : collectionId && !canViewFile ? (
            <div className="content__loading">
              <AutoplayCountdown
                nextRecommendedUri={nextListUri}
                doNavigate={() => setDoNavigate(true)}
                doReplay={() => doUriInitiatePlay({ uri, collectionId }, false, isFloating)}
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
            <div className={classnames('content__info', { draggable: !isMobile })}>
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

type GlobalStylesProps = {
  videoAspectRatio: number,
  theaterMode: boolean,
  appDrawerOpen: boolean,
  initialPlayerHeight: ElementRef<any>,
  isFloating: boolean,
  fileViewerRect: any,
  mainFilePlaying: boolean,
  isLandscapeRotated: boolean,
  isTabletLandscape: boolean,
};

const PlayerGlobalStyles = (props: GlobalStylesProps) => {
  const {
    videoAspectRatio,
    theaterMode,
    appDrawerOpen,
    initialPlayerHeight,
    isFloating,
    fileViewerRect,
    mainFilePlaying,
    isLandscapeRotated,
    isTabletLandscape,
  } = props;

  const isMobile = useIsMobile();
  const isMobilePlayer = isMobile && !isFloating; // to avoid miniplayer -> file page only

  const heightForViewer = getPossiblePlayerHeight(videoAspectRatio * fileViewerRect.width, isMobile);
  const widthForViewer = heightForViewer / videoAspectRatio;
  const maxLandscapeHeight = getMaxLandscapeHeight(isMobile ? undefined : widthForViewer);
  const heightResult = appDrawerOpen ? `${maxLandscapeHeight}px` : `${heightForViewer}px`;
  const amountNeededToCenter = getAmountNeededToCenterVideo(heightForViewer, maxLandscapeHeight);

  // forceDefaults = no styles should be applied to any of these conditions
  // !mainFilePlaying = embeds on markdown (comments or posts)
  const forceDefaults = !mainFilePlaying || theaterMode || isFloating || isMobile;

  const videoGreaterThanLandscape = heightForViewer > maxLandscapeHeight;

  // Handles video shrink + center on mobile view
  // direct DOM manipulation due to performance for every scroll
  React.useEffect(() => {
    if (!isMobilePlayer || !mainFilePlaying || appDrawerOpen || isLandscapeRotated || isTabletLandscape) return;

    const viewer = document.querySelector(`.${CONTENT_VIEWER_CLASS}`);
    if (viewer) viewer.style.height = `${heightForViewer}px`;

    function handleScroll() {
      const rootEl = getRootEl();

      const viewer = document.querySelector(`.${CONTENT_VIEWER_CLASS}`);
      const videoNode = document.querySelector('.vjs-tech');
      const touchOverlay = document.querySelector('.vjs-touch-overlay');

      if (rootEl && viewer) {
        const scrollTop = window.pageYOffset || rootEl.scrollTop;
        const isHigherThanLandscape = scrollTop < initialPlayerHeight.current - maxLandscapeHeight;

        if (videoNode) {
          if (isHigherThanLandscape) {
            if (initialPlayerHeight.current > maxLandscapeHeight) {
              const result = initialPlayerHeight.current - scrollTop;
              const amountNeededToCenter = getAmountNeededToCenterVideo(videoNode.offsetHeight, result);

              videoNode.style.top = `${amountNeededToCenter}px`;
              if (touchOverlay) touchOverlay.style.height = `${result}px`;
              viewer.style.height = `${result}px`;
            }
          } else {
            if (touchOverlay) touchOverlay.style.height = `${maxLandscapeHeight}px`;
            viewer.style.height = `${maxLandscapeHeight}px`;
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      // clear the added styles on unmount
      const viewer = document.querySelector(`.${CONTENT_VIEWER_CLASS}`);
      // $FlowFixMe
      if (viewer) viewer.style.height = undefined;
      const touchOverlay = document.querySelector('.vjs-touch-overlay');
      if (touchOverlay) touchOverlay.removeAttribute('style');

      window.removeEventListener('scroll', handleScroll);
    };
  }, [
    appDrawerOpen,
    heightForViewer,
    isMobilePlayer,
    mainFilePlaying,
    maxLandscapeHeight,
    initialPlayerHeight,
    isLandscapeRotated,
    isTabletLandscape,
  ]);

  React.useEffect(() => {
    if (appDrawerOpen && videoGreaterThanLandscape && isMobilePlayer) {
      const videoNode = document.querySelector('.vjs-tech');
      if (videoNode) videoNode.style.top = `${amountNeededToCenter}px`;
    }

    if (isMobile && isFloating) {
      const viewer = document.querySelector(`.${CONTENT_VIEWER_CLASS}`);
      if (viewer) viewer.removeAttribute('style');
      const touchOverlay = document.querySelector('.vjs-touch-overlay');
      if (touchOverlay) touchOverlay.removeAttribute('style');
      const videoNode = document.querySelector('.vjs-tech');
      if (videoNode) videoNode.removeAttribute('style');
    }
  }, [amountNeededToCenter, appDrawerOpen, isFloating, isMobile, isMobilePlayer, videoGreaterThanLandscape]);

  React.useEffect(() => {
    if (isTabletLandscape) {
      const videoNode = document.querySelector('.vjs-tech');
      if (videoNode) videoNode.removeAttribute('style');
      const touchOverlay = document.querySelector('.vjs-touch-overlay');
      if (touchOverlay) touchOverlay.removeAttribute('style');
    }
  }, [isTabletLandscape]);

  // -- render styles --

  // declaring some style objects as variables makes it easier for repeated cases
  const transparentBackground = {
    background: videoGreaterThanLandscape && mainFilePlaying && !forceDefaults ? 'transparent !important' : undefined,
  };
  const maxHeight = {
    maxHeight: !theaterMode && !isMobile ? 'var(--desktop-portrait-player-max-height)' : undefined,
  };

  return (
    <Global
      styles={{
        [`.${PRIMARY_PLAYER_WRAPPER_CLASS}`]: {
          height:
            !theaterMode && mainFilePlaying && fileViewerRect?.height > 0 ? `${heightResult} !important` : undefined,
          opacity: !theaterMode && mainFilePlaying ? '0 !important' : undefined,
        },

        '.file-render--video': {
          ...transparentBackground,
          ...maxHeight,

          video: maxHeight,
        },
        '.content__wrapper': transparentBackground,
        '.video-js': {
          ...transparentBackground,

          '.vjs-touch-overlay': {
            maxHeight: isTabletLandscape ? 'var(--desktop-portrait-player-max-height) !important' : undefined,
          },
        },

        '.vjs-fullscreen': {
          video: {
            top: 'unset !important',
            height: '100% !important',
          },
          '.vjs-touch-overlay': {
            height: '100% !important',
            maxHeight: 'unset !important',
          },
        },

        '.vjs-tech': {
          opacity: '1',
          height:
            isMobilePlayer && ((appDrawerOpen && videoGreaterThanLandscape) || videoGreaterThanLandscape)
              ? 'unset !important'
              : '100%',
          position: 'absolute',
          top: isFloating ? '0px !important' : undefined,
        },

        [`.${CONTENT_VIEWER_CLASS}`]: {
          height:
            (!forceDefaults || isLandscapeRotated) && (!isMobile || isMobilePlayer)
              ? `${heightResult} !important`
              : undefined,
          ...maxHeight,
        },
      }}
    />
  );
};
