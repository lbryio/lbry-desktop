// @flow
import { useIsMobile } from 'effects/use-screensize';
import { withRouter } from 'react-router';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import Button from 'component/button';
import classnames from 'classnames';
import HeaderMenuButtons from 'component/headerMenuButtons';
import HeaderProfileMenuButton from 'component/headerProfileMenuButton';
import Logo from 'component/logo';
import NotificationBubble from 'component/notificationBubble';
import React from 'react';
import SkipNavigationButton from 'component/skipNavigationButton';
import WunderBar from 'component/wunderbar';
import * as remote from '@electron/remote';
import { IS_MAC } from 'component/app/view';
import NavigationButton from 'component/navigationButton';

type Props = {
  authenticated: boolean,
  authHeader: boolean,
  backout: {
    backLabel?: string,
    backNavDefault?: string,
    title: string,
    simpleTitle: string, // Just use the same value as `title` if `title` is already short (~< 10 chars), unless you have a better idea for title overlfow on mobile
  },
  balance: number,
  emailToVerify?: string,
  hasNavigated: boolean,
  hideBalance: boolean,
  hideCancel: boolean,
  history: {
    goBack: () => void,
    location: { pathname: string },
    push: (string) => void,
    replace: (string) => void,
  },
  isAbsoluteSideNavHidden: boolean,
  roundedBalance: string,
  roundedSpendableBalance: string,
  sidebarOpen: boolean,
  syncError: ?string,
  clearEmailEntry: () => void,
  clearPasswordEntry: () => void,
  setSidebarOpen: (boolean) => void,
  signOut: () => void,
};

const Header = (props: Props) => {
  const {
    authenticated,
    authHeader,
    backout,
    balance,
    emailToVerify,
    hideBalance,
    hideCancel,
    history,
    isAbsoluteSideNavHidden,
    roundedBalance,
    roundedSpendableBalance,
    sidebarOpen,
    syncError,
    clearEmailEntry,
    clearPasswordEntry,
    setSidebarOpen,
    signOut,
  } = props;

  const {
    location: { pathname },
    goBack,
    push,
  } = history;

  const isMobile = useIsMobile();

  // on the verify page don't let anyone escape other than by closing the tab to keep session data consistent
  const isVerifyPage = pathname.includes(PAGES.AUTH_VERIFY);
  const isSignUpPage = pathname.includes(PAGES.AUTH);
  const isSignInPage = pathname.includes(PAGES.AUTH_SIGNIN);
  const isPwdResetPage = pathname.includes(PAGES.AUTH_PASSWORD_RESET);

  // For pages that allow for "backing out", shows a backout option instead of the Home logo
  const canBackout = Boolean(backout);
  const { backLabel, backNavDefault, title: backTitle, simpleTitle: simpleBackTitle } = backout || {};

  // Sign out if they click the "x" when they are on the password prompt
  const authHeaderAction = syncError && { onClick: signOut };
  const homeButtonNavigationProps = (isVerifyPage && {}) || (authHeader && authHeaderAction) || { navigate: '/' };
  const sidebarLabel = sidebarOpen
    ? __('Close sidebar - hide channels you are following.')
    : __('Expand sidebar - view channels you are following.');

  const onBackout = React.useCallback(
    (e: any) => {
      const { hasNavigated } = props;
      const { replace } = history;

      window.removeEventListener('popstate', onBackout);

      if (e.type !== 'popstate') {
        // if not initiated by pop (back button)
        if (hasNavigated && !backNavDefault) {
          goBack();
        } else {
          replace(backNavDefault || `/`);
        }
      }
    },
    [backNavDefault, goBack, history, props]
  );

  React.useEffect(() => {
    if (canBackout) {
      window.addEventListener('popstate', onBackout);
      return () => window.removeEventListener('popstate', onBackout);
    }
  }, [canBackout, onBackout]);

  const userButtons = (className: string) => (
    <div className={classnames('header__menu', { 'header__menu--with-balance': authenticated })}>
      <Button
        title={
          balance > 0
            ? __('Immediately spendable: %spendable_balance%', { spendable_balance: roundedSpendableBalance })
            : __('Your Wallet')
        }
        navigate={`/$/${PAGES.WALLET}`}
        className={classnames(className, 'header__navigation-item--balance')}
        label={hideBalance || Number(roundedBalance) === 0 ? __('Your Wallet') : roundedBalance}
        icon={ICONS.LBC}
        // @if TARGET='app'
        onDoubleClick={(e) => {
          e.stopPropagation();
        }}
        // @endif
      />

      <HeaderProfileMenuButton />
    </div>
  );

  return (
    <header
      className={classnames('header', {
        'header--minimal': authHeader,
        'header--mac': IS_MAC,
      })}
      // @if TARGET='app'
      onDoubleClick={(e) => {
        remote.getCurrentWindow().maximize();
      }}
      // @endif
    >
      <div className="header__contents">
        {!authHeader && canBackout ? (
          <div className="card__actions--between">
            <Button onClick={onBackout} button="link" label={backLabel || __('Cancel')} icon={ICONS.ARROW_LEFT} />

            {backTitle && <h1 className="header__auth-title">{(isMobile && simpleBackTitle) || backTitle}</h1>}

            {userButtons('header__navigation-item menu__title')}
          </div>
        ) : (
          <>
            <div className="header__navigation">
              <SkipNavigationButton />

              {!authHeader && (
                <span style={{ position: 'relative' }}>
                  <Button
                    aria-label={sidebarLabel}
                    className="header__navigation-item menu__title header__navigation-item--icon"
                    icon={ICONS.MENU}
                    aria-expanded={sidebarOpen}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    {isAbsoluteSideNavHidden && isMobile && <NotificationBubble />}
                  </Button>
                </span>
              )}

              <Button
                aria-label={__('Home')}
                className="header__navigation-item header__navigation-item--lbry"
                onClick={() => {
                  // here use state.router.location.pathname
                  if (history.location.pathname === '/') window.location.reload();
                }}
                // @if TARGET='app'
                onDoubleClick={(e) => {
                  e.stopPropagation();
                }}
                // @endif
                {...homeButtonNavigationProps}
              >
                <Logo />
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
                  <WunderBar />
                  <HeaderMenuButtons />
                </div>
              )}
            </div>

            {!authHeader && !canBackout
              ? userButtons('header__navigation-item menu__title mobile-hidden')
              : !isVerifyPage &&
                !hideCancel && (
                  <div className="header__menu">
                    {/* Add an empty span here so we can use the same style as above */}
                    {/* This pushes the close button to the right side */}
                    <span />

                    <Button
                      title={__('Go Back')}
                      button="alt"
                      // className="button--header-close"
                      icon={ICONS.REMOVE}
                      onClick={() => {
                        clearEmailEntry();
                        clearPasswordEntry();

                        if (syncError) signOut();

                        if ((isSignInPage && !emailToVerify) || isSignUpPage || isPwdResetPage) {
                          goBack();
                        } else {
                          push('/');
                        }
                      }}
                    />
                  </div>
                )}
          </>
        )}
      </div>
    </header>
  );
};

export default withRouter(Header);
