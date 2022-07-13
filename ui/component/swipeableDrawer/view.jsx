// @flow
import 'scss/component/_swipeable-drawer.scss';

// $FlowFixMe;
import { Global } from '@emotion/react';
// $FlowFixMe
import { grey } from '@mui/material/colors';

import { HEADER_HEIGHT_MOBILE } from 'component/fileRenderFloating/view';
import { PRIMARY_PLAYER_WRAPPER_CLASS, PRIMARY_IMAGE_WRAPPER_CLASS } from 'page/file/view';
import { getMaxLandscapeHeight } from 'util/window';
import Drawer from '@mui/material/Drawer';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import * as DRAWERS from 'constants/drawer_types';
import Button from 'component/button';
import classnames from 'classnames';

const TRANSITION_MS = 225;
const TRANSITION_STR = `${TRANSITION_MS}ms cubic-bezier(0, 0, 0.2, 1) 0ms`;

type Props = {
  children: Node,
  title: any,
  hasSubtitle?: boolean,
  actions?: any,
  type: string,
  startOpen?: boolean,
  // -- redux --
  open: boolean,
  theme: string,
  doToggleAppDrawer: (type: string) => void,
};

export default function SwipeableDrawer(props: Props) {
  const { title, hasSubtitle, children, type, startOpen, open, theme, actions, doToggleAppDrawer } = props;

  const pullerHeight = type === DRAWERS.PLAYLIST ? 110 : 42;

  const drawerRoot = React.useRef();
  const backdropRef = React.useRef();
  const paperRef = React.useRef();

  const pausedByDrawer = React.useRef(false);
  const touchPos = React.useRef();
  const openPrev = React.useRef(open);

  const [playerHeight, setPlayerHeight] = React.useState(getMaxLandscapeHeight());

  const landscapePlayerHeight = HEADER_HEIGHT_MOBILE + getMaxLandscapeHeight();
  const contentHeight = HEADER_HEIGHT_MOBILE + playerHeight;

  function toggleDrawer() {
    doToggleAppDrawer(type);
  }

  function handleTouchMove(e) {
    const touchPosY = e.touches[0].clientY;
    touchPos.current = touchPosY;
    const draggingBelowHeader = touchPosY > HEADER_HEIGHT_MOBILE;

    if (draggingBelowHeader) {
      const root = drawerRoot.current;
      if (root) {
        root.setAttribute('style', `transform: none !important`);
      }

      if (paperRef.current) {
        paperRef.current.setAttribute('style', `transform: translateY(${touchPosY}px) !important`);
      }

      // makes the backdrop lighter/darker based on how high/low the drawer is
      const backdrop = backdropRef.current;
      if (backdrop) {
        const isDraggingAboveVideo = touchPosY < playerHeight + HEADER_HEIGHT_MOBILE;
        let backdropTop = contentHeight;
        // $FlowFixMe
        let backdropHeight = document.documentElement.getBoundingClientRect().height - backdropTop;
        let opacity = ((touchPosY - HEADER_HEIGHT_MOBILE) / backdropHeight) * -1 + 1;

        // increase the backdrop height so it also covers the video when pulling the drawer up
        if (isDraggingAboveVideo) {
          backdropTop = HEADER_HEIGHT_MOBILE;
          backdropHeight = playerHeight;
          opacity = ((touchPosY - HEADER_HEIGHT_MOBILE) / backdropHeight) * -1 + 1;
        }

        backdrop.setAttribute('style', `top: ${backdropTop}px; opacity: ${opacity}`);
      }
    }
  }

  function handleTouchEnd() {
    // set by touchMove
    if (!touchPos.current) return;

    const root = drawerRoot.current;

    if (root) {
      const middleOfVideo = HEADER_HEIGHT_MOBILE + playerHeight / 2;
      const drawerMovedFullscreen = touchPos.current < middleOfVideo;
      // $FlowFixMe
      const restOfPage = document.documentElement.clientHeight - playerHeight - HEADER_HEIGHT_MOBILE;
      const draggedBeforeCloseLimit = touchPos.current - playerHeight - HEADER_HEIGHT_MOBILE < restOfPage * 0.2;
      const backdrop = backdropRef.current;

      if (draggedBeforeCloseLimit) {
        const minDrawerHeight = contentHeight;
        const positionToStop = drawerMovedFullscreen ? HEADER_HEIGHT_MOBILE : minDrawerHeight;
        // $FlowFixMe
        document.documentElement?.style?.setProperty('--content-height', String(positionToStop));

        if (paperRef.current) {
          paperRef.current.setAttribute('style', `transform: none !important; transition: transform ${TRANSITION_STR}`);
        }
        root.setAttribute(
          'style',
          `transform: translateY(${positionToStop}px) !important; transition: transform ${TRANSITION_STR}`
        );

        setTimeout(() => {
          root.style.height = `calc(100% - ${positionToStop}px)`;
        }, TRANSITION_MS);

        if (backdrop) {
          backdrop.setAttribute('style', 'opacity: 0');

          setTimeout(() => {
            backdrop.setAttribute('style', `transition: opacity ${TRANSITION_STR}; opacity: 1`);
          }, TRANSITION_MS);
        }

        // Pause video if drawer made fullscreen (above the player)
        const playerElement = document.querySelector('.content__viewer--inline');
        const videoParent = playerElement && playerElement.querySelector('.video-js');
        const isLivestream = videoParent && videoParent.classList.contains('livestreamPlayer');
        const videoNode = videoParent && videoParent.querySelector('.vjs-tech');
        // $FlowFixMe
        const isPlaying = videoNode && !videoNode.paused;

        if (videoNode && !isLivestream && isPlaying && drawerMovedFullscreen) {
          // $FlowFixMe
          videoNode.pause();
          pausedByDrawer.current = true;
        } else {
          handleUnpausePlayer();
        }
      } else {
        handleCloseDrawer();

        if (backdrop) {
          backdrop.setAttribute('style', 'opacity: 0');
        }
      }
    }

    // clear if not being touched anymore
    touchPos.current = undefined;
  }

  function handleUnpausePlayer() {
    // Unpause on close and was paused by the drawer
    const videoParent = document.querySelector('.video-js');
    const videoNode = videoParent && videoParent.querySelector('.vjs-tech');

    if (videoNode && pausedByDrawer.current) {
      // $FlowFixMe
      videoNode.play();
      pausedByDrawer.current = false;
    }
  }

  function handleCloseDrawer() {
    handleUnpausePlayer();
    toggleDrawer();
  }

  const handleResize = React.useCallback(() => {
    const element =
      document.querySelector(`.${PRIMARY_IMAGE_WRAPPER_CLASS}`) ||
      document.querySelector(`.${PRIMARY_PLAYER_WRAPPER_CLASS}`);

    if (!element) return;

    const rect = element.getBoundingClientRect();
    setPlayerHeight(rect.height);
  }, []);

  React.useEffect(() => {
    if (startOpen && !open) {
      toggleDrawer();
    }
    // on page mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // Drawer will follow the cover image on resize, so it's always visible
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Reset scroll position when opening: avoid broken position where
  // the drawer is lower than the video
  React.useEffect(() => {
    if (open) {
      const htmlEl = document.querySelector('html');
      if (htmlEl) htmlEl.scrollTop = 0;
    }
  }, [open]);

  React.useEffect(() => {
    return () => {
      if (openPrev.current) {
        handleCloseDrawer();
      }
    };

    // close drawer on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawerElemRef = React.useCallback(
    (node) => {
      if (node) {
        const isFullscreenDrawer = node.style.transform.includes(`translateY(${HEADER_HEIGHT_MOBILE}px)`);
        const openStateChanged = openPrev.current !== open; // so didn't run because of window resize

        if (!isFullscreenDrawer || openStateChanged) {
          node.setAttribute(
            'style',
            `transform: translateY(${landscapePlayerHeight}px); height: calc(100% - ${landscapePlayerHeight}px);`
          );
          // $FlowFixMe
          document.documentElement?.style?.setProperty('--content-height', String(landscapePlayerHeight));
        }

        drawerRoot.current = node;
        openPrev.current = open;
      }
    },
    [landscapePlayerHeight, open]
  );

  return (
    <>
      <DrawerGlobalStyles open={open} />

      <Drawer
        ref={drawerElemRef}
        anchor="bottom"
        open={open}
        disableEnforceFocus
        ModalProps={{ keepMounted: true, sx: { zIndex: '2' } }}
        BackdropProps={{ ref: backdropRef, open, sx: { backgroundColor: 'black' } }}
        PaperProps={{ ref: paperRef, sx: { height: `calc(100% - ${pullerHeight}px)` } }}
      >
        {open && (
          <div className="swipeable-drawer__header" style={{ top: -pullerHeight, height: pullerHeight }}>
            <Puller theme={theme} />
            <HeaderContents
              title={title}
              hasSubtitle={hasSubtitle}
              actions={actions}
              type={type}
              handleClose={handleCloseDrawer}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </div>
        )}

        {children}
      </Drawer>
    </>
  );
}

type GlobalStylesProps = {
  open: boolean,
};

const DrawerGlobalStyles = (props: GlobalStylesProps) => {
  const { open } = props;

  return (
    <Global
      styles={{
        '.main-wrapper__inner--filepage': {
          overflow: open ? 'hidden' : 'unset',
          maxHeight: open ? '100%' : 'unset',
        },
      }}
    />
  );
};

type PullerProps = {
  theme: string,
};

const Puller = (props: PullerProps) => {
  const { theme } = props;

  return (
    <span className="swipeable-drawer__puller" style={{ backgroundColor: theme === 'light' ? grey[300] : grey[800] }} />
  );
};

type HeaderProps = {
  title: any,
  hasSubtitle?: boolean,
  actions?: any,
  type: string,
  handleClose: () => void,
};

const HeaderContents = (props: HeaderProps) => {
  const { title, hasSubtitle, actions, handleClose, type, ...divProps } = props;

  return (
    <div
      className={classnames('swipeable-drawer__header-content', {
        'swipeable-drawer__header--with-subtitle': hasSubtitle,
      })}
      {...divProps}
    >
      {title}

      <div className="swipeable-drawer__header-actions">
        {actions}

        <Button
          button={type === DRAWERS.PLAYLIST ? 'close' : undefined}
          icon={ICONS.REMOVE}
          iconSize={16}
          onClick={handleClose}
        />
      </div>
    </div>
  );
};
