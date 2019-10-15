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
  history: { push: string => void, goBack: () => void, goForward: () => void },
  currentTheme: string,
  automaticDarkModeEnabled: boolean,
  setClientSetting: (string, boolean | string) => void,
  hideBalance: boolean,
  email: ?string,
  minimal: boolean,
  signOut: () => void,
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
    signOut,
  } = props;
  const authenticated = Boolean(email);

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
        'header--minimal': minimal,
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
            navigate="/"
          />

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

          {!minimal && <WunderBar />}
        </div>

        {!minimal ? (
          <div className={classnames('header__menu', { 'header__menu--small': IS_WEB && !authenticated })}>
            {!IS_WEB || authenticated ? (
              <Fragment>
                <Menu>
                  <MenuButton className="header__navigation-item menu__title">{getWalletTitle()}</MenuButton>
                  <MenuList className="menu__list--header">
                    <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.WALLET}`)}>
                      <Icon aria-hidden icon={ICONS.WALLET} />
                      {__('Wallet')}
                    </MenuItem>
                    <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.REWARDS}`)}>
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
                    <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.ACCOUNT}`)}>
                      <Icon aria-hidden icon={ICONS.OVERVIEW} />
                      {__('Overview')}
                    </MenuItem>

                    <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.PUBLISH}`)}>
                      <Icon aria-hidden icon={ICONS.PUBLISH} />
                      {__('Publish')}
                    </MenuItem>
                    {authenticated ? (
                      <MenuItem className="menu__link" onSelect={signOut}>
                        <Icon aria-hidden icon={ICONS.SIGN_OUT} />
                        {__('Sign Out')}
                      </MenuItem>
                    ) : (
                      <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.AUTH}`)}>
                        <Icon aria-hidden icon={ICONS.SIGN_IN} />
                        {__('Sign In')}
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>

                <Menu>
                  <MenuButton className="header__navigation-item menu__title">
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
              </Fragment>
            ) : (
              <Button navigate={`/$/${PAGES.AUTH}`} button="primary" label={__('Sign In')} />
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
