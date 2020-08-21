// @flow
import type { Node } from 'react';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import classnames from 'classnames';
import NotificationBubble from 'component/notificationBubble';
import { IS_MAC } from 'component/app/view';

const ESCAPE_KEY_CODE = 27;
const BACKSLASH_KEY_CODE = 220;

type Props = {
  subscriptions: Array<Subscription>,
  email: ?string,
  uploadCount: number,
  doSignOut: () => void,
  sidebarOpen: boolean,
  setSidebarOpen: boolean => void,
  isMediumScreen: boolean,
  isOnFilePage: boolean,
  unreadCount: number,
  purchaseSuccess: boolean,
  doClearPurchasedUriSuccess: () => void,
  user: ?User,
};

function SideNavigation(props: Props) {
  const {
    subscriptions,
    doSignOut,
    email,
    purchaseSuccess,
    doClearPurchasedUriSuccess,
    sidebarOpen,
    setSidebarOpen,
    isMediumScreen,
    isOnFilePage,
    unreadCount,
    user,
  } = props;

  const TOP_LEVEL_LINKS: Array<{
    label: string,
    navigate: string,
    icon: string,
    extra?: Node,
    hideForUnauth?: boolean,
  }> = [
    {
      label: 'Home',
      navigate: `/`,
      icon: ICONS.HOME,
    },
    {
      label: 'Following',
      navigate: `/$/${PAGES.CHANNELS_FOLLOWING}`,
      icon: ICONS.SUBSCRIBE,
    },
    {
      label: 'Your Tags',
      navigate: `/$/${PAGES.TAGS_FOLLOWING}`,
      icon: ICONS.TAG,
      hideForUnauth: true,
    },
    {
      label: 'Discover',
      navigate: `/$/${PAGES.DISCOVER}`,
      icon: ICONS.DISCOVER,
    },
    {
      label: IS_WEB ? 'Purchased' : 'Library',
      navigate: `/$/${PAGES.LIBRARY}`,
      icon: ICONS.PURCHASED,
      hideForUnauth: true,
    },
  ];

  const ABSOLUTE_LINKS: Array<{
    label: string,
    navigate?: string,
    onClick?: () => any,
    icon: string,
    extra?: Node,
    hideForUnauth?: boolean,
  }> = [
    {
      label: 'Upload',
      navigate: `/$/${PAGES.UPLOAD}`,
      icon: ICONS.PUBLISH,
    },
    {
      label: 'New Channel',
      navigate: `/$/${PAGES.CHANNEL_NEW}`,
      icon: ICONS.CHANNEL,
      hideForUnauth: true,
    },
    {
      label: 'Uploads',
      navigate: `/$/${PAGES.UPLOADS}`,
      icon: ICONS.PUBLISH,
      hideForUnauth: true,
    },

    {
      label: 'Channels',
      navigate: `/$/${PAGES.CHANNELS}`,
      icon: ICONS.CHANNEL,
      hideForUnauth: true,
    },
    {
      label: 'Creator Analytics',
      navigate: `/$/${PAGES.CREATOR_DASHBOARD}`,
      icon: ICONS.ANALYTICS,
      hideForUnauth: true,
    },
    {
      label: 'Wallet',
      navigate: `/$/${PAGES.WALLET}`,
      icon: ICONS.WALLET,
      hideForUnauth: true,
    },
    {
      label: 'Notifications',
      navigate: `/$/${PAGES.NOTIFICATIONS}`,
      icon: ICONS.NOTIFICATION,
      extra: <NotificationBubble inline />,
      hideForUnauth: true,
    },
    {
      label: 'Rewards',
      navigate: `/$/${PAGES.REWARDS}`,
      icon: ICONS.REWARDS,
      hideForUnauth: true,
    },
    {
      label: 'Invites',
      navigate: `/$/${PAGES.INVITE}`,
      icon: ICONS.INVITE,
      hideForUnauth: true,
    },
    {
      label: 'Settings',
      navigate: `/$/${PAGES.SETTINGS}`,
      icon: ICONS.SETTINGS,
      hideForUnauth: true,
    },
    {
      label: 'Help',
      navigate: `/$/${PAGES.HELP}`,
      icon: ICONS.HELP,
      hideForUnauth: true,
    },
    {
      label: 'Sign Out',
      onClick: doSignOut,
      icon: ICONS.SIGN_OUT,
      hideForUnauth: true,
    },
  ];

  const UNAUTH_LINKS: Array<{
    label: string,
    navigate: string,
    icon: string,
    extra?: Node,
  }> = [
    {
      label: 'Sign In',
      navigate: `/$/${PAGES.AUTH_SIGNIN}`,
      icon: ICONS.SIGN_IN,
    },
    {
      label: 'Register',
      navigate: `/$/${PAGES.AUTH}`,
      icon: ICONS.SIGN_UP,
    },
    {
      label: 'Settings',
      navigate: `/$/${PAGES.SETTINGS}`,
      icon: ICONS.SETTINGS,
    },
    {
      label: 'Help',
      navigate: `/$/${PAGES.HELP}`,
      icon: ICONS.HELP,
    },
  ];

  const notificationsEnabled = user && user.experimental_ui;
  const isAuthenticated = Boolean(email);
  const [pulseLibrary, setPulseLibrary] = React.useState(false);
  const isPersonalized = !IS_WEB || isAuthenticated;
  const isAbsolute = isOnFilePage || isMediumScreen;
  const microNavigation = !sidebarOpen || isMediumScreen;
  const subLinks = email
    ? ABSOLUTE_LINKS.filter(link => {
        if (!notificationsEnabled && link.icon === ICONS.NOTIFICATION) {
          return false;
        }

        return true;
      })
    : UNAUTH_LINKS;

  React.useEffect(() => {
    if (purchaseSuccess) {
      setPulseLibrary(true);

      let timeout = setTimeout(() => {
        setPulseLibrary(false);
        doClearPurchasedUriSuccess();
      }, 2500);

      return () => clearTimeout(timeout);
    }
  }, [setPulseLibrary, purchaseSuccess, doClearPurchasedUriSuccess]);

  React.useEffect(() => {
    function handleKeydown(e: SyntheticKeyboardEvent<*>) {
      if (e.keyCode === ESCAPE_KEY_CODE && isAbsolute) {
        setSidebarOpen(false);
      } else if (e.keyCode === BACKSLASH_KEY_CODE) {
        const hasActiveInput = document.querySelector('input:focus');
        if (!hasActiveInput) {
          setSidebarOpen(!sidebarOpen);
        }
      }
    }

    window.addEventListener('keydown', handleKeydown);

    return () => window.removeEventListener('keydown', handleKeydown);
  }, [sidebarOpen, setSidebarOpen, isAbsolute]);

  return (
    <div
      className={classnames('navigation__wrapper', {
        'navigation__wrapper--micro': microNavigation && !isOnFilePage,
        'navigation__wrapper--absolute': isAbsolute,
      })}
    >
      {!isOnFilePage && (
        <nav className={classnames('navigation', { 'navigation--micro': microNavigation, 'navigation--mac': IS_MAC })}>
          <ul className={classnames('navigation-links', { 'navigation-links--micro': !sidebarOpen })}>
            {TOP_LEVEL_LINKS.map(linkProps =>
              !email && linkProps.hideForUnauth && IS_WEB ? null : (
                <li key={linkProps.navigate}>
                  <Button
                    {...linkProps}
                    label={__(linkProps.label)}
                    icon={pulseLibrary && linkProps.icon === ICONS.LIBRARY ? ICONS.PURCHASED : linkProps.icon}
                    className={classnames('navigation-link', {
                      'navigation-link--pulse': linkProps.icon === ICONS.LIBRARY && pulseLibrary,
                      'navigation-link--highlighted': linkProps.icon === ICONS.NOTIFICATION && unreadCount > 0,
                    })}
                    activeClass="navigation-link--active"
                  />
                  {linkProps.extra}
                </li>
              )
            )}
          </ul>

          {sidebarOpen && isPersonalized && subscriptions && subscriptions.length > 0 && (
            <ul className="navigation__secondary navigation-links navigation-links--small">
              {subscriptions.map(({ uri, channelName }, index) => (
                <li key={uri} className="navigation-link__wrapper">
                  <Button
                    navigate={uri}
                    label={channelName}
                    className="navigation-link"
                    activeClass="navigation-link--active"
                  />
                </li>
              ))}
            </ul>
          )}
        </nav>
      )}

      {(isOnFilePage || isMediumScreen) && sidebarOpen && (
        <>
          <nav
            className={classnames('navigation--absolute', {
              'navigation--mac': IS_MAC,
            })}
          >
            <ul className="navigation-links--absolute">
              {TOP_LEVEL_LINKS.map(linkProps =>
                !email && linkProps.hideForUnauth && IS_WEB ? null : (
                  <li key={linkProps.navigate}>
                    <Button
                      {...linkProps}
                      label={__(linkProps.label)}
                      icon={pulseLibrary && linkProps.icon === ICONS.LIBRARY ? ICONS.PURCHASED : linkProps.icon}
                      className={classnames('navigation-link', {
                        'navigation-link--pulse': linkProps.icon === ICONS.LIBRARY && pulseLibrary,
                        'navigation-link--highlighted': linkProps.icon === ICONS.NOTIFICATION && unreadCount > 0,
                      })}
                      activeClass="navigation-link--active"
                    />
                    {linkProps.extra}
                  </li>
                )
              )}
            </ul>
            <ul className="navigation-links--absolute">
              {subLinks.map(linkProps =>
                !email && linkProps.hideForUnauth && IS_WEB ? null : (
                  <li key={linkProps.navigate} className="mobile-only">
                    <Button
                      {...linkProps}
                      label={__(linkProps.label)}
                      className="navigation-link"
                      activeClass="navigation-link--active"
                    />
                    {linkProps.extra}
                  </li>
                )
              )}
            </ul>
            {isPersonalized && subscriptions && subscriptions.length > 0 && (
              <ul className="navigation__secondary navigation-links--small">
                {subscriptions.map(({ uri, channelName }, index) => (
                  <li key={uri} className="navigation-link__wrapper">
                    <Button
                      navigate={uri}
                      label={channelName}
                      className="navigation-link"
                      activeClass="navigation-link--active"
                    />
                  </li>
                ))}
              </ul>
            )}
          </nav>
          <div
            className={classnames('navigation__overlay', {
              'navigation__overlay--mac': IS_MAC,
            })}
            onClick={() => setSidebarOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export default SideNavigation;
