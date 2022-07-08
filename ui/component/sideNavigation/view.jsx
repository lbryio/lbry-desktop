// @flow
import type { Node } from 'react';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import * as KEYCODES from 'constants/keycodes';
import React from 'react';
import Button from 'component/button';
import classnames from 'classnames';
import NotificationBubble from 'component/notificationBubble';
import DebouncedInput from 'component/common/debounced-input';
import ChannelThumbnail from 'component/channelThumbnail';
import { useIsMobile, isTouch } from 'effects/use-screensize';
import { IS_MAC } from 'component/app/view';
import { useHistory } from 'react-router';
import { ENABLE_UI_NOTIFICATIONS } from 'config';

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
    user,
    followedTags,
  } = props;

  const {
    location: { pathname },
  } = useHistory();

  const HOME = {
    title: 'Home',
    link: `/`,
    icon: ICONS.HOME,
    onClick: () => {
      if (pathname === '/') window.location.reload();
    },
  };

  const RECENT_FROM_FOLLOWING = {
    title: 'Following --[sidebar button]--',
    link: `/$/${PAGES.CHANNELS_FOLLOWING}`,
    icon: ICONS.SUBSCRIBE,
  };
  const TAGS_FROM_FOLLOWING = {
    title: 'Your Tags',
    link: `/$/${PAGES.TAGS_FOLLOWING}`,
    icon: ICONS.TAG,
  };

  const DISCOVER = {
    title: 'Discover',
    link: `/$/${PAGES.DISCOVER}`,
    icon: ICONS.DISCOVER,
  };

  const LIBRARY = {
    title: 'Library',
    link: `/$/${PAGES.LIBRARY}`,
    icon: ICONS.PURCHASED,
  };

  const NOTIFICATIONS = {
    title: 'Notifications',
    link: `/$/${PAGES.NOTIFICATIONS}`,
    icon: ICONS.NOTIFICATION,
    extra: <NotificationBubble inline />,
  };

  const PLAYLISTS = {
    title: 'Lists',
    link: `/$/${PAGES.LISTS}`,
    icon: ICONS.STACK,
  };

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

  const [pulseLibrary, setPulseLibrary] = React.useState(false);
  const [expandSubscriptions, setExpandSubscriptions] = React.useState(false);
  const [expandTags, setExpandTags] = React.useState(false);

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

  const showSubscriptionSection = shouldRenderLargeMenu && subscriptions && subscriptions.length > 0;
  const showTagSection = sidebarOpen && followedTags && followedTags.length;

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

  const helpLinks = (
    <ul className="navigation__tertiary navigation-links--small">
      <li className="navigation-link">
        <Button label={__('About --[link title in Sidebar or Footer]--')} href="https://lbry.com/about" />
      </li>
      <li className="navigation-link">
        <Button label={__('FAQ')} href="https://lbry.com/faq" />
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
          // @if TARGET='app'
          'navigation--mac': IS_MAC,
          // @endif
        })}
      >
        {(!canDisposeMenu || sidebarOpen) && (
          <div className="navigation-inner-container">
            <ul className="navigation-links--absolute mobile-only">{notificationsEnabled && getLink(NOTIFICATIONS)}</ul>

            <ul
              className={classnames('navigation-links', {
                'navigation-links--micro': showMicroMenu,
                'navigation-links--absolute': shouldRenderLargeMenu,
                'navigation--mac': IS_MAC,
              })}
            >
              {getLink(HOME)}
              {getLink(RECENT_FROM_FOLLOWING)}
              {getLink(TAGS_FROM_FOLLOWING)}
              {getLink(DISCOVER)}
              {getLink(LIBRARY)}
              {getLink(PLAYLISTS)}
            </ul>
            <ul className="navigation-links--absolute mobile-only">
              {email && MOBILE_LINKS.map((linkProps) => getLink(linkProps))}
            </ul>

            {getSubscriptionSection()}
            {getFollowedTagsSection()}
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
