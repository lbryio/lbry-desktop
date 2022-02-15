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
import DebouncedInput from 'component/common/debounced-input';
import I18nMessage from 'component/i18nMessage';
import ChannelThumbnail from 'component/channelThumbnail';
import { useIsMobile, useIsLargeScreen, isTouch } from 'effects/use-screensize';
import { GetLinksData } from 'util/buildHomepage';
import { DOMAIN, ENABLE_UI_NOTIFICATIONS, ENABLE_NO_SOURCE_CLAIMS, CHANNEL_STAKED_LEVEL_LIVESTREAM } from 'config';

const FOLLOWED_ITEM_INITIAL_LIMIT = 10;
const touch = isTouch();

type SideNavLink = {
  title: string,
  link?: string,
  route?: string,
  onClick?: () => any,
  icon: string,
  extra?: Node,
  hideForUnauth?: boolean,
};

const GO_LIVE = {
  title: 'Go Live',
  link: `/$/${PAGES.LIVESTREAM}`,
  icon: ICONS.VIDEO,
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

const NOTIFICATIONS = {
  title: 'Notifications',
  link: `/$/${PAGES.NOTIFICATIONS}`,
  icon: ICONS.NOTIFICATION,
  extra: <NotificationBubble inline />,
  hideForUnauth: true,
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

const WILD_WEST = {
  title: 'Wild West',
  link: `/$/${PAGES.WILD_WEST}`,
  icon: ICONS.WILD_WEST,
};

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
  wildWestDisabled: boolean,
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
    wildWestDisabled,
  } = props;

  const isLargeScreen = useIsLargeScreen();

  const EXTRA_SIDEBAR_LINKS = GetLinksData(homepageData, isLargeScreen).map(({ pinnedUrls, ...theRest }) => theRest);

  const MOBILE_LINKS: Array<SideNavLink> = [
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
  const isMobile = useIsMobile();

  const [menuInitialized, setMenuInitialized] = React.useState(false);

  const menuCanCloseCompletely = (isOnFilePage && !isMobile) || (isMobile && menuInitialized);
  const hideMenuFromView = menuCanCloseCompletely && !sidebarOpen;

  const [canDisposeMenu, setCanDisposeMenu] = React.useState(false);

  React.useEffect(() => {
    if (hideMenuFromView || !menuInitialized) {
      const handler = setTimeout(() => {
        setMenuInitialized(true);
        setCanDisposeMenu(true);
      }, 250);
      return () => {
        clearTimeout(handler);
      };
    } else {
      setCanDisposeMenu(false);
    }
  }, [hideMenuFromView, menuInitialized]);

  const shouldRenderLargeMenu = menuCanCloseCompletely || sidebarOpen;

  const showMicroMenu = !sidebarOpen && !menuCanCloseCompletely;
  const showPushMenu = sidebarOpen && !menuCanCloseCompletely;

  const showSubscriptionSection = shouldRenderLargeMenu && isPersonalized && subscriptions && subscriptions.length > 0;
  const showTagSection = sidebarOpen && isPersonalized && followedTags && followedTags.length;

  const [subscriptionFilter, setSubscriptionFilter] = React.useState('');

  const filteredSubscriptions = subscriptions.filter(
    (sub) => !subscriptionFilter || sub.channelName.toLowerCase().includes(subscriptionFilter.toLowerCase())
  );

  let displayedSubscriptions = filteredSubscriptions;
  if (
    showSubscriptionSection &&
    !subscriptionFilter &&
    subscriptions.length > FOLLOWED_ITEM_INITIAL_LIMIT &&
    !expandSubscriptions
  ) {
    displayedSubscriptions = subscriptions.slice(0, FOLLOWED_ITEM_INITIAL_LIMIT);
  }

  let displayedFollowedTags = followedTags;
  if (showTagSection && followedTags.length > FOLLOWED_ITEM_INITIAL_LIMIT && !expandTags) {
    displayedFollowedTags = followedTags.slice(0, FOLLOWED_ITEM_INITIAL_LIMIT);
  }

  function getLink(props: SideNavLink) {
    const { hideForUnauth, route, link, ...passedProps } = props;
    const { title, icon, extra } = passedProps;

    if (hideForUnauth && !email) {
      return null;
    }

    return (
      <li key={route || link || title}>
        <Button
          {...passedProps}
          icon={icon}
          navigate={route || link}
          label={__(title)}
          title={__(title)}
          className={classnames('navigation-link', {
            'navigation-link--pulse': icon === ICONS.LIBRARY && pulseLibrary,
            'navigation-link--highlighted': icon === ICONS.NOTIFICATION && unseenCount > 0,
          })}
          activeClass="navigation-link--active"
        />
        {extra && extra}
      </li>
    );
  }

  function getSubscriptionSection() {
    if (showSubscriptionSection) {
      return (
        <>
          <ul className="navigation__secondary navigation-links">
            {subscriptions.length > FOLLOWED_ITEM_INITIAL_LIMIT && (
              <li className="navigation-item">
                <DebouncedInput icon={ICONS.SEARCH} placeholder={__('Filter')} onChange={setSubscriptionFilter} />
              </li>
            )}
            {displayedSubscriptions.map((subscription) => (
              <SubscriptionListItem key={subscription.uri} subscription={subscription} />
            ))}
            {!!subscriptionFilter && !displayedSubscriptions.length && (
              <li>
                <div className="navigation-item">
                  <div className="empty empty--centered">{__('No results')}</div>
                </div>
              </li>
            )}
            {!subscriptionFilter && subscriptions.length > FOLLOWED_ITEM_INITIAL_LIMIT && (
              <Button
                key="showMore"
                label={expandSubscriptions ? __('Show less') : __('Show more')}
                className="navigation-link"
                onClick={() => setExpandSubscriptions(!expandSubscriptions)}
              />
            )}
          </ul>
        </>
      );
    }
    return null;
  }

  function getFollowedTagsSection() {
    if (showTagSection) {
      return (
        <>
          <ul className="navigation__secondary navigation-links">
            {displayedFollowedTags.map(({ name }, key) => (
              <li key={name} className="navigation-link__wrapper">
                <Button navigate={`/$/discover?t=${name}`} label={`#${name}`} className="navigation-link" />
              </li>
            ))}
            {followedTags.length > FOLLOWED_ITEM_INITIAL_LIMIT && (
              <Button
                key="showMore"
                label={expandTags ? __('Show less') : __('Show more')}
                className="navigation-link"
                onClick={() => setExpandTags(!expandTags)}
              />
            )}
          </ul>
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
    if (!window.Optanon) {
      const gdprDiv = document.getElementById('gdprSidebarLink');
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
      <li className="navigation-link" id="gdprSidebarLink">
        <Button label={__('Cookie Settings')} onClick={() => window.Optanon && window.Optanon.ToggleInfoDisplay()} />
      </li>
    </ul>
  );

  return (
    <div
      className={classnames('navigation__wrapper', {
        'navigation__wrapper--micro': showMicroMenu,
        'navigation__wrapper--absolute': isAbsolute,
      })}
    >
      <nav
        aria-label={'Sidebar'}
        className={classnames('navigation', {
          'navigation--micro': showMicroMenu,
          'navigation--push': showPushMenu,
          'navigation-file-page-and-mobile': hideMenuFromView,
          'navigation-touch': touch,
        })}
      >
        {(!canDisposeMenu || sidebarOpen) && (
          <div className="navigation-inner-container">
            <ul className="navigation-links--absolute mobile-only">
              {notificationsEnabled && getLink(NOTIFICATIONS)}
              {email && livestreamEnabled && getLink(GO_LIVE)}
            </ul>

            <ul
              className={classnames('navigation-links', {
                'navigation-links--micro': showMicroMenu,
                'navigation-links--absolute': shouldRenderLargeMenu,
              })}
            >
              {getLink(HOME)}
              {getLink(RECENT_FROM_FOLLOWING)}
              {getLink(PLAYLISTS)}
            </ul>

            <ul
              className={classnames('navigation-links', {
                'navigation-links--micro': showMicroMenu,
                'navigation-links--absolute': shouldRenderLargeMenu,
              })}
            >
              {EXTRA_SIDEBAR_LINKS && (
                <>
                  {/* $FlowFixMe -- GetLinksData should fix it's data type */}
                  {EXTRA_SIDEBAR_LINKS.map((linkProps) => getLink(linkProps))}
                  {!wildWestDisabled && getLink(WILD_WEST)}
                </>
              )}
            </ul>

            <ul className="navigation-links--absolute mobile-only">
              {email && MOBILE_LINKS.map((linkProps) => getLink(linkProps))}
              {!email && UNAUTH_LINKS.map((linkProps) => getLink(linkProps))}
            </ul>

            {getSubscriptionSection()}
            {getFollowedTagsSection()}
            {!isAuthenticated && sidebarOpen && unAuthNudge}
          </div>
        )}
        {(!canDisposeMenu || sidebarOpen) && shouldRenderLargeMenu && helpLinks}
      </nav>
      <div
        className={classnames('navigation__overlay', {
          'navigation__overlay--active': isAbsolute && sidebarOpen,
        })}
        onClick={() => setSidebarOpen(false)}
      />
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
