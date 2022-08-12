// @flow

// $FlowFixMe
import { Global } from '@emotion/react';

import type { ElementRef } from 'react';
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import * as RENDER_MODES from 'constants/file_render_modes';
import { INLINE_PLAYER_WRAPPER_CLASS, FLOATING_PLAYER_CLASS, DEFAULT_INITIAL_FLOATING_POS } from 'constants/player';
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
} from 'util/window';
import PlaylistCard from 'component/playlistCard';

// scss/init/vars.scss
// --header-height
const HEADER_HEIGHT = 60;
// --header-height-mobile
export const HEADER_HEIGHT_MOBILE = 56;

const DEBOUNCE_WINDOW_RESIZE_HANDLER_MS = 100;

const CONTENT_VIEWER_CLASS = 'content__viewer';

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
  collectionSidebarId: ?string,
  costInfo: any,
  claimWasPurchased: boolean,
  nextListUri: string,
  previousListUri: string,
  doFetchRecommendedContent: (uri: string) => void,
  doUriInitiatePlay: (playingOptions: PlayingUri, isPlayable: ?boolean, isFloating: ?boolean) => void,
  isCurrentClaimLive?: boolean,
  videoAspectRatio: number,
  socketConnection: { connected: ?boolean },
  isLivestreamClaim: boolean,
  geoRestriction: ?GeoRestriction,
  appDrawerOpen: boolean,
  playingCollection: Collection,
  hasClaimInQueue: boolean,
  mainPlayerDimensions: { height: number, width: number },
  firstCollectionItemUrl: ?string,
  isMature: boolean,
  location: { state?: { overrideFloating?: boolean } },
  doCommentSocketConnect: (string, string, string) => void,
  doCommentSocketDisconnect: (string, string) => void,
  doClearPlayingUri: () => void,
  doClearQueueList: () => void,
  doOpenModal: (id: string, {}) => void,
  doClearPlayingSource: () => void,
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
    collectionSidebarId,
    costInfo,
    claimWasPurchased,
    nextListUri,
    previousListUri,
    socketConnection,
    isLivestreamClaim,
    doFetchRecommendedContent,
    doUriInitiatePlay,
    isCurrentClaimLive,
    videoAspectRatio,
    geoRestriction,
    appDrawerOpen,
    playingCollection,
    hasClaimInQueue,
    mainPlayerDimensions,
    firstCollectionItemUrl,
    isMature,
    location,
    doCommentSocketConnect,
    doCommentSocketDisconnect,
    doClearPlayingUri,
    doClearQueueList,
    doOpenModal,
    doClearPlayingSource,
  } = props;

  const { state } = location;
  const { overrideFloating } = state || {};

  const isMobile = useIsMobile();
  const isTabletLandscape = useIsLandscapeScreen() && !isMobile;
  const isLandscapeRotated = useIsMobileLandscape();

  const initialMobileState = React.useRef(isMobile);
  const initialPlayerHeight = React.useRef();
  const resizedBetweenFloating = React.useRef();

  const { uri: playingUrl, source: playingUriSource, primaryUri: playingPrimaryUri } = playingUri;

  const isComment = playingUriSource === 'comment';
  const mainFilePlaying = Boolean(!isFloating && primaryUri && isURIEqual(uri, primaryUri));
  const noFloatingPlayer = !overrideFloating && (!isFloating || !floatingPlayerEnabled);

  const [fileViewerRect, setFileViewerRect] = React.useState();
  const [wasDragging, setWasDragging] = React.useState(false);
  const [doNavigate, setDoNavigate] = React.useState(false);
  const [shouldPlayNext, setPlayNext] = React.useState(true);
  const [countdownCanceled, setCountdownCanceled] = React.useState(false);
  const [forceDisable, setForceDisable] = React.useState(false);
  const [position, setPosition] = usePersistedState('floating-file-viewer:position', DEFAULT_INITIAL_FLOATING_POS);
  const relativePosRef = React.useRef(calculateRelativePos(position.x, position.y));
  const noPlayerHeight = fileViewerRect?.height === 0;

  const navigateUrl =
    (playingPrimaryUri || playingUrl || '') + (collectionId ? generateListSearchUrlParams(collectionId) : '');

  const isFree = costInfo && costInfo.cost === 0;
  const isLoading = !costInfo || (!streamingUrl && !costInfo.cost);
  const canViewFile = isFree || claimWasPurchased;
  const isPlayable = RENDER_MODES.FLOATING_MODES.includes(renderMode) || isCurrentClaimLive;
  const isReadyToPlay = isCurrentClaimLive || (isPlayable && streamingUrl);

  const theaterMode = renderMode === 'video' || renderMode === 'audio' ? videoTheaterMode : false;

  // ****************************************************************************
  // FUNCTIONS
  // ****************************************************************************

  const handleResize = React.useCallback(() => {
    const filePageElement = document.querySelector(`.${PRIMARY_PLAYER_WRAPPER_CLASS}`);

    const playingElement = mainFilePlaying
      ? filePageElement
      : document.querySelector(`.${INLINE_PLAYER_WRAPPER_CLASS}`);

    const element = playingElement || filePageElement;

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

    // force re-calculate when sourceId changes (playing a new claimLink on the same page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, mainFilePlaying, videoAspectRatio, playingUri.sourceId]);

  const restoreToRelativePosition = React.useCallback(() => {
    const SCROLL_BAR_PX = 12; // root: --body-scrollbar-width
    const screenW = getScreenWidth() - SCROLL_BAR_PX;
    const screenH = getScreenHeight();

    const newX = Math.round(relativePosRef.current.x * screenW);
    const newY = Math.round(relativePosRef.current.y * screenH);
    const clampPosition = clampFloatingPlayerToScreen({ x: newX, y: newY });

    if (![clampPosition.x, clampPosition.y].some(isNaN)) {
      setPosition(clampPosition);
    }
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
    nextListUri || firstCollectionItemUrl,
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
    if (playingPrimaryUri || playingUrl || noPlayerHeight || collectionSidebarId) {
      handleResize();
      setCountdownCanceled(false);
    }
  }, [handleResize, playingPrimaryUri, theaterMode, playingUrl, noPlayerHeight, collectionSidebarId]);

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
      if (isFloating) clampToScreenOnResize();
      if (collectionSidebarId || !isFloating) handleResize();
    }

    window.addEventListener('resize', onWindowResize);
    if (!isFloating && !isMobile) onFullscreenChange(window, 'add', handleResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (!isFloating && !isMobile) onFullscreenChange(window, 'remove', handleResize);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clampToScreenOnResize, handleResize, isFloating, collectionSidebarId]);

  React.useEffect(() => {
    // Initial update for relativePosRef:
    relativePosRef.current = calculateRelativePos(position.x, position.y);

    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only on mount
  }, []);

  React.useEffect(() => {
    if (isFloating && isComment) {
      // When the player begins floating, remove the comment source
      // so that it doesn't try to resize again in case of going back
      // to the origin's comment section and fail to position correctly
      doClearPlayingSource();
    }
  }, [doClearPlayingSource, isComment, isFloating]);

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
    if (primaryUri && uri && primaryUri !== uri && !overrideFloating && !floatingPlayerEnabled && playingUrl) {
      doClearPlayingUri();
    }
  }, [doClearPlayingUri, floatingPlayerEnabled, overrideFloating, playingUrl, primaryUri, uri]);

  if (
    geoRestriction ||
    (!isPlayable && !collectionSidebarId) ||
    (!uri && !collectionSidebarId) ||
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
      newPos = clampFloatingPlayerToScreen(newPos);

      setPosition(newPos);
      relativePosRef.current = calculateRelativePos(newPos.x, newPos.y);
    }
  }

  return (
    <>
      {(uri && videoAspectRatio) || collectionSidebarId ? (
        <PlayerGlobalStyles
          videoAspectRatio={videoAspectRatio}
          theaterMode={theaterMode}
          appDrawerOpen={appDrawerOpen && !isLandscapeRotated && !isTabletLandscape}
          initialPlayerHeight={initialPlayerHeight}
          isFloating={isFloating}
          fileViewerRect={fileViewerRect || mainPlayerDimensions}
          mainFilePlaying={mainFilePlaying}
          isLandscapeRotated={isLandscapeRotated}
          isTabletLandscape={isTabletLandscape}
        />
      ) : null}

      {uri && isPlayable && (
        <Draggable
          onDrag={handleDragMove}
          onStart={handleDragStart}
          onStop={handleDragStop}
          defaultPosition={position}
          position={isFloating ? position : { x: 0, y: 0 }}
          bounds="parent"
          handle=".draggable"
          cancel=".button"
          disabled={noFloatingPlayer || forceDisable}
        >
          <div
            className={classnames([CONTENT_VIEWER_CLASS], {
              [FLOATING_PLAYER_CLASS]: isFloating,
              'content__viewer--inline': !isFloating,
              'content__viewer--secondary': isComment,
              'content__viewer--theater-mode': theaterMode && mainFilePlaying && !isMobile,
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
            <div className={classnames('content__wrapper', { 'content__wrapper--floating': isFloating })}>
              {isFloating && (
                <Button
                  title={__('Close')}
                  onClick={() => {
                    if (hasClaimInQueue) {
                      doOpenModal(MODALS.CONFIRM, {
                        title: __('Close Player'),
                        subtitle: __('Are you sure you want to close the player and clear the current Queue?'),
                        onConfirm: (closeModal) => {
                          doClearPlayingUri();
                          doClearQueueList();
                          closeModal();
                        },
                      });
                    } else {
                      doClearPlayingUri();
                    }
                  }}
                  icon={ICONS.REMOVE}
                  button="primary"
                  className="content__floating-close"
                />
              )}

              {isReadyToPlay && !isMature ? (
                <FileRender className={classnames({ draggable: !isMobile })} uri={uri} />
              ) : isLoading ? (
                <LoadingScreen status={__('Loading')} />
              ) : (
                (!collectionId || !canViewFile || isMature) && (
                  <div className="content__loading">
                    <AutoplayCountdown
                      uri={uri}
                      nextRecommendedUri={nextListUri || firstCollectionItemUrl}
                      doNavigate={() => setDoNavigate(true)}
                      doReplay={() => doUriInitiatePlay({ uri, collection: { collectionId } }, false, isFloating)}
                      doPrevious={
                        !previousListUri
                          ? undefined
                          : () => {
                              setPlayNext(false);
                              setDoNavigate(true);
                            }
                      }
                      onCanceled={() => setCountdownCanceled(true)}
                      skipPaid
                      skipMature
                    />
                  </div>
                )
              )}

              {isFloating && (
                <div className={classnames('content__info', { draggable: !isMobile })}>
                  <div className="content-info__text">
                    <div className="claim-preview__title" title={title || uri}>
                      <Button
                        label={title || uri}
                        navigate={navigateUrl}
                        button="link"
                        className="content__floating-link"
                      />
                    </div>

                    <UriIndicator link uri={uri} />
                  </div>

                  {playingCollection && collectionSidebarId !== collectionId && (
                    <PlaylistCard
                      id={collectionId}
                      uri={uri}
                      disableClickNavigation
                      doDisablePlayerDrag={setForceDisable}
                      isFloating
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </Draggable>
      )}
    </>
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

  const justChanged = React.useRef();

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
    if (!isMobilePlayer || !mainFilePlaying || isLandscapeRotated || isTabletLandscape) return;

    const viewer = document.querySelector(`.${CONTENT_VIEWER_CLASS}`);
    if (viewer) {
      if (!appDrawerOpen && heightForViewer) viewer.style.height = `${heightForViewer}px`;

      if (!appDrawerOpen) {
        const htmlEl = document.querySelector('html');
        if (htmlEl) htmlEl.scrollTop = 0;
      }

      justChanged.current = true;
    }

    if (appDrawerOpen) return;

    function handleScroll() {
      const rootEl = getRootEl();

      if (justChanged.current) {
        justChanged.current = false;
        return;
      }

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
    if (videoGreaterThanLandscape && isMobilePlayer) {
      const videoNode = document.querySelector('.vjs-tech');
      if (videoNode) {
        const top = appDrawerOpen ? amountNeededToCenter : 0;
        videoNode.style.top = `${top}px`;
      }
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
          height: '100%',
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

        '.playlist-card': {
          maxHeight:
            !isMobile && !theaterMode && mainFilePlaying
              ? `${heightForViewer}px`
              : isMobile
              ? '100%'
              : fileViewerRect
              ? `${fileViewerRect.height}px`
              : undefined,
        },
      }}
    />
  );
};
