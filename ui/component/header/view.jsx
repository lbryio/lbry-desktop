// @flow
import * as ICONS from 'constants/icons';
import { SETTINGS } from 'lbry-redux';
import * as PAGES from 'constants/pages';
import React from 'react';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import Button from 'component/button';
import WunderBar from 'component/wunderbar';
import Icon from 'component/common/icon';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import Tooltip from 'component/common/tooltip';
import NavigationButton from 'component/navigationButton';
// import { LOGO_TITLE } from 'config';
import { useIsMobile } from 'effects/use-screensize';
import NotificationBubble from 'component/notificationBubble';
import NotificationHeaderButton from 'component/notificationHeaderButton';
import ChannelThumbnail from 'component/channelThumbnail';
// @if TARGET='app'
import { remote } from 'electron';
import { IS_MAC } from 'component/app/view';
// @endif
import OdyseeLogoWithWhiteText from './odysee_white.png';
import OdyseeLogoWithText from './odysee.png';

type Props = {
  user: ?User,
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
  setClientSetting: (string, boolean | string, ?boolean) => void,
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
  sidebarOpen: boolean,
  setSidebarOpen: boolean => void,
  isAbsoluteSideNavHidden: boolean,
  hideCancel: boolean,
  myChannels: ?Array<ChannelClaim>,
  commentChannel: string,
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
    sidebarOpen,
    setSidebarOpen,
    isAbsoluteSideNavHidden,
    hideCancel,
    myChannels,
    commentChannel,
  } = props;
  const isMobile = useIsMobile();
  // on the verify page don't let anyone escape other than by closing the tab to keep session data consistent
  const isVerifyPage = history.location.pathname.includes(PAGES.AUTH_VERIFY);
  const isSignUpPage = history.location.pathname.includes(PAGES.AUTH);
  const isSignInPage = history.location.pathname.includes(PAGES.AUTH_SIGNIN);
  const isPwdResetPage = history.location.pathname.includes(PAGES.AUTH_PASSWORD_RESET);
  const hasBackout = Boolean(backout);
  const { backLabel, backNavDefault, title: backTitle, simpleTitle: simpleBackTitle } = backout || {};
  let channelUrl;
  let identityChannel;
  if (myChannels && myChannels.length >= 1) {
    if (myChannels.length === 1) {
      identityChannel = myChannels[0];
    } else if (commentChannel) {
      identityChannel = myChannels.find(chan => chan.name === commentChannel);
    } else {
      identityChannel = myChannels[0];
    }
    channelUrl = identityChannel && (identityChannel.permanent_url || identityChannel.canonical_url);
  }
  // Sign out if they click the "x" when they are on the password prompt
  const authHeaderAction = syncError ? { onClick: signOut } : { navigate: '/' };
  const homeButtonNavigationProps = isVerifyPage ? {} : authHeader ? authHeaderAction : { navigate: '/' };
  const closeButtonNavigationProps = {
    onClick: () => {
      clearEmailEntry();
      clearPasswordEntry();

      if (syncError) {
        signOut();
      }

      if (isSignInPage && !emailToVerify) {
        history.goBack();
      } else if (isSignUpPage) {
        history.goBack();
      } else if (isPwdResetPage) {
        history.goBack();
      } else {
        history.push('/');
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
      setClientSetting(SETTINGS.THEME, 'light', true);
    } else {
      setClientSetting(SETTINGS.THEME, 'dark', true);
    }
  }

  function getWalletTitle() {
    return hideBalance || Number(roundedBalance) === 0 ? __('Your Wallet') : roundedBalance;
  }

  const loginButtons = (
    <div className="header__auth-buttons">
      <Button navigate={`/$/${PAGES.AUTH_SIGNIN}`} button="link" label={__('Log In')} className="mobile-hidden" />
      <Button navigate={`/$/${PAGES.AUTH}`} button="primary" label={__('Sign Up')} />
    </div>
  );

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
            {backTitle && <h1 className="header__auth-title">{isMobile ? simpleBackTitle || backTitle : backTitle}</h1>}
            {authenticated || !IS_WEB ? (
              <Button
                aria-label={__('Your wallet')}
                navigate={`/$/${PAGES.WALLET}`}
                className="header__navigation-item menu__title header__navigation-item--balance"
                label={getWalletTitle()}
                icon={ICONS.LBC}
                iconSize={20}
                // @if TARGET='app'
                onDoubleClick={e => {
                  e.stopPropagation();
                }}
                // @endif
              />
            ) : (
              loginButtons
            )}
          </div>
        ) : (
          <>
            <div className="header__navigation">
              {!authHeader && (
                <span style={{ position: 'relative' }}>
                  <Button
                    aria-label={
                      sidebarOpen
                        ? __('Close sidebar - hide channels you are following.')
                        : __('Expand sidebar - view channels you are following.')
                    }
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
                onClick={() => {
                  if (history.location.pathname === '/') window.location.reload();
                }}
                {...homeButtonNavigationProps}
              >
                <img
                  src={currentTheme === 'light' ? OdyseeLogoWithText : OdyseeLogoWithWhiteText}
                  className="header__odysee"
                />
              </Button>

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

                  <HeaderMenuButtons
                    authenticated={authenticated}
                    notificationsEnabled
                    history={history}
                    handleThemeToggle={handleThemeToggle}
                    currentTheme={currentTheme}
                    channelUrl={channelUrl}
                    openSignOutModal={openSignOutModal}
                    email={email}
                    signOut={signOut}
                  />
                </div>
              )}
            </div>

            {!authHeader && !backout ? (
              <div className={classnames('header__menu', { 'header__menu--with-balance': !IS_WEB || authenticated })}>
                {(!IS_WEB || authenticated) && (
                  <Button
                    button="link"
                    aria-label={__('Your wallet')}
                    navigate={`/$/${PAGES.WALLET}`}
                    className="header__navigation-item menu__title header__navigation-item--balance mobile-hidden"
                    label={getWalletTitle()}
                    icon={ICONS.LBC}
                    iconSize={20}
                    // @if TARGET='app'
                    onDoubleClick={e => {
                      e.stopPropagation();
                    }}
                    // @endif
                  />
                )}

                {IS_WEB && !authenticated && loginButtons}
              </div>
            ) : (
              !isVerifyPage &&
              !hideCancel && (
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

type HeaderMenuButtonProps = {
  authenticated: boolean,
  notificationsEnabled: boolean,
  history: { push: string => void },
  handleThemeToggle: string => void,
  currentTheme: string,
  channelUrl: ?string,
  openSignOutModal: () => void,
  email: ?string,
  signOut: () => void,
};

function HeaderMenuButtons(props: HeaderMenuButtonProps) {
  const {
    authenticated,
    notificationsEnabled,
    history,
    handleThemeToggle,
    currentTheme,
    channelUrl,
    openSignOutModal,
    email,
    signOut,
  } = props;

  return (
    <div className="header__buttons">
      {(authenticated || !IS_WEB) && (
        <Menu>
          <MenuButton
            aria-label={__('Publish a file, or create a channel')}
            title={__('Publish a file, or create a channel')}
            className="header__navigation-item menu__title header__navigation-item--icon mobile-hidden"
            // @if TARGET='app'
            onDoubleClick={e => {
              e.stopPropagation();
            }}
            // @endif
          >
            <Icon size={18} icon={ICONS.PUBLISH} aria-hidden />
          </MenuButton>

          <MenuList className="menu__list--header">
            <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.UPLOAD}`)}>
              <Icon aria-hidden icon={ICONS.PUBLISH} />
              {__('Upload')}
            </MenuItem>
            <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.CHANNEL_NEW}`)}>
              <Icon aria-hidden icon={ICONS.CHANNEL} />
              {__('New Channel')}
            </MenuItem>
            <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.YOUTUBE_SYNC}`)}>
              <Icon aria-hidden icon={ICONS.YOUTUBE} />
              {__('Sync YouTube Channel')}
            </MenuItem>
          </MenuList>
        </Menu>
      )}

      {notificationsEnabled && <NotificationHeaderButton />}

      <Menu>
        <MenuButton
          aria-label={__('Settings')}
          title={__('Settings')}
          className="header__navigation-item menu__title header__navigation-item--icon  mobile-hidden"
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

      {(authenticated || !IS_WEB) && (
        <Menu>
          <MenuButton
            aria-label={__('Your account')}
            title={__('Your account')}
            className={classnames('header__navigation-item mobile-hidden', {
              'menu__title header__navigation-item--icon': !channelUrl,
              'header__navigation-item--profile-pic': channelUrl,
            })}
            // @if TARGET='app'
            onDoubleClick={e => {
              e.stopPropagation();
            }}
            // @endif
          >
            {channelUrl ? <ChannelThumbnail uri={channelUrl} /> : <Icon size={18} icon={ICONS.ACCOUNT} aria-hidden />}
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
              <>
                <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.AUTH}`)}>
                  <Icon aria-hidden icon={ICONS.SIGN_UP} />
                  {__('Sign Up')}
                </MenuItem>
                <MenuItem className="menu__link" onSelect={() => history.push(`/$/${PAGES.AUTH_SIGNIN}`)}>
                  <Icon aria-hidden icon={ICONS.SIGN_IN} />
                  {__('Sign In')}
                </MenuItem>
              </>
            ) : null}
          </MenuList>
        </Menu>
      )}
    </div>
  );
}

export default withRouter(Header);
