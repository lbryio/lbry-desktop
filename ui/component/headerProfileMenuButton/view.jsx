// @flow
import 'scss/component/_header.scss';

// $FlowFixMe
import { Global } from '@emotion/react';

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

type HeaderMenuButtonProps = {
  myChannelClaimIds: ?Array<string>,
  defaultChannelClaim: ?ChannelClaim,
  authenticated: boolean,
  email: ?string,
  signOut: () => void,
};

export default function HeaderProfileMenuButton(props: HeaderMenuButtonProps) {
  const { myChannelClaimIds, defaultChannelClaim, authenticated, email, signOut } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(!anchorEl ? event.currentTarget : null);
  const handleClose = () => setAnchorEl(null);

  const activeChannelUrl = defaultChannelClaim && defaultChannelClaim.permanent_url;
  // activeChannel will be: undefined = fetching, null = nothing, or { channel claim }
  const noActiveChannel = activeChannelUrl === null;
  const pendingChannelFetch = !noActiveChannel && myChannelClaimIds === undefined;

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
  };

  return (
    <>
      {open && (
        <Global
          styles={{
            body: {
              'overflow-y': 'scroll !important',
              'padding-right': '0px !important',
            },
          }}
        />
      )}

      <div className="header__buttons">
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
          <MuiMenu {...menuProps}>
            <HeaderMenuLink useMui page={PAGES.UPLOADS} icon={ICONS.PUBLISH} name={__('Uploads')} />
            <HeaderMenuLink useMui page={PAGES.CHANNELS} icon={ICONS.CHANNEL} name={__('Channels')} />
            <HeaderMenuLink
              useMui
              page={PAGES.CREATOR_DASHBOARD}
              icon={ICONS.ANALYTICS}
              name={__('Creator Analytics')}
            />
            <HeaderMenuLink useMui page={PAGES.REWARDS} icon={ICONS.REWARDS} name={__('Rewards')} />
            <HeaderMenuLink useMui page={PAGES.INVITE} icon={ICONS.INVITE} name={__('Invites')} />
            <HeaderMenuLink useMui page={PAGES.ODYSEE_MEMBERSHIP} icon={ICONS.UPGRADE} name={__('Odysee Premium')} />
            <ChannelSelector storeSelection isHeaderMenu />

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
        ) : (
          <MuiMenu {...menuProps}>
            <HeaderMenuLink useMui page={PAGES.AUTH_SIGNIN} icon={ICONS.SIGN_IN} name={__('Log In')} />
            <HeaderMenuLink useMui page={PAGES.AUTH} icon={ICONS.SIGN_UP} name={__('Sign Up')} />
            <HeaderMenuLink useMui page={PAGES.SETTINGS} icon={ICONS.SETTINGS} name={__('Settings')} />
            <HeaderMenuLink useMui page={PAGES.HELP} icon={ICONS.HELP} name={__('Help')} />
          </MuiMenu>
        )}
      </div>
    </>
  );
}
