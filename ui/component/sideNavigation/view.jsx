// @flow
import React from 'react';
import type { Node } from 'react';
import classnames from 'classnames';

import './style.scss';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import * as KEYCODES from 'constants/keycodes';
import { SIDEBAR_SUBS_DISPLAYED } from 'constants/subscriptions';
import Button from 'component/button';
import ClaimPreviewTitle from 'component/claimPreviewTitle';
import Icon from 'component/common/icon';
import NotificationBubble from 'component/notificationBubble';
import DebouncedInput from 'component/common/debounced-input';
import I18nMessage from 'component/i18nMessage';
import ChannelThumbnail from 'component/channelThumbnail';
import { useIsMobile, useIsLargeScreen } from 'effects/use-screensize';
import { GetLinksData } from 'util/buildHomepage';
import { platform } from 'util/platform';
import { DOMAIN, ENABLE_UI_NOTIFICATIONS } from 'config';
import MembershipBadge from 'component/membershipBadge';

// TODO: move to selector for memoization
import { getSortedRowData } from 'page/home/helper';

const touch = platform.isTouch() && /iPad|Android/i.test(navigator.userAgent);

type SideNavLink = {
  title: string,
  icon: string,
  link?: string,
  route?: string,
  onClick?: () => any,
  extra?: Node,
  hideForUnauth?: boolean,
  noI18n?: boolean,
};

const getHomeButton = (additionalAction) => ({
  title: 'Home',
  link: `/`,
  icon: ICONS.HOME,
  onClick: () => {
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      if (additionalAction) {
        additionalAction();
      }
    }
  },
});

const RECENT_FROM_FOLLOWING = {
  title: 'Following --[sidebar button]--',
  link: `/$/${PAGES.CHANNELS_FOLLOWING}`,
  icon: ICONS.SUBSCRIBE,
};

const NOTIFICATIONS: SideNavLink = {
  title: 'Notifications',
  link: `/$/${PAGES.NOTIFICATIONS}`,
  icon: ICONS.NOTIFICATION,
  extra: <NotificationBubble inline />,
  hideForUnauth: true,
};

const WATCH_LATER: SideNavLink = {
  title: 'Watch Later',
  link: `/$/${PAGES.PLAYLIST}/watchlater`,
  icon: ICONS.TIME,
  hideForUnauth: true,
};

const FAVORITES: SideNavLink = {
  title: 'Favorites',
  link: `/$/${PAGES.PLAYLIST}/favorites`,
  icon: ICONS.STAR,
  hideForUnauth: true,
};

const PLAYLISTS: SideNavLink = {
  title: 'Playlists',
  link: `/$/${PAGES.PLAYLISTS}`,
  icon: ICONS.PLAYLIST,
  hideForUnauth: true,
};

const WATCH_HISTORY: SideNavLink = {
  title: 'Watch History',
  link: `/$/${PAGES.WATCH_HISTORY}`,
  icon: ICONS.WATCH_HISTORY,
  hideForUnauth: true,
};

const PREMIUM: SideNavLink = {
  title: 'Premium',
  link: `/$/${PAGES.ODYSEE_MEMBERSHIP}`,
  icon: ICONS.UPGRADE,
  hideForUnauth: true,
  noI18n: true,
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

type HomepageOrder = { active: ?Array<string>, hidden: ?Array<string> };

type Props = {
  subscriptions: Array<Subscription>,
  lastActiveSubs: ?Array<Subscription>,
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
  homepageOrder: HomepageOrder,
  homepageOrderApplyToSidebar: boolean,
  doClearClaimSearch: () => void,
  hasMembership: ?boolean,
  doFetchLastActiveSubs: (force?: boolean, count?: number) => void,
  doOpenModal: (id: string, ?{}) => void,
};

function SideNavigation(props: Props) {
  const {
    subscriptions,
    lastActiveSubs,
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
    homepageOrder,
    homepageOrderApplyToSidebar,
    user,
    followedTags,
    doClearClaimSearch,
    hasMembership,
    doFetchLastActiveSubs,
    doOpenModal,
  } = props;

  const isLargeScreen = useIsLargeScreen();
  const categories = getSidebarCategories(isLargeScreen);

  const MOBILE_PUBLISH: Array<SideNavLink> = [
    {
      title: 'Go Live',
      link: `/$/${PAGES.LIVESTREAM}`,
      icon: ICONS.VIDEO,
      hideForUnauth: true,
    },
    {
      title: 'Upload',
      link: `/$/${PAGES.UPLOAD}`,
      icon: ICONS.PUBLISH,
      hideForUnauth: true,
    },
    {
      title: 'Post',
      link: `/$/${PAGES.POST}`,
      icon: ICONS.POST,
      hideForUnauth: true,
    },
  ];

  const MOBILE_LINKS: Array<SideNavLink> = [
    {
      title: 'New Channel',
      link: `/$/${PAGES.CHANNEL_NEW}`,
      icon: ICONS.CHANNEL,
      hideForUnauth: true,
    },
    {
      title: 'Sync YouTube Channel',
      link: `/$/${PAGES.YOUTUBE_SYNC}`,
      icon: ICONS.YOUTUBE,
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

  const [pulseLibrary, setPulseLibrary] = React.useState(false);
  const [expandTags, setExpandTags] = React.useState(false);

  const isPersonalized = !IS_WEB || isAuthenticated;
  const isAbsolute = isOnFilePage || isMediumScreen;
  const isMobile = useIsMobile();

  const [menuInitialized, setMenuInitialized] = React.useState(false);

  const menuCanCloseCompletely = (isOnFilePage && !isMobile) || (isMobile && menuInitialized);
  const hideMenuFromView = menuCanCloseCompletely && !sidebarOpen;

  const [canDisposeMenu, setCanDisposeMenu] = React.useState(false);

  const shouldRenderLargeMenu = (menuCanCloseCompletely && !isAbsolute) || sidebarOpen;

  const showMicroMenu = !sidebarOpen && !menuCanCloseCompletely;
  const showPushMenu = sidebarOpen && !menuCanCloseCompletely;
  const showOverlay = isAbsolute && sidebarOpen;

  const showTagSection = sidebarOpen && isPersonalized && followedTags && followedTags.length;

  const [subscriptionFilter, setSubscriptionFilter] = React.useState('');

  let displayedFollowedTags = followedTags;
  if (showTagSection && followedTags.length > SIDEBAR_SUBS_DISPLAYED && !expandTags) {
    displayedFollowedTags = followedTags.slice(0, SIDEBAR_SUBS_DISPLAYED);
  }

  // **************************************************************************
  // **************************************************************************

  function getSidebarCategories(isLargeScreen) {
    const rowData = GetLinksData(homepageData, isLargeScreen);
    let categories = rowData;

    if (homepageOrderApplyToSidebar) {
      const sortedRowData: Array<RowDataItem> = getSortedRowData(Boolean(email), hasMembership, homepageOrder, rowData);
      categories = sortedRowData.filter((x) => x.id !== 'FYP');
    }

    return categories.map(({ pinnedUrls, pinnedClaimIds, hideByDefault, ...theRest }) => theRest);
  }

  function getLink(props: SideNavLink) {
    const { hideForUnauth, route, link, noI18n, ...passedProps } = props;
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
          label={noI18n ? title : __(title)}
          title={noI18n ? title : __(title)}
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
    const showSubsSection = shouldRenderLargeMenu && isPersonalized && subscriptions && subscriptions.length > 0;
    if (showSubsSection) {
      let displayedSubscriptions;
      if (subscriptionFilter) {
        const filter = subscriptionFilter.toLowerCase();
        displayedSubscriptions = subscriptions.filter((sub) => sub.channelName.toLowerCase().includes(filter));
      } else {
        displayedSubscriptions =
          lastActiveSubs && lastActiveSubs.length > 0 ? lastActiveSubs : subscriptions.slice(0, SIDEBAR_SUBS_DISPLAYED);
      }

      if (lastActiveSubs === undefined) {
        return null; // Don't show yet, just wait to save some renders
      }

      return (
        <ul className="navigation__secondary navigation-links">
          {!showMicroMenu && (
            <SectionHeader
              title={__('Following')}
              actionTooltip={__('Manage')}
              navigate={!subscriptionFilter ? `/$/${PAGES.CHANNELS_FOLLOWING_MANAGE}` : ''}
            />
          )}
          {subscriptions.length > SIDEBAR_SUBS_DISPLAYED && (
            <li className="navigation-item">
              <DebouncedInput icon={ICONS.SEARCH} placeholder={__('Filter')} onChange={setSubscriptionFilter} />
            </li>
          )}
          {displayedSubscriptions.map((subscription) => (
            <SubscriptionListItem key={subscription.uri} subscription={subscription} />
          ))}
          {subscriptions.length > SIDEBAR_SUBS_DISPLAYED && (
            <li className="navigation-item">
              <Button
                icon={ICONS.MORE}
                title={__('Manage Following')}
                navigate={`/$/${PAGES.CHANNELS_FOLLOWING_MANAGE}`}
                className="navigation-link navigation-link--icon-centered"
                activeClass="navigation-link--active"
              />
            </li>
          )}
          {!!subscriptionFilter && !displayedSubscriptions.length && (
            <li>
              <div className="navigation-item">
                <div className="empty empty--centered">{__('No results')}</div>
              </div>
            </li>
          )}
        </ul>
      );
    }
    return null;
  }

  function getFollowedTagsSection() {
    if (showTagSection) {
      return (
        <>
          {!showMicroMenu && <SectionHeader title={__('Tags')} />}
          <ul className="navigation__secondary navigation-links">
            {displayedFollowedTags.map(({ name }, key) => (
              <li key={name} className="navigation-link__wrapper">
                <Button navigate={`/$/discover?t=${name}`} label={`#${name}`} className="navigation-link" />
              </li>
            ))}
            {followedTags.length > SIDEBAR_SUBS_DISPLAYED && (
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

  // **************************************************************************
  // **************************************************************************

  React.useEffect(() => {
    // $FlowFixMe
    document.body.style.overflowY = showOverlay ? 'hidden' : '';
    return () => {
      // $FlowFixMe
      document.body.style.overflowY = '';
    };
  }, [showOverlay]);

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

  React.useEffect(() => {
    if (!window.Optanon) {
      const gdprDiv = document.getElementById('gdprSidebarLink');
      if (gdprDiv) {
        gdprDiv.style.display = 'none';
      }
    }

    const ad = document.getElementsByClassName('OUTBRAIN')[0];
    if (ad) {
      if (!sidebarOpen || isMobile) {
        ad.classList.add('LEFT');
      } else {
        ad.classList.remove('LEFT');
      }
    }
  }, [sidebarOpen, isMobile]);

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

  React.useEffect(() => {
    doFetchLastActiveSubs();
  }, []);

  // **************************************************************************
  // **************************************************************************

  type SectionHeaderProps = { title: string, actionTooltip?: string, onClick?: any, navigate?: string };
  const SectionHeader = ({ title, actionTooltip, onClick, navigate }: SectionHeaderProps) => {
    return (
      <div className="navigation-section-header">
        <span>{title}</span>
        {(onClick || navigate) && (
          <Button
            button="link"
            iconRight={ICONS.SETTINGS}
            onClick={onClick}
            navigate={navigate}
            title={actionTooltip}
          />
        )}
      </div>
    );
  };

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
        <Button label={__('FAQ and Support')} href="https://help.odysee.tv/" target="_blank" />
      </li>
      <li className="navigation-link">
        <Button label={__('Community Guidelines')} href="https://help.odysee.tv/communityguidelines" target="_blank" />
      </li>
      <li className="navigation-link">
        <Button label={__('Careers')} navigate={`/$/${PAGES.CAREERS}`} />
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

  // **************************************************************************
  // **************************************************************************

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
            <ul className="navigation-links--absolute mobile-only">{notificationsEnabled && getLink(NOTIFICATIONS)}</ul>

            <ul
              className={classnames('navigation-links', {
                'navigation-links--micro': showMicroMenu,
                'navigation-links--absolute': shouldRenderLargeMenu,
              })}
            >
              {getLink(getHomeButton(doClearClaimSearch))}
              {getLink(RECENT_FROM_FOLLOWING)}
              {!hasMembership && getLink(PREMIUM)}
            </ul>

            <ul
              className={classnames('navigation-links', {
                'navigation-links--micro': showMicroMenu,
                'navigation-links--absolute': shouldRenderLargeMenu,
              })}
            >
              {!showMicroMenu && email && <SectionHeader title={__('Lists')} />}
              {!showMicroMenu && getLink(WATCH_LATER)}
              {!showMicroMenu && getLink(FAVORITES)}
              {getLink(PLAYLISTS)}
              {!showMicroMenu && getLink(WATCH_HISTORY)}
            </ul>

            <ul
              className={classnames('navigation-links', {
                'navigation-links--micro': showMicroMenu,
                'navigation-links--absolute': shouldRenderLargeMenu,
              })}
            >
              {categories && (
                <>
                  {!showMicroMenu && (
                    <SectionHeader
                      title={__('Categories')}
                      onClick={() => doOpenModal(MODALS.CUSTOMIZE_HOMEPAGE)}
                      actionTooltip={__('Sort and customize your homepage')}
                    />
                  )}
                  {/* $FlowFixMe: GetLinksData type needs an update */}
                  {categories.map((linkProps) => getLink(linkProps))}
                </>
              )}
            </ul>

            <ul className="navigation-links--absolute mobile-only">
              {email && MOBILE_PUBLISH.map((linkProps) => getLink(linkProps))}
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
          'navigation__overlay--active': showOverlay,
        })}
        onClick={() => setSidebarOpen(false)}
      />
    </div>
  );
}

// ****************************************************************************
// SubscriptionListItem
// ****************************************************************************

type SubItemProps = {
  subscription: Subscription,
};

function SubscriptionListItem(props: SubItemProps) {
  const { subscription } = props;
  const { uri, channelName } = subscription;

  return (
    <li className="navigation-link__wrapper navigation__subscription">
      <Button
        navigate={uri}
        className="navigation-link navigation-link--with-thumbnail"
        activeClass="navigation-link--active"
      >
        <ChannelThumbnail xsmall uri={uri} hideStakedIndicator />
        <div className="navigation__subscription-title">
          <ClaimPreviewTitle uri={uri} />
          <span dir="auto" className="channel-name">
            {channelName}
            <MembershipBadge uri={uri} />
          </span>
        </div>
      </Button>
    </li>
  );
}

export default SideNavigation;
