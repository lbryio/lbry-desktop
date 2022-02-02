// @flow
// $FlowFixMe
import { Global } from '@emotion/react';
// $FlowFixMe
import { grey } from '@mui/material/colors';
// $FlowFixMe
import Typography from '@mui/material/Typography';
import { HEADER_HEIGHT_MOBILE } from 'component/fileRenderMobile/view';
import { SwipeableDrawer as MUIDrawer } from '@mui/material';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import Button from 'component/button';
import Icon from 'component/common/icon';
import Portal from '@mui/material/Portal';

const DRAWER_PULLER_HEIGHT = 42;

type Props = {
  children: Node,
  open: Boolean,
  theme: string,
  mobilePlayerDimensions?: { height: number },
  title: string,
  didInitialDisplay?: boolean,
  toggleDrawer: () => void,
};

export default function SwipeableDrawer(props: Props) {
  const { mobilePlayerDimensions, title, children, open, theme, didInitialDisplay, toggleDrawer } = props;

  const [coverHeight, setCoverHeight] = React.useState();

  const videoHeight = coverHeight || (mobilePlayerDimensions ? mobilePlayerDimensions.height : 0);

  React.useEffect(() => {
    if (open && !mobilePlayerDimensions) {
      const element = document.querySelector(`.file-page__video-container`);

      if (element) {
        const rect = element.getBoundingClientRect();
        setCoverHeight(rect.height);
      }
    }
  }, [mobilePlayerDimensions, open]);

  const drawerGlobalStyles = (
    <Global
      styles={{
        '.main-wrapper__inner--filepage': {
          'padding-bottom': didInitialDisplay ? `${DRAWER_PULLER_HEIGHT}px !important` : 'inherit',
          overflow: open ? 'hidden' : 'unset',
          'max-height': open ? '100vh' : 'unset',
        },
        '.MuiDrawer-root': {
          top: `calc(${HEADER_HEIGHT_MOBILE}px + ${videoHeight}px) !important`,
        },
        '.MuiDrawer-root > .MuiPaper-root': {
          overflow: 'visible',
          color: 'var(--color-text)',
          position: 'absolute',
          height: `calc(100% - ${DRAWER_PULLER_HEIGHT}px)`,
        },
      }}
    />
  );

  const Puller = () => (
    <span className="swipeable-drawer__puller" style={{ backgroundColor: theme === 'light' ? grey[300] : grey[800] }} />
  );

  return (
    <>
      {drawerGlobalStyles}

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
        {didInitialDisplay && (
          <div className="swipeable-drawer__header" style={{ top: -DRAWER_PULLER_HEIGHT }}>
            {open ? (
              <>
                <Puller />
                <Typography sx={{ p: 1.5, color: 'var(--color-text)', display: 'flex' }}>{title}</Typography>
                <Button button="close" icon={ICONS.REMOVE} onClick={toggleDrawer} />
              </>
            ) : (
              <Portal>
                <div className="swipeable-drawer__expand" onClick={toggleDrawer}>
                  <Typography sx={{ p: 1.5, color: 'var(--color-text)' }}>{title}</Typography>
                  <Icon icon={ICONS.UP} />
                </div>
              </Portal>
            )}
          </div>
        )}

        {children}
      </MUIDrawer>
    </>
  );
}
