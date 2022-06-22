// @flow
import 'scss/component/_header.scss';

import { ENABLE_UI_NOTIFICATIONS, ENABLE_NO_SOURCE_CLAIMS } from 'config';
import { Menu, MenuList, MenuButton } from '@reach/menu-button';
import { useHistory } from 'react-router';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import Button from 'component/button';
import HeaderMenuLink from 'component/common/header-menu-link';
import Icon from 'component/common/icon';
import NotificationHeaderButton from 'component/headerNotificationButton';
import React from 'react';
import Tooltip from 'component/common/tooltip';

type HeaderMenuButtonProps = {
  activeChannelStakedLevel: number,
  authenticated: boolean,
  automaticDarkModeEnabled: boolean,
  currentTheme: string,
  user: ?User,
  handleThemeToggle: (boolean, string) => void,
  doOpenModal: (string, {}) => void,
};

export default function HeaderMenuButtons(props: HeaderMenuButtonProps) {
  const { authenticated, automaticDarkModeEnabled, currentTheme, user, handleThemeToggle } = props;

  const notificationsEnabled = ENABLE_UI_NOTIFICATIONS || (user && user.experimental_ui);
  const livestreamEnabled = Boolean(ENABLE_NO_SOURCE_CLAIMS && user && !user.odysee_live_disabled);

  const uploadProps = { requiresAuth: !authenticated };
  const { push } = useHistory();

  return (
    <div className="header__buttons">
      <Menu>
        <Tooltip title={__('Publish a file, or create a channel')}>
          <MenuButton className="header__navigationItem--icon">
            <Icon size={18} icon={ICONS.PUBLISH} aria-hidden />
          </MenuButton>
        </Tooltip>

        <MenuList className="menu__list--header">
          <HeaderMenuLink {...uploadProps} page={PAGES.UPLOAD} icon={ICONS.PUBLISH} name={__('Upload')} />
          <HeaderMenuLink {...uploadProps} page={PAGES.CHANNEL_NEW} icon={ICONS.CHANNEL} name={__('New Channel')} />
          <HeaderMenuLink
            {...uploadProps}
            page={PAGES.YOUTUBE_SYNC}
            icon={ICONS.YOUTUBE}
            name={__('Sync YouTube Channel')}
          />
          {livestreamEnabled && (
            <HeaderMenuLink {...uploadProps} page={PAGES.LIVESTREAM} icon={ICONS.VIDEO} name={__('Go Live')} />
          )}
        </MenuList>
      </Menu>

      {!authenticated && (
        <>
          <Tooltip title={__('Settings')}>
            <Button className="header__navigationItem--icon" onClick={() => push(`/$/${PAGES.SETTINGS}`)}>
              <Icon size={18} icon={ICONS.SETTINGS} aria-hidden />
            </Button>
          </Tooltip>
          <Tooltip title={__('Help')}>
            <Button className="header__navigationItem--icon" onClick={() => push(`/$/${PAGES.HELP}`)}>
              <Icon size={18} icon={ICONS.HELP} aria-hidden />
            </Button>
          </Tooltip>
        </>
      )}

      {notificationsEnabled && <NotificationHeaderButton />}

      {authenticated && (
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
    </div>
  );
}
