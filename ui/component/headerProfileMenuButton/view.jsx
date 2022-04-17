// @flow

import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import ChannelThumbnail from 'component/channelThumbnail';
import classnames from 'classnames';
import HeaderMenuLink from 'component/common/header-menu-link';
import Icon from 'component/common/icon';
import React from 'react';

type HeaderMenuButtonProps = {
  activeChannelClaim: ?ChannelClaim,
  email: ?string,
  authenticated: boolean,
  openSignOutModal: () => void,
};

export default function HeaderProfileMenuButton(props: HeaderMenuButtonProps) {
  const { activeChannelClaim, email, openSignOutModal, authenticated } = props;

  const activeChannelUrl = activeChannelClaim && activeChannelClaim.permanent_url;

  return (
    <div className="header__buttons">
      <Menu>
        <MenuButton
          aria-label={__('Your account')}
          title={__('Your account')}
          className={classnames('header__navigationItem', {
            'header__navigationItem--icon': !activeChannelUrl,
            'header__navigationItem--profilePic': activeChannelUrl,
          })}
        >
          {activeChannelUrl ? (
            <ChannelThumbnail uri={activeChannelUrl} small noLazyLoad />
          ) : (
            <Icon size={18} icon={ICONS.ACCOUNT} aria-hidden />
          )}
        </MenuButton>

        <MenuList className="menu__list--header">
          <HeaderMenuLink page={PAGES.UPLOADS} icon={ICONS.PUBLISH} name={__('Uploads')} />
          <HeaderMenuLink page={PAGES.CHANNELS} icon={ICONS.CHANNEL} name={__('Channels')} />
          <HeaderMenuLink page={PAGES.CREATOR_DASHBOARD} icon={ICONS.ANALYTICS} name={__('Creator Analytics')} />

          {authenticated ? (
            <MenuItem onSelect={openSignOutModal}>
              <div className="menu__link">
                <Icon aria-hidden icon={ICONS.SIGN_OUT} />
                {__('Sign Out')}
              </div>
              <span className="menu__link-help">{email}</span>
            </MenuItem>
          ) : (
            <HeaderMenuLink page={PAGES.AUTH_SIGNIN} icon={ICONS.SIGN_IN} name={__('Cloud Connect')} />
          )}
        </MenuList>
      </Menu>
    </div>
  );
}
