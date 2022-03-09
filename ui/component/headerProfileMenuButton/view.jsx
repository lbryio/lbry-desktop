// @flow
import 'scss/component/_header.scss';

import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import ChannelThumbnail from 'component/channelThumbnail';
import classnames from 'classnames';
import HeaderMenuLink from 'component/common/header-menu-link';
import Icon from 'component/common/icon';
import React from 'react';
import Skeleton from '@mui/material/Skeleton';

type HeaderMenuButtonProps = {
  myChannelClaimIds: ?Array<string>,
  activeChannelClaim: ?ChannelClaim,
  authenticated: boolean,
  email: ?string,
  signOut: () => void,
};

export default function HeaderProfileMenuButton(props: HeaderMenuButtonProps) {
  const { myChannelClaimIds, activeChannelClaim, authenticated, email, signOut } = props;

  const activeChannelUrl = activeChannelClaim && activeChannelClaim.permanent_url;
  // activeChannel will be: undefined = fetching, null = nothing, or { channel claim }
  const noActiveChannel = activeChannelUrl === null;
  const pendingChannelFetch = !noActiveChannel && myChannelClaimIds === undefined;

  return (
    <div className="header__buttons">
      <Menu>
        {pendingChannelFetch ? (
          <Skeleton variant="circular" animation="wave" className="header__navigationItem--iconSkeleton" />
        ) : (
          <MenuButton
            aria-label={__('Your account')}
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
          </MenuButton>
        )}

        <MenuList className="menu__list--header">
          {authenticated ? (
            <>
              <HeaderMenuLink page={PAGES.UPLOADS} icon={ICONS.PUBLISH} name={__('Uploads')} />
              <HeaderMenuLink page={PAGES.CHANNELS} icon={ICONS.CHANNEL} name={__('Channels')} />
              <HeaderMenuLink page={PAGES.CREATOR_DASHBOARD} icon={ICONS.ANALYTICS} name={__('Creator Analytics')} />
              <HeaderMenuLink page={PAGES.REWARDS} icon={ICONS.REWARDS} name={__('Rewards')} />
              <HeaderMenuLink page={PAGES.INVITE} icon={ICONS.INVITE} name={__('Invites')} />
              <HeaderMenuLink page={PAGES.ODYSEE_MEMBERSHIP} icon={ICONS.UPGRADE} name={__('Odysee Premium')} />

              <MenuItem onSelect={signOut}>
                <div className="menu__link">
                  <Icon aria-hidden icon={ICONS.SIGN_OUT} />
                  {__('Sign Out')}
                </div>
                <span className="menu__link-help">{email}</span>
              </MenuItem>
            </>
          ) : (
            <>
              <HeaderMenuLink page={PAGES.AUTH_SIGNIN} icon={ICONS.SIGN_IN} name={__('Log In')} />
              <HeaderMenuLink page={PAGES.AUTH} icon={ICONS.SIGN_UP} name={__('Sign Up')} />
              <HeaderMenuLink page={PAGES.SETTINGS} icon={ICONS.SETTINGS} name={__('Settings')} />
              <HeaderMenuLink page={PAGES.HELP} icon={ICONS.HELP} name={__('Help')} />
            </>
          )}
        </MenuList>
      </Menu>
    </div>
  );
}
