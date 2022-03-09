// @flow
import React, { useEffect } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';

import * as PAGES from 'constants/pages';
import { PAGE_TITLE } from 'constants/pageTitles';
import { useIsLargeScreen } from 'effects/use-screensize';
import { lazyImport } from 'util/lazyImport';
import { LINKED_COMMENT_QUERY_PARAM } from 'constants/comment';
import { parseURI, isURIValid } from 'util/lbryURI';
import { SITE_TITLE, WELCOME_VERSION } from 'config';
import LoadingBarOneOff from 'component/loadingBarOneOff';
import { GetLinksData } from 'util/buildHomepage';
import * as CS from 'constants/claim_search';

import HomePage from 'page/home';

// @if TARGET='app'
const BackupPage = lazyImport(() => import('page/backup' /* webpackChunkName: "backup" */));
// @endif

// @if TARGET='web'
const Code2257Page = lazyImport(() => import('web/page/code2257' /* webpackChunkName: "code2257" */));
const PrivacyPolicyPage = lazyImport(() => import('web/page/privacypolicy' /* webpackChunkName: "privacypolicy" */));
const TOSPage = lazyImport(() => import('web/page/tos' /* webpackChunkName: "tos" */));
const YouTubeTOSPage = lazyImport(() => import('web/page/youtubetos' /* webpackChunkName: "youtubetos" */));
// @endif

const SignInPage = lazyImport(() => import('page/signIn' /* webpackChunkName: "signIn" */));
const SignInWalletPasswordPage = lazyImport(() =>
  import('page/signInWalletPassword' /* webpackChunkName: "signInWalletPassword" */)
);
const SignUpPage = lazyImport(() => import('page/signUp' /* webpackChunkName: "signUp" */));
const SignInVerifyPage = lazyImport(() => import('page/signInVerify' /* webpackChunkName: "signInVerify" */));

const BuyPage = lazyImport(() => import('page/buy' /* webpackChunkName: "buy" */));
const ReceivePage = lazyImport(() => import('page/receive' /* webpackChunkName: "receive" */));
const SendPage = lazyImport(() => import('page/send' /* webpackChunkName: "send" */));
const SwapPage = lazyImport(() => import('page/swap' /* webpackChunkName: "swap" */));
const WalletPage = lazyImport(() => import('page/wallet' /* webpackChunkName: "wallet" */));

const NotificationsPage = lazyImport(() => import('page/notifications' /* webpackChunkName: "notifications" */));
const CollectionPage = lazyImport(() => import('page/collection' /* webpackChunkName: "collection" */));
const ChannelNew = lazyImport(() => import('page/channelNew' /* webpackChunkName: "channelNew" */));
const ChannelsFollowingDiscoverPage = lazyImport(() =>
  import('page/channelsFollowingDiscover' /* webpackChunkName: "channelsFollowingDiscover" */)
);
const ChannelsFollowingPage = lazyImport(() =>
  import('page/channelsFollowing' /* webpackChunkName: "channelsFollowing" */)
);
const ChannelsFollowingManage = lazyImport(() =>
  import('page/channelsFollowingManage' /* webpackChunkName: "channelsFollowing" */)
);
const ChannelsPage = lazyImport(() => import('page/channels' /* webpackChunkName: "channels" */));
const CheckoutPage = lazyImport(() => import('page/checkoutPage' /* webpackChunkName: "checkoutPage" */));
const CreatorDashboard = lazyImport(() => import('page/creatorDashboard' /* webpackChunkName: "creatorDashboard" */));
const DiscoverPage = lazyImport(() => import('page/discover' /* webpackChunkName: "discover" */));
const EmbedWrapperPage = lazyImport(() => import('page/embedWrapper' /* webpackChunkName: "embedWrapper" */));
const PopoutChatPage = lazyImport(() => import('page/popoutChatWrapper' /* webpackChunkName: "popoutChat" */));
const FileListPublished = lazyImport(() =>
  import('page/fileListPublished' /* webpackChunkName: "fileListPublished" */)
);
const FourOhFourPage = lazyImport(() => import('page/fourOhFour' /* webpackChunkName: "fourOhFour" */));
const HelpPage = lazyImport(() => import('page/help' /* webpackChunkName: "help" */));
const InvitePage = lazyImport(() => import('page/invite' /* webpackChunkName: "invite" */));
const InvitedPage = lazyImport(() => import('page/invited' /* webpackChunkName: "invited" */));
const LibraryPage = lazyImport(() => import('page/library' /* webpackChunkName: "library" */));
const ListBlockedPage = lazyImport(() => import('page/listBlocked' /* webpackChunkName: "listBlocked" */));
const ListsPage = lazyImport(() => import('page/lists' /* webpackChunkName: "lists" */));
const PlaylistsPage = lazyImport(() => import('page/playlists' /* webpackChunkName: "lists" */));
const LiveStreamSetupPage = lazyImport(() => import('page/livestreamSetup' /* webpackChunkName: "livestreamSetup" */));
const LivestreamCurrentPage = lazyImport(() =>
  import('page/livestreamCurrent' /* webpackChunkName: "livestreamCurrent" */)
);
const OdyseeMembershipPage = lazyImport(() =>
  import('page/odyseeMembership' /* webpackChunkName: "odyseeMembership" */)
);
const OwnComments = lazyImport(() => import('page/ownComments' /* webpackChunkName: "ownComments" */));
const PasswordResetPage = lazyImport(() => import('page/passwordReset' /* webpackChunkName: "passwordReset" */));
const PasswordSetPage = lazyImport(() => import('page/passwordSet' /* webpackChunkName: "passwordSet" */));
const PublishPage = lazyImport(() => import('page/publish' /* webpackChunkName: "publish" */));
const ReportContentPage = lazyImport(() => import('page/reportContent' /* webpackChunkName: "reportContent" */));
const ReportPage = lazyImport(() => import('page/report' /* webpackChunkName: "report" */));
const RepostNew = lazyImport(() => import('page/repost' /* webpackChunkName: "repost" */));
const RewardsPage = lazyImport(() => import('page/rewards' /* webpackChunkName: "rewards" */));
const RewardsVerifyPage = lazyImport(() => import('page/rewardsVerify' /* webpackChunkName: "rewardsVerify" */));
const SearchPage = lazyImport(() => import('page/search' /* webpackChunkName: "search" */));
const SettingsStripeCard = lazyImport(() =>
  import('page/settingsStripeCard' /* webpackChunkName: "settingsStripeCard" */)
);
const SettingsStripeAccount = lazyImport(() =>
  import('page/settingsStripeAccount' /* webpackChunkName: "settingsStripeAccount" */)
);
const SettingsCreatorPage = lazyImport(() => import('page/settingsCreator' /* webpackChunkName: "settingsCreator" */));
const SettingsNotificationsPage = lazyImport(() =>
  import('page/settingsNotifications' /* webpackChunkName: "settingsNotifications" */)
);
const SettingsPage = lazyImport(() => import('page/settings' /* webpackChunkName: "settings" */));
const ShowPage = lazyImport(() => import('page/show' /* webpackChunkName: "show" */));
const TagsFollowingManagePage = lazyImport(() =>
  import('page/tagsFollowingManage' /* webpackChunkName: "tagsFollowingManage" */)
);
const TagsFollowingPage = lazyImport(() => import('page/tagsFollowing' /* webpackChunkName: "tagsFollowing" */));
const TopPage = lazyImport(() => import('page/top' /* webpackChunkName: "top" */));
const UpdatePasswordPage = lazyImport(() => import('page/passwordUpdate' /* webpackChunkName: "passwordUpdate" */));
const Welcome = lazyImport(() => import('page/welcome' /* webpackChunkName: "welcome" */));
const YoutubeSyncPage = lazyImport(() => import('page/youtubeSync' /* webpackChunkName: "youtubeSync" */));

// Tell the browser we are handling scroll restoration
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

type Props = {
  currentScroll: number,
  isAuthenticated: boolean,
  location: { pathname: string, search: string, hash: string },
  history: {
    action: string,
    entries: { title: string }[],
    goBack: () => void,
    goForward: () => void,
    index: number,
    length: number,
    location: { pathname: string },
    push: (string) => void,
    state: {},
    replaceState: ({}, string, string) => void,
    listen: (any) => () => void,
  },
  uri: string,
  title: string,
  welcomeVersion: number,
  hasNavigated: boolean,
  setHasNavigated: () => void,
  setReferrer: (?string) => void,
  hasUnclaimedRefereeReward: boolean,
  homepageData: any,
  wildWestDisabled: boolean,
};

type PrivateRouteProps = Props & {
  component: any,
  isAuthenticated: boolean,
};

function PrivateRoute(props: PrivateRouteProps) {
  const { component: Component, isAuthenticated, ...rest } = props;
  const urlSearchParams = new URLSearchParams(props.location.search);
  const redirectUrl = urlSearchParams.get('redirect');
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated || !IS_WEB ? (
          <Component {...props} />
        ) : (
          <Redirect to={`/$/${PAGES.AUTH}?redirect=${redirectUrl || props.location.pathname}`} />
        )
      }
    />
  );
}

function AppRouter(props: Props) {
  const {
    currentScroll,
    location: { pathname, search, hash },
    isAuthenticated,
    history,
    uri,
    title,
    welcomeVersion,
    hasNavigated,
    setHasNavigated,
    hasUnclaimedRefereeReward,
    setReferrer,
    homepageData,
    wildWestDisabled,
  } = props;

  const { entries, listen, action: historyAction } = history;
  const entryIndex = history.index;
  const urlParams = new URLSearchParams(search);
  const resetScroll = urlParams.get('reset_scroll');
  const hasLinkedCommentInUrl = urlParams.get(LINKED_COMMENT_QUERY_PARAM);
  const tagParams = urlParams.get(CS.TAGS_KEY);
  const isLargeScreen = useIsLargeScreen();

  const homeCategoryPages = React.useMemo(() => {
    const dynamicRoutes = GetLinksData(homepageData, isLargeScreen).filter(
      (potentialRoute: any) => potentialRoute && potentialRoute.route
    );

    return dynamicRoutes.map((dynamicRouteProps: RowDataItem) => (
      <Route
        key={dynamicRouteProps.route}
        path={dynamicRouteProps.route}
        component={(routerProps) => <DiscoverPage {...routerProps} dynamicRouteProps={dynamicRouteProps} />}
      />
    ));
  }, [homepageData, isLargeScreen]);

  // For people arriving at settings page from deeplinks, know whether they can "go back"
  useEffect(() => {
    const unlisten = listen((location, action) => {
      if (action === 'PUSH') {
        if (!hasNavigated && setHasNavigated) setHasNavigated();
      }
    });
    return unlisten;
  }, [listen, hasNavigated, setHasNavigated]);

  useEffect(() => {
    if (!hasNavigated && hasUnclaimedRefereeReward && !isAuthenticated) {
      const valid = isURIValid(uri);
      if (valid) {
        const { path } = parseURI(uri);
        if (path !== 'undefined') setReferrer(path);
      }
    }
  }, [hasNavigated, uri, hasUnclaimedRefereeReward, setReferrer, isAuthenticated]);

  useEffect(() => {
    const getDefaultTitle = (pathname: string) => {
      const title = pathname.startsWith('/$/') ? PAGE_TITLE[pathname.substring(3)] : '';
      return __(title) || (IS_WEB ? SITE_TITLE : 'Odysee');
    };

    if (uri) {
      const { channelName, streamName } = parseURI(uri);

      if (title) {
        document.title = title;
      } else if (streamName) {
        document.title = streamName;
      } else if (channelName) {
        document.title = channelName;
      } else {
        document.title = getDefaultTitle(pathname);
      }
    } else {
      document.title = getDefaultTitle(pathname);
    }

    // @if TARGET='app'
    entries[entryIndex].title = document.title;
    // @endif
  }, [pathname, entries, entryIndex, title, uri]);

  useEffect(() => {
    if (!hasLinkedCommentInUrl) {
      if (hash && historyAction === 'PUSH') {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          window.scrollTo(0, element.offsetTop);
        }
      } else {
        window.scrollTo(0, currentScroll);
      }
    }
  }, [currentScroll, pathname, search, hash, resetScroll, hasLinkedCommentInUrl, historyAction]);

  // react-router doesn't decode pathanmes before doing the route matching check
  // We have to redirect here because if we redirect on the server, it might get encoded again
  // in the browser causing a redirect loop
  const decodedUrl = decodeURIComponent(pathname) + search;
  if (decodedUrl !== pathname + search) {
    return <Redirect to={decodedUrl} />;
  }

  return (
    <React.Suspense fallback={<LoadingBarOneOff />}>
      <Switch>
        {/* @if TARGET='app' */}
        {welcomeVersion < WELCOME_VERSION && <Route path="/*" component={Welcome} />}
        {/* @endif */}
        <Redirect
          from={`/$/${PAGES.DEPRECATED__CHANNELS_FOLLOWING_MANAGE}`}
          to={`/$/${PAGES.CHANNELS_FOLLOWING_DISCOVER}`}
        />
        <Redirect from={`/$/${PAGES.DEPRECATED__CHANNELS_FOLLOWING}`} to={`/$/${PAGES.CHANNELS_FOLLOWING}`} />
        <Redirect from={`/$/${PAGES.DEPRECATED__TAGS_FOLLOWING}`} to={`/$/${PAGES.TAGS_FOLLOWING}`} />
        <Redirect from={`/$/${PAGES.DEPRECATED__TAGS_FOLLOWING_MANAGE}`} to={`/$/${PAGES.TAGS_FOLLOWING_MANAGE}`} />
        <Redirect from={`/$/${PAGES.DEPRECATED__PUBLISH}`} to={`/$/${PAGES.UPLOAD}`} />
        <Redirect from={`/$/${PAGES.DEPRECATED__PUBLISHED}`} to={`/$/${PAGES.UPLOADS}`} />

        <Route path={`/`} exact component={HomePage} />

        {(!wildWestDisabled || tagParams) && <Route path={`/$/${PAGES.DISCOVER}`} exact component={DiscoverPage} />}
        {!wildWestDisabled && <Route path={`/$/${PAGES.WILD_WEST}`} exact component={DiscoverPage} />}
        {homeCategoryPages}

        <Route path={`/$/${PAGES.AUTH_SIGNIN}`} exact component={SignInPage} />
        <Route path={`/$/${PAGES.AUTH_PASSWORD_RESET}`} exact component={PasswordResetPage} />
        <Route path={`/$/${PAGES.AUTH_PASSWORD_SET}`} exact component={PasswordSetPage} />
        <Route path={`/$/${PAGES.AUTH}`} exact component={SignUpPage} />
        <Route path={`/$/${PAGES.AUTH}/*`} exact component={SignUpPage} />
        <Route path={`/$/${PAGES.WELCOME}`} exact component={Welcome} />

        <Route path={`/$/${PAGES.HELP}`} exact component={HelpPage} />
        {/* @if TARGET='app' */}
        <Route path={`/$/${PAGES.BACKUP}`} exact component={BackupPage} />
        {/* @endif */}
        {/* @if TARGET='web' */}
        <Route path={`/$/${PAGES.CODE_2257}`} exact component={Code2257Page} />
        <Route path={`/$/${PAGES.PRIVACY_POLICY}`} exact component={PrivacyPolicyPage} />
        <Route path={`/$/${PAGES.TOS}`} exact component={TOSPage} />
        <Route path={`/$/${PAGES.YOUTUBE_TOS}`} exact component={YouTubeTOSPage} />
        {/* @endif */}
        <Route path={`/$/${PAGES.AUTH_VERIFY}`} exact component={SignInVerifyPage} />
        <Route path={`/$/${PAGES.SEARCH}`} exact component={SearchPage} />
        <Route path={`/$/${PAGES.TOP}`} exact component={TopPage} />
        <Route path={`/$/${PAGES.SETTINGS}`} exact component={SettingsPage} />
        <Route path={`/$/${PAGES.INVITE}/:referrer`} exact component={InvitedPage} />
        <Route path={`/$/${PAGES.CHECKOUT}`} exact component={CheckoutPage} />
        <Route path={`/$/${PAGES.REPORT_CONTENT}`} exact component={ReportContentPage} />
        <Route {...props} path={`/$/${PAGES.LIST}/:collectionId`} component={CollectionPage} />

        <PrivateRoute {...props} exact path={`/$/${PAGES.YOUTUBE_SYNC}`} component={YoutubeSyncPage} />
        <PrivateRoute {...props} exact path={`/$/${PAGES.TAGS_FOLLOWING}`} component={TagsFollowingPage} />
        <PrivateRoute
          {...props}
          exact
          path={`/$/${PAGES.CHANNELS_FOLLOWING}`}
          component={isAuthenticated || !IS_WEB ? ChannelsFollowingPage : DiscoverPage}
        />
        <PrivateRoute {...props} path={`/$/${PAGES.SETTINGS_NOTIFICATIONS}`} component={SettingsNotificationsPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.SETTINGS_STRIPE_CARD}`} component={SettingsStripeCard} />
        <PrivateRoute {...props} path={`/$/${PAGES.SETTINGS_STRIPE_ACCOUNT}`} component={SettingsStripeAccount} />
        <PrivateRoute {...props} path={`/$/${PAGES.SETTINGS_UPDATE_PWD}`} component={UpdatePasswordPage} />
        <PrivateRoute
          {...props}
          exact
          path={`/$/${PAGES.CHANNELS_FOLLOWING_DISCOVER}`}
          component={ChannelsFollowingDiscoverPage}
        />
        <PrivateRoute
          {...props}
          exact
          path={`/$/${PAGES.CHANNELS_FOLLOWING_MANAGE}`}
          component={ChannelsFollowingManage}
        />
        <PrivateRoute {...props} path={`/$/${PAGES.INVITE}`} component={InvitePage} />
        <PrivateRoute {...props} path={`/$/${PAGES.CHANNEL_NEW}`} component={ChannelNew} />
        <PrivateRoute {...props} path={`/$/${PAGES.REPOST_NEW}`} component={RepostNew} />
        <PrivateRoute {...props} path={`/$/${PAGES.UPLOADS}`} component={FileListPublished} />
        <PrivateRoute {...props} path={`/$/${PAGES.CREATOR_DASHBOARD}`} component={CreatorDashboard} />
        <PrivateRoute {...props} path={`/$/${PAGES.UPLOAD}`} component={PublishPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.REPORT}`} component={ReportPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.REWARDS}`} exact component={RewardsPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.REWARDS_VERIFY}`} component={RewardsVerifyPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.LIBRARY}`} component={LibraryPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.LISTS}`} component={ListsPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.PLAYLISTS}`} component={PlaylistsPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.TAGS_FOLLOWING_MANAGE}`} component={TagsFollowingManagePage} />
        <PrivateRoute {...props} path={`/$/${PAGES.SETTINGS_BLOCKED_MUTED}`} component={ListBlockedPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.SETTINGS_CREATOR}`} component={SettingsCreatorPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.WALLET}`} exact component={WalletPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.CHANNELS}`} component={ChannelsPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.LIVESTREAM}`} component={LiveStreamSetupPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.LIVESTREAM_CURRENT}`} component={LivestreamCurrentPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.BUY}`} component={BuyPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.RECEIVE}`} component={ReceivePage} />
        <PrivateRoute {...props} path={`/$/${PAGES.SEND}`} component={SendPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.SWAP}`} component={SwapPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.NOTIFICATIONS}`} component={NotificationsPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.AUTH_WALLET_PASSWORD}`} component={SignInWalletPasswordPage} />
        <PrivateRoute {...props} path={`/$/${PAGES.SETTINGS_OWN_COMMENTS}`} component={OwnComments} />
        <PrivateRoute {...props} path={`/$/${PAGES.ODYSEE_MEMBERSHIP}`} component={OdyseeMembershipPage} />

        <Route path={`/$/${PAGES.POPOUT}/:channelName/:streamName`} component={PopoutChatPage} />

        <Route path={`/$/${PAGES.EMBED}/:claimName`} exact component={EmbedWrapperPage} />
        <Route path={`/$/${PAGES.EMBED}/:claimName/:claimId`} exact component={EmbedWrapperPage} />

        {/* Below need to go at the end to make sure we don't match any of our pages first */}
        <Route path="/:claimName" exact component={ShowPage} />
        <Route path="/:claimName/:streamName" exact component={ShowPage} />
        <Route path="/*" component={FourOhFourPage} />
      </Switch>
    </React.Suspense>
  );
}

export default withRouter(AppRouter);
