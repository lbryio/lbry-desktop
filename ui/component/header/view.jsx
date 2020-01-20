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
// @if TARGET='app'
import { IS_MAC } from 'component/app/view';
// @endif

type Props = {
  balance: string,
  roundedBalance: number,
  history: { push: string => void, goBack: () => void, goForward: () => void, location: { pathname: string } },
  currentTheme: string,
  automaticDarkModeEnabled: boolean,
  setClientSetting: (string, boolean | string) => void,
  hideBalance: boolean,
  email: ?string,
  authenticated: boolean,
  authHeader: boolean,
  syncError: ?string,
  signOut: () => void,
  openMobileNavigation: () => void,
  openChannelCreate: () => void,
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
    authenticated,
    authHeader,
    signOut,
    syncError,
    openMobileNavigation,
    openChannelCreate,
  } = props;

  // on the verify page don't let anyone escape other than by closing the tab to keep session data consistent
  const isVerifyPage = history.location.pathname.includes(PAGES.AUTH_VERIFY);
  const isAuthPage = history.location.pathname.includes(PAGES.AUTH);

  // Sign out if they click the "x" when they are on the password prompt
  const authHeaderAction = syncError ? { onClick: signOut } : { navigate: '/' };
  const homeButtonNavigationProps = isVerifyPage ? {} : authHeader ? authHeaderAction : { navigate: '/' };
  const closeButtonNavigationProps = authHeader ? authHeaderAction : { onClick: () => history.goBack() };

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

  function getWalletTitle() {
    return hideBalance ? (
      __('Wallet')
    ) : (
      <React.Fragment>
        {roundedBalance} <LbcSymbol />
      </React.Fragment>
    );
  }

  return (
    <header
      className={classnames('header', {
        'header--minimal': authHeader,
        // @if TARGET='web'
        'header--noauth-web': !authenticated,
        // @endif
        // @if TARGET='app'
        'header--mac': IS_MAC,
        // @endif
      })}
    >
      <div className="header__contents">
        <div className="header__navigation">
          <Button
            className="header__navigation-item header__navigation-item--lbry"
            label={__('LBRY')}
            icon={ICONS.LBRY}
            onClick={() => window.scrollTo(0, 0)}
            {...homeButtonNavigationProps}
          />

          {/* @if TARGET='app' */}
          {!authHeader && (
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

          {!authHeader && <WunderBar />}
        </div>

        {!authHeader ? (
          <div className={classnames('header__menu', { 'header__menu--with-balance': !IS_WEB || authenticated })}>
            {(!IS_WEB || authenticated) && (
              <Fragment>
                <Button
                  navigate={`/$/${PAGES.WALLET}`}
                  className="header__navigation-item menu__title header__navigation-item--balance"
                  label={getWalletTitle()}
                />
                <Menu>
                  <MenuButton className="header__navigation-item menu__title header__navigation-item--icon">
                    <Icon size={18} icon={ICONS.PUBLISH} />
                  </MenuButton>
                  <MenuList className="menu__list--header">
                    <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.PUBLISH}`)}>
                      <Icon aria-hidden icon={ICONS.PUBLISH} />
                      {__('Publish')}
                    </MenuItem>
                    <MenuItem className="menu__link" onSelect={openChannelCreate}>
                      <Icon aria-hidden icon={ICONS.CHANNEL} />
                      {__('New Channel')}
                    </MenuItem>
                  </MenuList>
                </Menu>

                <Menu>
                  <MenuButton className="header__navigation-item menu__title header__navigation-item--icon">
                    <Icon size={18} icon={ICONS.ACCOUNT} />
                  </MenuButton>
                  <MenuList className="menu__list--header">
                    <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.PUBLISHED}`)}>
                      <Icon aria-hidden icon={ICONS.PUBLISH} />
                      {__('Publishes')}
                    </MenuItem>
                    <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.CHANNELS}`)}>
                      <Icon aria-hidden icon={ICONS.CHANNEL} />
                      {__('Channels')}
                    </MenuItem>

                    {/* @if TARGET='app' */}
                    <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.LIBRARY}`)}>
                      <Icon aria-hidden icon={ICONS.LIBRARY} />
                      {__('Library')}
                    </MenuItem>
                    {/* @endif */}

                    <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.REWARDS}`)}>
                      <Icon aria-hidden icon={ICONS.FEATURED} />
                      {__('Rewards')}
                    </MenuItem>

                    {/* Commented out until new invite system is implemented */}
                    <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.INVITE}`)}>
                      <Icon aria-hidden icon={ICONS.INVITE} />
                      {__('Invites')}
                    </MenuItem>

                    {authenticated ? (
                      <MenuItem onSelect={signOut}>
                        <div className="menu__link">
                          <Icon aria-hidden icon={ICONS.SIGN_OUT} />
                          {__('Sign Out')}
                        </div>
                        <span className="menu__link-help">{email}</span>
                      </MenuItem>
                    ) : (
                      <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.AUTH}`)}>
                        <Icon aria-hidden icon={ICONS.SIGN_IN} />
                        {__('Sign In')}
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              </Fragment>
            )}
            <Menu>
              <MenuButton className="header__navigation-item menu__title header__navigation-item--icon">
                <Icon size={18} icon={ICONS.SETTINGS} />
              </MenuButton>
              <MenuList className="menu__list--header">
                <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.SETTINGS}`)}>
                  <Icon aria-hidden tootlip icon={ICONS.SETTINGS} />
                  {__('Settings')}
                </MenuItem>
                <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.HELP}`)}>
                  <Icon aria-hidden icon={ICONS.HELP} />
                  {__('Help')}
                </MenuItem>
                <MenuItem className="menu__link" onSelect={handleThemeToggle}>
                  <Icon icon={currentTheme === 'light' ? ICONS.DARK : ICONS.LIGHT} />
                  {currentTheme === 'light' ? __('Dark') : __('Light')}
                </MenuItem>
              </MenuList>
            </Menu>
            {IS_WEB && !authenticated && (
              <Button navigate={`/$/${PAGES.AUTH}`} button="primary" label={__('Sign In')} />
            )}
          </div>
        ) : (
          !isVerifyPage && (
            <div className="header__menu">
              {/* Add an empty span here so we can use the same style as above */}
              {/* This pushes the close button to the right side */}
              <span />
              <Tooltip label={__('Go Back')}>
                <Button button="link" icon={ICONS.REMOVE} {...closeButtonNavigationProps} />
              </Tooltip>
            </div>
          )
        )}

        {!authenticated && !isAuthPage && (
          <Button
            button="primary"
            label={__('Sign In')}
            className="header__menu--mobile"
            onClick={() => history.push(`/$/${PAGES.AUTH}`)}
          />
        )}
        <Button onClick={openMobileNavigation} icon={ICONS.MENU} iconSize={24} className="header__menu--mobile" />
      </div>
    </header>
  );
};

export default withRouter(Header);
