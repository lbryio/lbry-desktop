// @flow
import * as ICONS from 'constants/icons';
import * as SETTINGS from 'constants/settings';
import * as PAGES from 'constants/pages';
import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import Button from 'component/button';
import LbcSymbol from 'component/common/lbc-symbol';
import WunderBar from 'component/wunderbar';
import Icon from 'component/common/icon';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';

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
  } = props;
  const isAuthenticated = Boolean(email);

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

  function getAccountTitle() {
    if (roundedBalance > 0 && !hideBalance) {
      return (
        <React.Fragment>
          {roundedBalance} <LbcSymbol />
        </React.Fragment>
      );
    }

    return __('Account');
  }

  function signOut() {
    // Replace this with actual clearUser function
    window.store.dispatch({ type: 'USER_FETCH_FAILURE' });
    deleteAuthToken();
  }

  return (
    <header className="header">
      <div className="header__contents">
        <div className="header__navigation">
          <Button
            className="header__navigation-item header__navigation-item--lbry"
            label={__('LBRY')}
            icon={ICONS.LBRY}
            navigate="/"
          />
          {/* @if TARGET='app' */}
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
          {/* @endif */}
          <WunderBar />
        </div>

        <div className="header__menu">
          {isAuthenticated ? (
            <Fragment>
              <Menu>
                <MenuButton className="header__navigation-item menu__title">
                  <Icon icon={ICONS.ACCOUNT} />
                  {getAccountTitle()}
                </MenuButton>
                <MenuList className="menu__list--header">
                  <MenuItem className="menu__link" onSelect={() => history.push(`/$/account`)}>
                    <Icon aria-hidden icon={ICONS.OVERVIEW} />
                    {__('Overview')}
                  </MenuItem>
                  <MenuItem className="menu__link" onSelect={() => history.push(`/$/rewards`)}>
                    <Icon aria-hidden icon={ICONS.FEATURED} />
                    {__('Rewards')}
                  </MenuItem>
                  <MenuItem className="menu__link" onSelect={() => history.push(`/$/wallet`)}>
                    <Icon aria-hidden icon={ICONS.WALLET} />
                    {__('Wallet')}
                  </MenuItem>
                  <MenuItem className="menu__link" onSelect={() => history.push(`/$/publish`)}>
                    <Icon aria-hidden icon={ICONS.PUBLISH} />
                    {__('Publish')}
                  </MenuItem>
                  <MenuItem className="menu__link" onSelect={signOut}>
                    <Icon aria-hidden icon={ICONS.SIGN_OUT} />
                    {__('Sign Out')}
                  </MenuItem>
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
              <Button navigate={`/$/${PAGES.AUTH}/signin`} button="link" label={__('Sign In')} />
              <Button navigate={`/$/${PAGES.AUTH}/signup`} button="primary" label={__('Sign Up')} />
            </Fragment>
          )}
        </div>
      </div>
    </header>
  );
};

export default withRouter(Header);
