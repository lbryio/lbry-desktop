// @flow
import * as ICONS from 'constants/icons';
import { SETTINGS } from 'lbry-redux';
import * as PAGES from 'constants/pages';
import React from 'react';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import Button from 'component/button';
import LbcSymbol from 'component/common/lbc-symbol';
import WunderBar from 'component/wunderbar';
import Icon from 'component/common/icon';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import Tooltip from 'component/common/tooltip';
import NavigationButton from 'component/navigationButton';
import { LOGO_TITLE } from 'config';
import { useIsMobile } from 'effects/use-screensize';
import NotificationBubble from 'component/notificationBubble';
import NotificationHeaderButton from 'component/notificationHeaderButton';

// @if TARGET='app'
import { remote } from 'electron';
import { IS_MAC } from 'component/app/view';
// @endif

type Props = {
  balance: string,
  roundedBalance: number,
  history: {
    entities: {}[],
    goBack: () => void,
    goForward: () => void,
    index: number,
    length: number,
    location: { pathname: string },
    push: string => void,
    replace: string => void,
  },
  currentTheme: string,
  automaticDarkModeEnabled: boolean,
  setClientSetting: (string, boolean | string) => void,
  hideBalance: boolean,
  email: ?string,
  authenticated: boolean,
  authHeader: boolean,
  backout: {
    backLabel?: string,
    backNavDefault?: string,
    title: string,
    simpleTitle: string, // Just use the same value as `title` if `title` is already short (~< 10 chars), unless you have a better idea for title overlfow on mobile
  },
  syncError: ?string,
  emailToVerify?: string,
  signOut: () => void,
  openChannelCreate: () => void,
  openSignOutModal: () => void,
  clearEmailEntry: () => void,
  clearPasswordEntry: () => void,
  hasNavigated: boolean,
  syncSettings: () => void,
  sidebarOpen: boolean,
  setSidebarOpen: boolean => void,
  isAbsoluteSideNavHidden: boolean,
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
    openSignOutModal,
    clearEmailEntry,
    clearPasswordEntry,
    emailToVerify,
    backout,
    syncSettings,
    sidebarOpen,
    setSidebarOpen,
    isAbsoluteSideNavHidden,
  } = props;
  const isMobile = useIsMobile();
  // on the verify page don't let anyone escape other than by closing the tab to keep session data consistent
  const isVerifyPage = history.location.pathname.includes(PAGES.AUTH_VERIFY);
  const isSignUpPage = history.location.pathname.includes(PAGES.AUTH);
  const isSignInPage = history.location.pathname.includes(PAGES.AUTH_SIGNIN);
  const isPwdResetPage = history.location.pathname.includes(PAGES.AUTH_PASSWORD_RESET);
  const hasBackout = Boolean(backout);
  const { backLabel, backNavDefault, title: backTitle, simpleTitle: simpleBackTitle } = backout || {};

  // Sign out if they click the "x" when they are on the password prompt
  const authHeaderAction = syncError ? { onClick: signOut } : { navigate: '/' };
  const homeButtonNavigationProps = isVerifyPage ? {} : authHeader ? authHeaderAction : { navigate: '/' };
  const closeButtonNavigationProps = {
    onClick: () => {
      clearEmailEntry();
      clearPasswordEntry();

      if (isSignInPage && !emailToVerify) {
        history.goBack();
      }

      if (isSignUpPage) {
        history.goBack();
      }

      if (isPwdResetPage) {
        history.goBack();
      }

      if (syncError) {
        signOut();
      }
    },
  };

  function onBackout(e) {
    const { history, hasNavigated } = props;
    const { goBack, replace } = history;

    window.removeEventListener('popstate', onBackout);

    if (e.type !== 'popstate') {
      // if not initiated by pop (back button)
      if (hasNavigated && !backNavDefault) {
        goBack();
      } else {
        replace(backNavDefault || `/`);
      }
    }
  }

  React.useEffect(() => {
    if (hasBackout) {
      window.addEventListener('popstate', onBackout);
      return () => window.removeEventListener('popstate', onBackout);
    }
  }, [hasBackout]);

  function handleThemeToggle() {
    if (automaticDarkModeEnabled) {
      setClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED, false);
    }

    if (currentTheme === 'dark') {
      setClientSetting(SETTINGS.THEME, 'light');
    } else {
      setClientSetting(SETTINGS.THEME, 'dark');
    }
    syncSettings();
  }

  function getWalletTitle() {
    return hideBalance || Number(roundedBalance) === 0 ? (
      __('Your Wallet')
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
        // @if TARGET='app'
        'header--mac': IS_MAC,
        // @endif
      })}
      // @if TARGET='app'
      onDoubleClick={e => {
        remote.getCurrentWindow().maximize();
      }}
      // @endif
    >
      <div className="header__contents">
        {!authHeader && backout ? (
          <div className="card__actions--between">
            <Button
              onClick={onBackout}
              button="link"
              label={(backLabel && backLabel) || __('Cancel')}
              icon={ICONS.ARROW_LEFT}
            />
            {backTitle && <h1 className={'card__title'}>{isMobile ? simpleBackTitle || backTitle : backTitle}</h1>}
            <Button
              aria-label={__('Your wallet')}
              navigate={`/$/${PAGES.WALLET}`}
              className="header__navigation-item menu__title header__navigation-item--balance"
              label={getWalletTitle()}
              // @if TARGET='app'
              onDoubleClick={e => {
                e.stopPropagation();
              }}
              // @endif
            />
          </div>
        ) : (
          <>
            <div className="header__navigation">
              {!authHeader && (
                <span style={{ position: 'relative' }}>
                  <Button
                    className="header__navigation-item menu__title header__navigation-item--icon"
                    icon={ICONS.MENU}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    {isAbsoluteSideNavHidden && isMobile && <NotificationBubble />}
                  </Button>
                </span>
              )}
              <Button
                className="header__navigation-item header__navigation-item--lbry header__navigation-item--button-mobile"
                // @if TARGET='app'
                label={'LBRY'}
                // @endif
                // @if TARGET='web'
                label={LOGO_TITLE} // eslint-disable-line
                // @endif
                icon={ICONS.LBRY}
                onClick={() => {
                  if (history.location.pathname === '/') window.location.reload();
                }}
                // @if TARGET='app'
                onDoubleClick={e => {
                  e.stopPropagation();
                }}
                // @endif
                {...homeButtonNavigationProps}
              />

              {!authHeader && (
                <div className="header__center">
                  {/* @if TARGET='app' */}
                  {!authHeader && (
                    <div className="header__buttons">
                      <NavigationButton isBackward history={history} />
                      <NavigationButton isBackward={false} history={history} />
                    </div>
                  )}
                  {/* @endif */}

                  {!authHeader && <WunderBar />}

                  <div className="header__buttons mobile-hidden">
                    <Menu>
                      <MenuButton
                        aria-label={__('Publish a file, or create a channel')}
                        title={__('Publish a file, or create a channel')}
                        className="header__navigation-item menu__title header__navigation-item--icon"
                        // @if TARGET='app'
                        onDoubleClick={e => {
                          e.stopPropagation();
                        }}
                        // @endif
                      >
                        <Icon size={18} icon={ICONS.PUBLISH} aria-hidden />
                      </MenuButton>
                      <NotificationHeaderButton />
                      <MenuList className="menu__list--header">
                        <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.UPLOAD}`)}>
                          <Icon aria-hidden icon={ICONS.PUBLISH} />
                          {__('Upload')}
                        </MenuItem>
                        <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.CHANNEL_NEW}`)}>
                          <Icon aria-hidden icon={ICONS.CHANNEL} />
                          {__('New Channel')}
                        </MenuItem>
                      </MenuList>
                    </Menu>

                    <Menu>
                      <MenuButton
                        aria-label={__('Your account')}
                        title={__('Your account')}
                        className="header__navigation-item menu__title header__navigation-item--icon"
                        // @if TARGET='app'
                        onDoubleClick={e => {
                          e.stopPropagation();
                        }}
                        // @endif
                      >
                        <Icon size={18} icon={ICONS.ACCOUNT} aria-hidden />
                      </MenuButton>
                      <MenuList className="menu__list--header">
                        <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.UPLOADS}`)}>
                          <Icon aria-hidden icon={ICONS.PUBLISH} />
                          {__('Uploads')}
                        </MenuItem>
                        <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.CHANNELS}`)}>
                          <Icon aria-hidden icon={ICONS.CHANNEL} />
                          {__('Channels')}
                        </MenuItem>
                        <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.CREATOR_DASHBOARD}`)}>
                          <Icon aria-hidden icon={ICONS.ANALYTICS} />
                          {__('Creator Analytics')}
                        </MenuItem>
                        <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.REWARDS}`)}>
                          <Icon aria-hidden icon={ICONS.REWARDS} />
                          {__('Rewards')}
                        </MenuItem>
                        <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.INVITE}`)}>
                          <Icon aria-hidden icon={ICONS.INVITE} />
                          {__('Invites')}
                        </MenuItem>

                        {authenticated ? (
                          <MenuItem onSelect={IS_WEB ? signOut : openSignOutModal}>
                            <div className="menu__link">
                              <Icon aria-hidden icon={ICONS.SIGN_OUT} />
                              {__('Sign Out')}
                            </div>
                            <span className="menu__link-help">{email}</span>
                          </MenuItem>
                        ) : !IS_WEB ? (
                          <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.AUTH}`)}>
                            <Icon aria-hidden icon={ICONS.INVITE} />
                            {__('Sign In')}
                          </MenuItem>
                        ) : null}
                      </MenuList>
                    </Menu>
                    <Menu>
                      <MenuButton
                        aria-label={__('Settings')}
                        title={__('Settings')}
                        className="header__navigation-item menu__title header__navigation-item--icon"
                        // @if TARGET='app'
                        onDoubleClick={e => {
                          e.stopPropagation();
                        }}
                        // @endif
                      >
                        <Icon size={18} icon={ICONS.SETTINGS} aria-hidden />
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
                  </div>
                </div>
              )}
            </div>

            {!authHeader && !backout ? (
              <div className={classnames('header__menu', { 'header__menu--with-balance': !IS_WEB || authenticated })}>
                {(!IS_WEB || authenticated) && (
                  <Button
                    aria-label={__('Your wallet')}
                    navigate={`/$/${PAGES.WALLET}`}
                    className="header__navigation-item menu__title header__navigation-item--balance"
                    label={getWalletTitle()}
                    // @if TARGET='app'
                    onDoubleClick={e => {
                      e.stopPropagation();
                    }}
                    // @endif
                  />
                )}

                {IS_WEB && !authenticated && (
                  <div className="header__auth-buttons">
                    <Button navigate={`/$/${PAGES.AUTH_SIGNIN}`} button="link" label={__('Sign In')} />
                    <Button navigate={`/$/${PAGES.AUTH}`} button="primary" label={__('Register')} />
                  </div>
                )}
              </div>
            ) : (
              !isVerifyPage && (
                <div className="header__menu">
                  {/* Add an empty span here so we can use the same style as above */}
                  {/* This pushes the close button to the right side */}
                  <span />
                  <Tooltip label={__('Go Back')}>
                    <Button
                      button="alt"
                      // className="button--header-close"
                      icon={ICONS.REMOVE}
                      {...closeButtonNavigationProps}
                      // @if TARGET='app'
                      onDoubleClick={e => {
                        e.stopPropagation();
                      }}
                      // @endif
                    />
                  </Tooltip>
                </div>
              )
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default withRouter(Header);
