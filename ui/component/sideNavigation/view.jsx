// @flow
import type { Node } from 'react';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import NotificationBubble from 'component/notificationBubble';
import I18nMessage from 'component/i18nMessage';
import { PINNED_LABEL_1, PINNED_URI_1, PINNED_URI_2, PINNED_LABEL_2, SIMPLE_SITE, DOMAIN } from 'config';
// @if TARGET='app'
import { IS_MAC } from 'component/app/view';
// @endif

const ESCAPE_KEY_CODE = 27;
const BACKSLASH_KEY_CODE = 220;

const HOME = {
  title: 'Home',
  link: `/`,
  icon: ICONS.HOME,
  onClick: () => {
    if (window.location.pathname === '/') window.location.reload();
  },
};

const RECENT_FROM_FOLLOWING = {
  title: 'Following --[sidebar button]--',
  link: `/$/${PAGES.CHANNELS_FOLLOWING}`,
  icon: ICONS.SUBSCRIBE,
};

type Props = {
  subscriptions: Array<Subscription>,
  followedTags: Array<Tag>,
  email: ?string,
  uploadCount: number,
  doSignOut: () => void,
  sidebarOpen: boolean,
  setSidebarOpen: (boolean) => void,
  isMediumScreen: boolean,
  isOnFilePage: boolean,
  unseenCount: number,
  purchaseSuccess: boolean,
  doClearPurchasedUriSuccess: () => void,
  user: ?User,
  homepageData: any,
  hasExperimentalUi: boolean,
};

type SideNavLink = {
  title: string,
  link?: string,
  route?: string,
  onClick?: () => any,
  icon: string,
  extra?: Node,
  hideForUnauth?: boolean,
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
    unseenCount,
    homepageData,
    user,
    followedTags,
    hasExperimentalUi,
  } = props;

  const { EXTRA_SIDEBAR_LINKS } = homepageData;

  const FULL_LINKS: Array<SideNavLink> = [
    {
      title: 'Your Tags',
      link: `/$/${PAGES.TAGS_FOLLOWING}`,
      icon: ICONS.TAG,
      hideForUnauth: true,
    },
    {
      title: 'Discover',
      link: `/$/${PAGES.DISCOVER}`,
      icon: ICONS.DISCOVER,
    },
    {
      title: IS_WEB ? 'Purchased' : 'Library',
      link: `/$/${PAGES.LIBRARY}`,
      icon: ICONS.PURCHASED,
      hideForUnauth: true,
    },
  ];

  const MOBILE_LINKS: Array<SideNavLink> = [
    {
      title: 'Notifications',
      link: `/$/${PAGES.NOTIFICATIONS}`,
      icon: ICONS.NOTIFICATION,
      extra: <NotificationBubble inline />,
      hideForUnauth: true,
    },
    {
      title: 'Upload',
      link: `/$/${PAGES.UPLOAD}`,
      icon: ICONS.PUBLISH,
    },
    {
      title: 'New Channel',
      link: `/$/${PAGES.CHANNEL_NEW}`,
      icon: ICONS.CHANNEL,
      hideForUnauth: true,
    },
    {
      title: 'Uploads',
      link: `/$/${PAGES.UPLOADS}`,
      icon: ICONS.PUBLISH,
      hideForUnauth: true,
    },

    {
      title: 'Channels',
      link: `/$/${PAGES.CHANNELS}`,
      icon: ICONS.CHANNEL,
      hideForUnauth: true,
    },
    {
      title: 'Creator Analytics',
      link: `/$/${PAGES.CREATOR_DASHBOARD}`,
      icon: ICONS.ANALYTICS,
      hideForUnauth: true,
    },
    {
      title: 'Wallet',
      link: `/$/${PAGES.WALLET}`,
      icon: ICONS.WALLET,
      hideForUnauth: true,
    },
    {
      title: 'Rewards',
      link: `/$/${PAGES.REWARDS}`,
      icon: ICONS.REWARDS,
      hideForUnauth: true,
    },
    {
      title: 'Invites',
      link: `/$/${PAGES.INVITE}`,
      icon: ICONS.INVITE,
      hideForUnauth: true,
    },
    {
      title: 'Settings',
      link: `/$/${PAGES.SETTINGS}`,
      icon: ICONS.SETTINGS,
      hideForUnauth: true,
    },
    {
      title: 'Help',
      link: `/$/${PAGES.HELP}`,
      icon: ICONS.HELP,
      hideForUnauth: true,
    },
    {
      title: 'Sign Out',
      onClick: doSignOut,
      icon: ICONS.SIGN_OUT,
      hideForUnauth: true,
    },
  ];

  const UNAUTH_LINKS: Array<SideNavLink> = [
    {
      title: 'Log In',
      link: `/$/${PAGES.AUTH_SIGNIN}`,
      icon: ICONS.SIGN_IN,
    },
    {
      title: 'Sign Up',
      link: `/$/${PAGES.AUTH}`,
      icon: ICONS.SIGN_UP,
    },
    {
      title: 'Settings',
      link: `/$/${PAGES.SETTINGS}`,
      icon: ICONS.SETTINGS,
    },
    {
      title: 'Help',
      link: `/$/${PAGES.HELP}`,
      icon: ICONS.HELP,
    },
  ];

  if (PINNED_URI_1 && PINNED_LABEL_1) {
    MOBILE_LINKS.push({
      title: PINNED_LABEL_1,
      link: PINNED_URI_1,
      icon: ICONS.PINNED,
    });
  }

  if (PINNED_URI_2 && PINNED_LABEL_2) {
    MOBILE_LINKS.push({
      title: PINNED_LABEL_2,
      link: PINNED_URI_2,
      icon: ICONS.PINNED,
    });
  }

  const notificationsEnabled = SIMPLE_SITE || (user && user.experimental_ui);
  const isAuthenticated = Boolean(email);
  // SIDE LINKS: FOLLOWING, HOME, [FULL,] [EXTRA]
  let SIDE_LINKS: Array<SideNavLink> = [];

  SIDE_LINKS.push(HOME);
  SIDE_LINKS.push(RECENT_FROM_FOLLOWING);
  if (!SIMPLE_SITE && hasExperimentalUi) {
    FULL_LINKS.push({
      title: 'Lists',
      link: `/$/${PAGES.LISTS}`,
      icon: ICONS.STACK,
      hideForUnauth: true,
    });
  }
  if (!SIMPLE_SITE) {
    SIDE_LINKS.push(...FULL_LINKS);
  } else if (SIMPLE_SITE && hasExperimentalUi) {
    SIDE_LINKS.push({
      title: 'Lists',
      link: `/$/${PAGES.LISTS}`,
      icon: ICONS.STACK,
      hideForUnauth: true,
    });
  }

  if (EXTRA_SIDEBAR_LINKS) {
    SIDE_LINKS.push(...EXTRA_SIDEBAR_LINKS);
  }

  const [pulseLibrary, setPulseLibrary] = React.useState(false);
  const isPersonalized = !IS_WEB || isAuthenticated;
  const isAbsolute = isOnFilePage || isMediumScreen;
  const microNavigation = !sidebarOpen || isMediumScreen;
  const subLinks = email
    ? MOBILE_LINKS.filter((link) => {
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

  const unAuthNudge =
    DOMAIN === 'lbry.tv' ? null : (
      <div className="navigation__auth-nudge">
        <span>
          <I18nMessage tokens={{ lbc: <Icon icon={ICONS.LBC} /> }}>
            Sign up to earn %lbc% for you and your favorite creators.
          </I18nMessage>
        </span>
        <Button button="secondary" label={__('Sign Up')} navigate={`/$/${PAGES.AUTH}?src=sidenav_nudge`} />
      </div>
    );

  const helpLinks = (
    <ul className="navigation__tertiary navigation-links--small">
      <li className="navigation-link">
        <Button label={__('About --[link title in Sidebar or Footer]--')} href="https://lbry.com/about" />
      </li>
      <li className="navigation-link">
        <Button label={__('FAQ')} href="https://odysee.com/@OdyseeHelp:b" />
      </li>

      <li className="navigation-link">
        <Button label={__('Community Guidelines')} href="https://odysee.com/@OdyseeHelp:b/Community-Guidelines:c" />
      </li>

      <li className="navigation-link">
        <Button label={__('Support --[used in footer; general help/support]--')} href="https://lbry.com/support" />
      </li>
      <li className="navigation-link">
        <Button label={__('Terms')} href="https://lbry.com/termsofservice" />
      </li>
      <li className="navigation-link">
        <Button label={__('Privacy Policy')} href="https://lbry.com/privacy" />
      </li>
    </ul>
  );

  return (
    <div
      className={classnames('navigation__wrapper', {
        'navigation__wrapper--micro': microNavigation && !isOnFilePage,
        'navigation__wrapper--absolute': isAbsolute,
      })}
    >
      {!isOnFilePage && (
        <nav
          className={classnames('navigation', {
            'navigation--micro': microNavigation,
            // @if TARGET='app'
            'navigation--mac': IS_MAC,
            // @endif
          })}
        >
          <div>
            <ul className={classnames('navigation-links', { 'navigation-links--micro': !sidebarOpen })}>
              {SIDE_LINKS.map((linkProps) => {
                //   $FlowFixMe
                const { hideForUnauth, ...passedProps } = linkProps;
                return !email && linkProps.hideForUnauth && IS_WEB ? null : (
                  <li key={linkProps.route || linkProps.link}>
                    <Button
                      {...passedProps}
                      label={__(linkProps.title)}
                      title={__(linkProps.title)}
                      //   $FlowFixMe
                      navigate={linkProps.route || linkProps.link}
                      icon={pulseLibrary && linkProps.icon === ICONS.LIBRARY ? ICONS.PURCHASED : linkProps.icon}
                      className={classnames('navigation-link', {
                        'navigation-link--pulse': linkProps.icon === ICONS.LIBRARY && pulseLibrary,
                        'navigation-link--highlighted': linkProps.icon === ICONS.NOTIFICATION && unseenCount > 0,
                      })}
                      activeClass="navigation-link--active"
                    />
                    {linkProps.extra && linkProps.extra}
                  </li>
                );
              })}
            </ul>

            {sidebarOpen && isPersonalized && subscriptions && subscriptions.length > 0 && (
              <ul className="navigation__secondary navigation-links">
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
            {sidebarOpen && isPersonalized && followedTags && followedTags.length > 0 && (
              <ul className="navigation__secondary navigation-links navigation-links--small">
                {followedTags.map(({ name }, key) => (
                  <li key={name} className="navigation-link__wrapper">
                    <Button navigate={`/$/discover?t=${name}`} label={`#${name}`} className="navigation-link" />
                  </li>
                ))}
              </ul>
            )}

            {!isAuthenticated && sidebarOpen && unAuthNudge}
          </div>

          {SIMPLE_SITE && sidebarOpen && helpLinks}
        </nav>
      )}

      {(isOnFilePage || isMediumScreen) && sidebarOpen && (
        <>
          <nav
            className={classnames('navigation--absolute', {
              // @if TARGET='app'
              'navigation--mac': IS_MAC,
              // @endif
            })}
          >
            <div>
              <ul className="navigation-links--absolute">
                {SIDE_LINKS.map((linkProps) => {
                  //   $FlowFixMe
                  const { hideForUnauth, link, route, ...passedProps } = linkProps;
                  return !email && linkProps.hideForUnauth && IS_WEB ? null : (
                    <li key={route || link}>
                      <Button
                        {...passedProps}
                        navigate={route || link}
                        label={__(linkProps.title)}
                        title={__(linkProps.title)}
                        icon={pulseLibrary && linkProps.icon === ICONS.LIBRARY ? ICONS.PURCHASED : linkProps.icon}
                        className={classnames('navigation-link', {
                          'navigation-link--pulse': linkProps.icon === ICONS.LIBRARY && pulseLibrary,
                          'navigation-link--highlighted': linkProps.icon === ICONS.NOTIFICATION && unseenCount > 0,
                        })}
                        activeClass="navigation-link--active"
                      />
                      {linkProps.extra && linkProps.extra}
                    </li>
                  );
                })}
              </ul>
              <ul className="navigation-links--absolute mobile-only">
                {subLinks.map((linkProps) => {
                  const { hideForUnauth, ...passedProps } = linkProps;

                  return !email && hideForUnauth && IS_WEB ? null : (
                    <li key={linkProps.title} className="mobile-only">
                      <Button
                        {...passedProps}
                        navigate={linkProps.link}
                        label={__(linkProps.title)}
                        title={__(linkProps.title)}
                        className="navigation-link"
                        activeClass="navigation-link--active"
                      />
                      {linkProps.extra}
                    </li>
                  );
                })}
              </ul>
              {sidebarOpen && isPersonalized && subscriptions && subscriptions.length > 0 && (
                <ul className="navigation__secondary navigation-links">
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
              {sidebarOpen && isPersonalized && followedTags && followedTags.length > 0 && (
                <ul className="navigation__secondary navigation-links navigation-links--small">
                  {followedTags.map(({ name }, key) => (
                    <li key={name} className="navigation-link__wrapper">
                      <Button navigate={`/$/discover?t=${name}`} label={`#${name}`} className="navigation-link" />
                    </li>
                  ))}
                </ul>
              )}
              {!isAuthenticated && unAuthNudge}
              {SIMPLE_SITE && helpLinks}
            </div>
          </nav>
          <div
            className={classnames('navigation__overlay', {
              // @if TARGET='app'
              'navigation__overlay--mac': IS_MAC,
              // @endif
            })}
            onClick={() => setSidebarOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export default SideNavigation;
