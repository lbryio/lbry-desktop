// @flow
import * as ICONS from 'constants/icons';
import * as SETTINGS from 'constants/settings';
import * as PAGES from 'constants/pages';
import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import Button from 'component/button';
import LbcSymbol from 'component/common/lbc-symbol';
import WunderBar from 'component/wunderbar';
import Icon from 'component/common/icon';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import Tooltip from 'component/common/tooltip';

// Move this into jessops password util
import cookie from 'cookie';
// @if TARGET='app'
import keytar from 'keytar';
// @endif;
function deleteAuthToken() {
  // @if TARGET='app'
  keytar.deletePassword('LBRY', 'auth_token').catch(console.error); //eslint-disable-line
  // @endif;
  // @if TARGET='web'
  document.cookie = cookie.serialize('auth_token', '', {
    expires: new Date(),
  });
  // @endif
}

type Props = {
  autoUpdateDownloaded: boolean,
  balance: string,
  isUpgradeAvailable: boolean,
  roundedBalance: number,
  downloadUpgradeRequested: any => void,
  history: { push: string => void, goBack: () => void, goForward: () => void },
  currentTheme: string,
  automaticDarkModeEnabled: boolean,
  setClientSetting: (string, boolean | string) => void,
  hideBalance: boolean,
  email: ?string,
  minimal: boolean,
};

const Header = (props: Props) => {
  const {
    roundedBalance,
    history,
    setClientSetting,
    currentTheme,
    automaticDarkModeEnabled,
    hideBalance,
    email,
    minimal,
  } = props;
  const showUpgradeButton = autoUpdateDownloaded || (process.platform === 'linux' && isUpgradeAvailable);
  const isAuthenticated = Boolean(email);
  // Auth is optional in the desktop app
  const showFullHeader = IS_WEB ? isAuthenticated : true;

  function handleThemeToggle() {
    if (automaticDarkModeEnabled) {
      setClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED, false);
    }

    if (currentTheme === 'dark') {
      setClientSetting(SETTINGS.THEME, 'light');
    } else {
      setClientSetting(SETTINGS.THEME, 'dark');
    }
  }

  function signOut() {
    // Replace this with actual clearUser function
    window.store.dispatch({ type: 'USER_FETCH_FAILURE' });
    deleteAuthToken();
    location.reload();
  }

  const accountMenuButtons = [
    {
      path: `/$/account`,
      icon: ICONS.OVERVIEW,
      label: __('Overview'),
    },
    {
      path: `/$/rewards`,
      icon: ICONS.FEATURED,
      label: __('Rewards'),
    },
    {
      path: `/$/wallet`,
      icon: ICONS.WALLET,
      label: __('Wallet'),
    },
    {
      path: `/$/publish`,
      icon: ICONS.PUBLISH,
      label: __('Publish'),
    },
  ];

  if (!isAuthenticated) {
    accountMenuButtons.push({
      onClick: signOut,
      icon: ICONS.PUBLISH,
      label: __('Publish'),
    });
  }

  return (
    <header className={classnames('header', { 'header--minimal': minimal })}>
      <div className="header__contents">
        <div className="header__navigation">
          {/* @if TARGET='app' */}
          {!minimal && (
            <div className="header__navigation-arrows">
              <Button
                className="header__navigation-item header__navigation-item--back"
                description={__('Navigate back')}
                onClick={() => history.goBack()}
                icon={ICONS.ARROW_LEFT}
                iconSize={18}
              />

              <Button
                className="header__navigation-item header__navigation-item--forward"
                description={__('Navigate forward')}
                onClick={() => history.goForward()}
                icon={ICONS.ARROW_RIGHT}
                iconSize={18}
              />
            </div>
          )}
          {/* @endif */}

          <Button
            className="header__navigation-item header__navigation-item--lbry"
            label={__('LBRY')}
            icon={ICONS.LBRY}
            navigate="/"
          />

          {!minimal && <WunderBar />}
        </div>

        {!minimal ? (
          <div className="header__menu">
            {showFullHeader ? (
              <Fragment>
                <Menu>
                  <MenuButton className="header__navigation-item menu__title">
                    {roundedBalance} <LbcSymbol />
                  </MenuButton>
                  <MenuList className="menu__list--header">
                    <MenuItem className="menu__link" onSelect={() => history.push(`/$/wallet`)}>
                      <Icon aria-hidden icon={ICONS.WALLET} />
                      {__('Wallet')}
                    </MenuItem>
                    <MenuItem className="menu__link" onSelect={() => history.push(`/$/rewards`)}>
                      <Icon aria-hidden icon={ICONS.FEATURED} />
                      {__('Rewards')}
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuButton className="header__navigation-item menu__title">
                    <Icon size={18} icon={ICONS.ACCOUNT} />
                  </MenuButton>
                  <MenuList className="menu__list--header">
                    <MenuItem
                      className="menu__link"
                      onSelect={() => history.push(isAuthenticated ? `/$/account` : `/$/auth/signup`)}
                    >
                      <Icon aria-hidden icon={ICONS.OVERVIEW} />
                      {__('Overview')}
                    </MenuItem>

                    <MenuItem className="menu__link" onSelect={() => history.push(`/$/publish`)}>
                      <Icon aria-hidden icon={ICONS.PUBLISH} />
                      {__('Publish')}
                    </MenuItem>
                    {isAuthenticated ? (
                      <MenuItem className="menu__link" onSelect={signOut}>
                        <Icon aria-hidden icon={ICONS.SIGN_OUT} />
                        {__('Sign Out')}
                      </MenuItem>
                    ) : (
                      <MenuItem onSelect={() => {}} />
                    )}
                  </MenuList>
                </Menu>

                <Menu>
                  <MenuButton className="header__navigation-item menu__title">
                    <Icon size={18} icon={ICONS.SETTINGS} />
                  </MenuButton>
                  <MenuList className="menu__list--header">
                    <MenuItem className="menu__link" onSelect={() => history.push(`/$/settings`)}>
                      <Icon aria-hidden tootlip icon={ICONS.SETTINGS} />
                      {__('Settings')}
                    </MenuItem>
                    <MenuItem className="menu__link" onSelect={() => history.push(`/$/help`)}>
                      <Icon aria-hidden icon={ICONS.HELP} />
                      {__('Help')}
                    </MenuItem>
                    <MenuItem className="menu__link" onSelect={handleThemeToggle}>
                      <Icon icon={currentTheme === 'light' ? ICONS.DARK : ICONS.LIGHT} />
                      {currentTheme === 'light' ? 'Dark' : 'Light'}
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Fragment>
            ) : (
              <Fragment>
                <span />
                <Button navigate={`/$/${PAGES.AUTH}/signin`} button="primary" label={__('Sign In')} />
              </Fragment>
            )}
          </div>
        ) : (
          <div className="header__menu">
            <Tooltip label={__('Go Back')}>
              <Button icon={ICONS.REMOVE} onClick={() => history.goBack()} />
            </Tooltip>
          </div>
        )}
      </div>
    </header>
  );
};

export default withRouter(Header);
