// @flow
import 'scss/component/_header.scss';

// $FlowFixMe
import { Global } from '@emotion/react';

import { Menu } from '@reach/menu-button';
import { Menu as MuiMenu, MenuItem as MuiMenuItem } from '@mui/material';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import ChannelThumbnail from 'component/channelThumbnail';
import classnames from 'classnames';
import HeaderMenuLink from 'component/common/header-menu-link';
import Icon from 'component/common/icon';
import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import ChannelSelector from 'component/channelSelector';
import Button from 'component/button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Tooltip from 'component/common/tooltip';
import NotificationHeaderButton from 'component/headerNotificationButton';
import { ENABLE_UI_NOTIFICATIONS } from 'config';
import { useIsMobile } from 'effects/use-screensize';

type HeaderMenuButtonProps = {
  currentTheme: string,
  automaticDarkModeEnabled: boolean,
  handleThemeToggle: (boolean, string) => void,

  user: ?User,
  myChannelClaimIds: ?Array<string>,
  activeChannelClaim: ?ChannelClaim,
  authenticated: boolean,
  email: ?string,
  signOut: () => void,
};

export default function HeaderProfileMenuButton(props: HeaderMenuButtonProps) {
  const {
    // Theme
    currentTheme,
    automaticDarkModeEnabled,
    handleThemeToggle,

    // User
    user,
    myChannelClaimIds,
    activeChannelClaim,
    authenticated,
    email,
    signOut,
  } = props;

  const notificationsEnabled = ENABLE_UI_NOTIFICATIONS || (user && user.experimental_ui);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [clicked, setClicked] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(!anchorEl ? event.currentTarget : null);
  const handleClose = () => setAnchorEl(null);

  const activeChannelUrl = activeChannelClaim && activeChannelClaim.permanent_url;
  // activeChannel will be: undefined = fetching, null = nothing, or { channel claim }
  const noActiveChannel = activeChannelUrl === null;
  const pendingChannelFetch = !noActiveChannel && myChannelClaimIds === undefined;
  const uploadProps = { requiresAuth: !authenticated };

  const isMobile = useIsMobile();

  const handleClickAway = () => {
    if (!clicked) {
      if (open) setClicked(true);
    } else {
      setAnchorEl(null);
      setClicked(false);
    }
  };

  React.useEffect(() => {
    if (!open) setClicked(false);
  }, [open]);

  const menuProps = {
    id: 'basic-menu',
    anchorEl,
    open,
    onClose: handleClose,
    MenuListProps: {
      'aria-labelledby': 'basic-button',
      sx: { padding: 'var(--spacing-xs)' },
    },
    className: 'menu__list--header',
    sx: { 'z-index': 2 },
    PaperProps: { className: 'MuiMenu-list--paper' },
    disableScrollLock: true,
  };

  return (
    <>
      {open && (
        <Global
          styles={{
            body: {
              overflowY: 'scroll !important',
              paddingRight: '0px !important',
            },
          }}
        />
      )}

      <div className="header__buttons">
        {authenticated && !isMobile && (
          <Menu>
            <Tooltip title={currentTheme === 'light' ? __('Dark') : __('Light')}>
              <Button
                className="header__navigationItem--icon"
                onClick={() => handleThemeToggle(automaticDarkModeEnabled, currentTheme)}
              >
                <Icon icon={currentTheme === 'light' ? ICONS.DARK : ICONS.LIGHT} />
              </Button>
            </Tooltip>
          </Menu>
        )}
        {notificationsEnabled && !isMobile && <NotificationHeaderButton />}

        {pendingChannelFetch ? (
          <Skeleton variant="circular" animation="wave" className="header__navigationItem--iconSkeleton" />
        ) : (
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            className={classnames('header__navigationItem', {
              'header__navigationItem--icon': !activeChannelUrl,
              'header__navigationItem--profilePic': activeChannelUrl,
            })}
          >
            {activeChannelUrl ? (
              <ChannelThumbnail uri={activeChannelUrl} hideTooltip small noLazyLoad showMemberBadge />
            ) : (
              <Icon size={18} icon={ICONS.ACCOUNT} aria-hidden />
            )}
          </Button>
        )}
        {authenticated ? (
          <ClickAwayListener onClickAway={handleClickAway}>
            <MuiMenu {...menuProps}>
              <ChannelSelector storeSelection isHeaderMenu />

              <hr className="menu__separator" />
              <HeaderMenuLink useMui page={PAGES.UPLOADS} icon={ICONS.PUBLISH} name={__('Uploads')} />
              <HeaderMenuLink useMui page={PAGES.CHANNELS} icon={ICONS.CHANNEL} name={__('Channels')} />
              <HeaderMenuLink
                useMui
                page={PAGES.CREATOR_DASHBOARD}
                icon={ICONS.ANALYTICS}
                name={__('Creator Analytics')}
              />
              <HeaderMenuLink
                useMui
                {...uploadProps}
                page={PAGES.YOUTUBE_SYNC}
                icon={ICONS.YOUTUBE}
                name={__('Sync YouTube Channel')}
              />

              <hr className="menu__separator" />
              <HeaderMenuLink useMui page={PAGES.REWARDS} icon={ICONS.REWARDS} name={__('Rewards')} />
              <HeaderMenuLink useMui page={PAGES.INVITE} icon={ICONS.INVITE} name={__('Invites')} />
              <HeaderMenuLink
                useMui
                page={PAGES.MEMBERSHIPS_LANDING}
                icon={ICONS.MEMBERSHIP}
                name={__('Memberships')}
              />
              <HeaderMenuLink useMui page={PAGES.ODYSEE_MEMBERSHIP} icon={ICONS.UPGRADE} name={__('Odysee Premium')} />

              <hr className="menu__separator" />
              <HeaderMenuLink useMui page={PAGES.SETTINGS} icon={ICONS.SETTINGS} name={__('Settings')} />
              <HeaderMenuLink useMui page={PAGES.HELP} icon={ICONS.HELP} name={__('Help')} />

              <hr className="menu__separator" />
              <MuiMenuItem onClick={signOut}>
                <div className="menu__link" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div className="menu__link-label">
                    <Icon aria-hidden icon={ICONS.SIGN_OUT} />
                    {__('Sign Out')}
                  </div>
                  <span className="menu__link-help">{email}</span>
                </div>
              </MuiMenuItem>
            </MuiMenu>
          </ClickAwayListener>
        ) : (
          <ClickAwayListener onClickAway={handleClickAway}>
            <MuiMenu {...menuProps}>
              <HeaderMenuLink useMui page={PAGES.AUTH_SIGNIN} icon={ICONS.SIGN_IN} name={__('Log In')} />
              <HeaderMenuLink useMui page={PAGES.AUTH} icon={ICONS.SIGN_UP} name={__('Sign Up')} />
              <HeaderMenuLink useMui page={PAGES.SETTINGS} icon={ICONS.SETTINGS} name={__('Settings')} />
              <HeaderMenuLink useMui page={PAGES.HELP} icon={ICONS.HELP} name={__('Help')} />
            </MuiMenu>
          </ClickAwayListener>
        )}
      </div>
    </>
  );
}
