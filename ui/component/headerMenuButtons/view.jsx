// @flow
import { ENABLE_UI_NOTIFICATIONS } from 'config';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import HeaderMenuLink from 'component/common/header-menu-link';
import Icon from 'component/common/icon';
import NotificationHeaderButton from 'component/notificationHeaderButton';
import React from 'react';

type HeaderMenuButtonProps = {
  authenticated: boolean,
  automaticDarkModeEnabled: boolean,
  currentTheme: string,
  user: ?User,
  handleThemeToggle: (boolean, string) => void,
};

export default function HeaderMenuButtons(props: HeaderMenuButtonProps) {
  const { automaticDarkModeEnabled, currentTheme, user, handleThemeToggle } = props;

  const notificationsEnabled = ENABLE_UI_NOTIFICATIONS || (user && user.experimental_ui);

  return (
    <div className="header__buttons">
      <Menu>
        <MenuButton
          aria-label={__('Publish a file, or create a channel')}
          title={__('Publish a file, or create a channel')}
          className="header__navigation-item menu__title header__navigation-item--icon mobile-hidden"
        >
          <Icon size={18} icon={ICONS.PUBLISH} aria-hidden />
        </MenuButton>

        <MenuList className="menu__list--header">
          <HeaderMenuLink page={PAGES.UPLOAD} icon={ICONS.PUBLISH} name={__('Upload')} />
          <HeaderMenuLink page={PAGES.CHANNEL_NEW} icon={ICONS.CHANNEL} name={__('New Channel')} />
        </MenuList>
      </Menu>

      {notificationsEnabled && <NotificationHeaderButton />}

      <Menu>
        <MenuButton
          aria-label={__('Settings')}
          title={__('Settings')}
          className="header__navigation-item menu__title header__navigation-item--icon  mobile-hidden"
        >
          <Icon size={18} icon={ICONS.SETTINGS} aria-hidden />
        </MenuButton>

        <MenuList className="menu__list--header">
          <HeaderMenuLink page={PAGES.SETTINGS} icon={ICONS.SETTINGS} name={__('Settings')} />
          <HeaderMenuLink page={PAGES.HELP} icon={ICONS.HELP} name={__('Help')} />

          <MenuItem className="menu__link" onSelect={() => handleThemeToggle(automaticDarkModeEnabled, currentTheme)}>
            <Icon icon={currentTheme === 'light' ? ICONS.DARK : ICONS.LIGHT} />
            {currentTheme === 'light' ? __('Dark') : __('Light')}
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}
