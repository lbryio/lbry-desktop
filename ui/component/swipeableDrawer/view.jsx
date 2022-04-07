// @flow
import 'scss/component/_swipeable-drawer.scss';

// $FlowFixMe
import { Global } from '@emotion/react';
// $FlowFixMe
import { grey } from '@mui/material/colors';

import { HEADER_HEIGHT_MOBILE } from 'component/fileRenderFloating/view';
import { PRIMARY_PLAYER_WRAPPER_CLASS, PRIMARY_IMAGE_WRAPPER_CLASS } from 'page/file/view';
import { getMaxLandscapeHeight } from 'component/fileRenderFloating/helper-functions';
import { SwipeableDrawer as MUIDrawer } from '@mui/material';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import Button from 'component/button';
import classnames from 'classnames';

const DRAWER_PULLER_HEIGHT = 42;

type Props = {
  children: Node,
  title: any,
  hasSubtitle?: boolean,
  actions?: any,
  // -- redux --
  open: boolean,
  theme: string,
  toggleDrawer: () => void,
};

export default function SwipeableDrawer(props: Props) {
  const { title, hasSubtitle, children, open, theme, actions, toggleDrawer } = props;

  const [coverHeight, setCoverHeight] = React.useState();

  const videoHeight = coverHeight || getMaxLandscapeHeight() || 0;

  const handleResize = React.useCallback(() => {
    const element =
      document.querySelector(`.${PRIMARY_IMAGE_WRAPPER_CLASS}`) ||
      document.querySelector(`.${PRIMARY_PLAYER_WRAPPER_CLASS}`);

    if (!element) return;

    const rect = element.getBoundingClientRect();
    setCoverHeight(rect.height);
  }, []);

  React.useEffect(() => {
    // Drawer will follow the cover image on resize, so it's always visible
    if (open) {
      handleResize();

      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [handleResize, open]);

  // Reset scroll position when opening: avoid broken position where
  // the drawer is lower than the video
  React.useEffect(() => {
    if (open) {
      const htmlEl = document.querySelector('html');
      if (htmlEl) htmlEl.scrollTop = 0;
    }
  }, [open]);

  return (
    <>
      <DrawerGlobalStyles open={open} videoHeight={videoHeight} />

      <MUIDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
        hideBackdrop
        disableEnforceFocus
        disablePortal
        disableSwipeToOpen
        ModalProps={{ keepMounted: true }}
      >
        {open && (
          <div className="swipeable-drawer__header" style={{ top: -DRAWER_PULLER_HEIGHT }}>
            <Puller theme={theme} />
            <HeaderContents title={title} hasSubtitle={hasSubtitle} actions={actions} toggleDrawer={toggleDrawer} />
          </div>
        )}

        {children}
      </MUIDrawer>
    </>
  );
}

type GlobalStylesProps = {
  open: boolean,
  videoHeight: number,
};

const DrawerGlobalStyles = (props: GlobalStylesProps) => {
  const { open, videoHeight } = props;

  return (
    <Global
      styles={{
        '.main-wrapper__inner--filepage': {
          overflow: open ? 'hidden' : 'unset',
          maxHeight: open ? '100vh' : 'unset',
        },
        '.main-wrapper .MuiDrawer-root': {
          top: `calc(${HEADER_HEIGHT_MOBILE}px + ${videoHeight}px) !important`,
        },
        '.main-wrapper .MuiDrawer-root > .MuiPaper-root': {
          overflow: 'visible',
          color: 'var(--color-text)',
          position: 'absolute',
          height: `calc(100% - ${DRAWER_PULLER_HEIGHT}px)`,
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
  toggleDrawer: () => void,
};

const HeaderContents = (props: HeaderProps) => {
  const { title, hasSubtitle, actions, toggleDrawer } = props;

  return (
    <div
      className={classnames('swipeable-drawer__header-content', {
        'swipeable-drawer__header--with-subtitle': hasSubtitle,
      })}
    >
      {title}

      <div className="swipeable-drawer__header-actions">
        {actions}

        <Button icon={ICONS.REMOVE} iconSize={16} onClick={toggleDrawer} />
      </div>
    </div>
  );
};
