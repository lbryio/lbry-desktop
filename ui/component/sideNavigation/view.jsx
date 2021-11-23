// @flow
import type { Node } from 'react';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import * as KEYCODES from 'constants/keycodes';
import React, { useEffect } from 'react';
import Button from 'component/button';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import NotificationBubble from 'component/notificationBubble';
import I18nMessage from 'component/i18nMessage';
import ChannelThumbnail from 'component/channelThumbnail';
import { GetLinksData } from 'util/buildHomepage';
import { DOMAIN, ENABLE_UI_NOTIFICATIONS, ENABLE_NO_SOURCE_CLAIMS, CHANNEL_STAKED_LEVEL_LIVESTREAM } from 'config';

const FOLLOWED_ITEM_INITIAL_LIMIT = 10;

type SideNavLink = {
  title: string,
  link?: string,
  route?: string,
  onClick?: () => any,
  icon: string,
  extra?: Node,
  hideForUnauth?: boolean,
};

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

const PLAYLISTS = {
  title: 'Lists',
  link: `/$/${PAGES.LISTS}`,
  icon: ICONS.STACK,
  hideForUnauth: true,
};

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

// ****************************************************************************
// ****************************************************************************

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
  activeChannelStakedLevel: number,
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
    activeChannelStakedLevel,
  } = props;

  const EXTRA_SIDEBAR_LINKS = GetLinksData(homepageData).map(({ pinnedUrls, ...theRest }) => theRest);

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

  const notificationsEnabled = ENABLE_UI_NOTIFICATIONS || (user && user.experimental_ui);
  const isAuthenticated = Boolean(email);

  // SIDE LINKS: FOLLOWING, HOME, [FULL,] [EXTRA]
  let SIDE_LINKS: Array<SideNavLink> = [];

  SIDE_LINKS.push(HOME);
  SIDE_LINKS.push(RECENT_FROM_FOLLOWING);
  SIDE_LINKS.push(PLAYLISTS);

  if (EXTRA_SIDEBAR_LINKS) {
    // $FlowFixMe
    SIDE_LINKS.push(...EXTRA_SIDEBAR_LINKS);

    const WILD_WEST = {
      title: 'Wild West',
      link: `/$/${PAGES.WILD_WEST}`,
      icon: ICONS.WILD_WEST,
    };

    SIDE_LINKS.push(WILD_WEST);
  }

  const livestreamEnabled = Boolean(
    ENABLE_NO_SOURCE_CLAIMS &&
      user &&
      !user.odysee_live_disabled &&
      (activeChannelStakedLevel >= CHANNEL_STAKED_LEVEL_LIVESTREAM || user.odysee_live_enabled)
  );

  const [pulseLibrary, setPulseLibrary] = React.useState(false);
  const [expandSubscriptions, setExpandSubscriptions] = React.useState(false);
  const [expandTags, setExpandTags] = React.useState(false);

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

  const showSubscriptionSection = sidebarOpen && isPersonalized && subscriptions && subscriptions.length > 0;
  const showTagSection = sidebarOpen && isPersonalized && followedTags && followedTags.length;

  let displayedSubscriptions = subscriptions;
  if (showSubscriptionSection && subscriptions.length > FOLLOWED_ITEM_INITIAL_LIMIT && !expandSubscriptions) {
    displayedSubscriptions = subscriptions.slice(0, FOLLOWED_ITEM_INITIAL_LIMIT);
  }

  let displayedFollowedTags = followedTags;
  if (showTagSection && followedTags.length > FOLLOWED_ITEM_INITIAL_LIMIT && !expandTags) {
    displayedFollowedTags = followedTags.slice(0, FOLLOWED_ITEM_INITIAL_LIMIT);
  }

  function getSubscriptionSection() {
    if (showSubscriptionSection) {
      return (
        <>
          <ul className="navigation__secondary navigation-links">
            {displayedSubscriptions.map((subscription) => (
              <SubscriptionListItem key={subscription.uri} subscription={subscription} />
            ))}
          </ul>
          {subscriptions.length > FOLLOWED_ITEM_INITIAL_LIMIT && (
            <Button
              label={expandSubscriptions ? __('Show less') : __('Show more')}
              className="navigation-link"
              onClick={() => setExpandSubscriptions(!expandSubscriptions)}
            />
          )}
        </>
      );
    }
    return null;
  }

  function getFollowedTagsSection() {
    if (showTagSection) {
      return (
        <>
          <ul className="navigation__secondary navigation-links navigation-links--small">
            {displayedFollowedTags.map(({ name }, key) => (
              <li key={name} className="navigation-link__wrapper">
                <Button navigate={`/$/discover?t=${name}`} label={`#${name}`} className="navigation-link" />
              </li>
            ))}
          </ul>
          {followedTags.length > FOLLOWED_ITEM_INITIAL_LIMIT && (
            <Button
              label={expandTags ? __('Show less') : __('Show more')}
              className="navigation-link"
              onClick={() => setExpandTags(!expandTags)}
            />
          )}
        </>
      );
    }
    return null;
  }

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
      if (e.keyCode === KEYCODES.ESCAPE && isAbsolute) {
        setSidebarOpen(false);
      } else if (e.keyCode === KEYCODES.BACKSLASH) {
        const hasActiveInput = document.querySelector('input:focus, textarea:focus');
        if (!hasActiveInput) {
          setSidebarOpen(!sidebarOpen);
        }
      }
    }

    window.addEventListener('keydown', handleKeydown);

    return () => window.removeEventListener('keydown', handleKeydown);
  }, [sidebarOpen, setSidebarOpen, isAbsolute]);

  useEffect(() => {
    if (!window.sp) {
      const gdprDiv = document.getElementById('gdprPrivacyFooter');
      if (gdprDiv) {
        gdprDiv.style.display = 'none';
      }
    }
  }, [sidebarOpen]);

  const unAuthNudge =
    DOMAIN === 'lbry.tv' ? null : (
      <div className="navigation__auth-nudge">
        <span>
          <I18nMessage tokens={{ lbc: <Icon icon={ICONS.LBC} /> }}>
            Sign up to earn %lbc% for you and your favorite creators.
          </I18nMessage>
        </span>
        <Button
          button="secondary"
          label={__('Sign Up')}
          navigate={`/$/${PAGES.AUTH}?src=sidenav_nudge`}
          disabled={user === null}
        />{' '}
      </div>
    );

  const helpLinks = (
    <ul className="navigation__tertiary navigation-links--small">
      <li className="navigation-link">
        <Button label={__('FAQ and Support')} href="https://odysee.com/@OdyseeHelp:b" />
      </li>
      <li className="navigation-link">
        <Button label={__('Community Guidelines')} href="https://odysee.com/@OdyseeHelp:b/Community-Guidelines:c" />
      </li>
      <li className="navigation-link">
        <Button label={__('Terms')} href="https://odysee.com/$/tos" />
      </li>
      <li className="navigation-link">
        <Button label={__('Privacy Policy')} href="https://odysee.com/$/privacypolicy" />
      </li>
      <li className="navigation-link" id="gdprPrivacyFooter">
        <Button label={__('Cookies')} onClick={() => window.sp && window.sp.showPrivacyBanner()} />
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
          aria-label={'Sidebar'}
          className={classnames('navigation', {
            'navigation--micro': microNavigation,
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
            {getSubscriptionSection()}
            {getFollowedTagsSection()}
            {!isAuthenticated && sidebarOpen && unAuthNudge}
          </div>

          {sidebarOpen && helpLinks}
        </nav>
      )}

      {(isOnFilePage || isMediumScreen) && sidebarOpen && (
        <>
          <nav className="navigation--absolute">
            <div>
              <ul className="navigation-links--absolute mobile-only">
                {email && livestreamEnabled && (
                  <li key={'Go Live'} className="mobile-only">
                    <Button
                      icon={ICONS.VIDEO}
                      navigate={`/$/${PAGES.LIVESTREAM}`}
                      label={__('Go Live')}
                      title={__('Go Live')}
                      className="navigation-link"
                      activeClass="navigation-link--active"
                    />
                  </li>
                )}
              </ul>
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
              {getSubscriptionSection()}
              {getFollowedTagsSection()}
              {!isAuthenticated && unAuthNudge}
              {helpLinks}
            </div>
          </nav>
          <div className="navigation__overlay" onClick={() => setSidebarOpen(false)} />
        </>
      )}
    </div>
  );
}

function SubscriptionListItem({ subscription }: { subscription: Subscription }) {
  const { uri, channelName } = subscription;
  return (
    <li className="navigation-link__wrapper">
      <Button
        navigate={uri}
        className="navigation-link navigation-link--with-thumbnail"
        activeClass="navigation-link--active"
      >
        <ChannelThumbnail xsmall uri={uri} hideStakedIndicator />
        <span dir="auto" className="button__label">
          {channelName}
        </span>
      </Button>
    </li>
  );
}

export default SideNavigation;
