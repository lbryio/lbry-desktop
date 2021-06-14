// @flow
import React, { useEffect } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';

import * as PAGES from 'constants/pages';
import { LINKED_COMMENT_QUERY_PARAM } from 'constants/comment';
import { parseURI, isURIValid } from 'lbry-redux';
import { SITE_TITLE, WELCOME_VERSION, SIMPLE_SITE } from 'config';
import LoadingBarOneOff from 'component/loadingBarOneOff';

import HomePage from 'page/home';

// @if TARGET='app'
const BackupPage = React.lazy(() => import('page/backup' /* webpackChunkName: "backup" */));
// @endif

// @if TARGET='web'
const Code2257Page = React.lazy(() => import('web/page/code2257'));
// @endif

// Chunk: "secondary"
const SignInPage = React.lazy(() => import('page/signIn' /* webpackChunkName: "secondary" */));
const SignInWalletPasswordPage = React.lazy(() =>
  import('page/signInWalletPassword' /* webpackChunkName: "secondary" */)
);
const SignUpPage = React.lazy(() => import('page/signUp' /* webpackChunkName: "secondary" */));
const SignInVerifyPage = React.lazy(() => import('page/signInVerify' /* webpackChunkName: "secondary" */));

// Chunk: "wallet/secondary"
const BuyPage = React.lazy(() => import('page/buy' /* webpackChunkName: "secondary" */));
const ReceivePage = React.lazy(() => import('page/receive' /* webpackChunkName: "secondary" */));
const SendPage = React.lazy(() => import('page/send' /* webpackChunkName: "secondary" */));
const SwapPage = React.lazy(() => import('page/swap' /* webpackChunkName: "secondary" */));
const WalletPage = React.lazy(() => import('page/wallet' /* webpackChunkName: "secondary" */));

// Chunk: none
const NotificationsPage = React.lazy(() => import('page/notifications' /* webpackChunkName: "secondary" */));
const CollectionPage = React.lazy(() => import('page/collection' /* webpackChunkName: "secondary" */));
const ChannelNew = React.lazy(() => import('page/channelNew' /* webpackChunkName: "secondary" */));
const ChannelsFollowingDiscoverPage = React.lazy(() =>
  import('page/channelsFollowingDiscover' /* webpackChunkName: "secondary" */)
);
const ChannelsFollowingPage = React.lazy(() => import('page/channelsFollowing' /* webpackChunkName: "secondary" */));
const ChannelsPage = React.lazy(() => import('page/channels' /* webpackChunkName: "secondary" */));
const CheckoutPage = React.lazy(() => import('page/checkoutPage' /* webpackChunkName: "checkoutPage" */));
const CreatorDashboard = React.lazy(() => import('page/creatorDashboard' /* webpackChunkName: "secondary" */));
const DiscoverPage = React.lazy(() => import('page/discover' /* webpackChunkName: "secondary" */));
const EmbedWrapperPage = React.lazy(() => import('page/embedWrapper' /* webpackChunkName: "secondary" */));
const FileListPublished = React.lazy(() => import('page/fileListPublished' /* webpackChunkName: "secondary" */));
const FourOhFourPage = React.lazy(() => import('page/fourOhFour' /* webpackChunkName: "fourOhFour" */));
const HelpPage = React.lazy(() => import('page/help' /* webpackChunkName: "help" */));
const InvitePage = React.lazy(() => import('page/invite' /* webpackChunkName: "secondary" */));
const InvitedPage = React.lazy(() => import('page/invited' /* webpackChunkName: "secondary" */));
const LibraryPage = React.lazy(() => import('page/library' /* webpackChunkName: "secondary" */));
const ListBlockedPage = React.lazy(() => import('page/listBlocked' /* webpackChunkName: "secondary" */));
const ListsPage = React.lazy(() => import('page/lists' /* webpackChunkName: "secondary" */));
const LiveStreamSetupPage = React.lazy(() => import('page/livestreamSetup' /* webpackChunkName: "secondary" */));
const LivestreamCurrentPage = React.lazy(() => import('page/livestreamCurrent' /* webpackChunkName: "secondary" */));
const PasswordResetPage = React.lazy(() => import('page/passwordReset' /* webpackChunkName: "secondary" */));
const PasswordSetPage = React.lazy(() => import('page/passwordSet' /* webpackChunkName: "secondary" */));
const PublishPage = React.lazy(() => import('page/publish' /* webpackChunkName: "secondary" */));
const ReportContentPage = React.lazy(() => import('page/reportContent' /* webpackChunkName: "secondary" */));
const ReportPage = React.lazy(() => import('page/report' /* webpackChunkName: "secondary" */));
const RepostNew = React.lazy(() => import('page/repost' /* webpackChunkName: "secondary" */));
const RewardsPage = React.lazy(() => import('page/rewards' /* webpackChunkName: "secondary" */));
const RewardsVerifyPage = React.lazy(() => import('page/rewardsVerify' /* webpackChunkName: "secondary" */));
const SearchPage = React.lazy(() => import('page/search' /* webpackChunkName: "secondary" */));
const SettingsAdvancedPage = React.lazy(() => import('page/settingsAdvanced' /* webpackChunkName: "secondary" */));
const SettingsStripeCard = React.lazy(() => import('page/settingsStripeCard' /* webpackChunkName: "secondary" */));
const SettingsCreatorPage = React.lazy(() => import('page/settingsCreator' /* webpackChunkName: "secondary" */));
const SettingsNotificationsPage = React.lazy(() =>
  import('page/settingsNotifications' /* webpackChunkName: "secondary" */)
);
const SettingsPage = React.lazy(() => import('page/settings' /* webpackChunkName: "secondary" */));
const ShowPage = React.lazy(() => import('page/show' /* webpackChunkName: "secondary" */));
const TagsFollowingManagePage = React.lazy(() =>
  import('page/tagsFollowingManage' /* webpackChunkName: "secondary" */)
);
const TagsFollowingPage = React.lazy(() => import('page/tagsFollowing' /* webpackChunkName: "secondary" */));
const TopPage = React.lazy(() => import('page/top' /* webpackChunkName: "secondary" */));
const Welcome = React.lazy(() => import('page/welcome' /* webpackChunkName: "secondary" */));
const YoutubeSyncPage = React.lazy(() => import('page/youtubeSync' /* webpackChunkName: "secondary" */));

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
  setReferrer: (string) => void,
  hasUnclaimedRefereeReward: boolean,
  homepageData: any,
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
  } = props;
  const { entries, listen, action: historyAction } = history;
  const entryIndex = history.index;
  const urlParams = new URLSearchParams(search);
  const resetScroll = urlParams.get('reset_scroll');
  const hasLinkedCommentInUrl = urlParams.get(LINKED_COMMENT_QUERY_PARAM);

  const dynamicRoutes = Object.values(homepageData).filter(
    (potentialRoute: any) => potentialRoute && potentialRoute.route
  );

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
    if (uri) {
      const { channelName, streamName } = parseURI(uri);

      if (title) {
        document.title = title;
      } else if (streamName) {
        document.title = streamName;
      } else if (channelName) {
        document.title = channelName;
      } else {
        document.title = IS_WEB ? SITE_TITLE : 'LBRY';
      }
    } else {
      document.title = IS_WEB ? SITE_TITLE : 'LBRY';
    }

    // @if TARGET='app'
    entries[entryIndex].title = document.title;
    // @endif
    return () => {
      document.title = IS_WEB ? SITE_TITLE : 'LBRY';
    };
  }, [entries, entryIndex, title, uri]);

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
        <Route path={`/$/${PAGES.DISCOVER}`} exact component={DiscoverPage} />
        {SIMPLE_SITE && <Route path={`/$/${PAGES.WILD_WEST}`} exact component={DiscoverPage} />}
        {/* $FlowFixMe */}
        {dynamicRoutes.map((dynamicRouteProps: RowDataItem) => (
          <Route
            key={dynamicRouteProps.route}
            path={dynamicRouteProps.route}
            component={(routerProps) => <DiscoverPage {...routerProps} dynamicRouteProps={dynamicRouteProps} />}
          />
        ))}

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
        {/* @endif */}
        <Route path={`/$/${PAGES.AUTH_VERIFY}`} exact component={SignInVerifyPage} />
        <Route path={`/$/${PAGES.SEARCH}`} exact component={SearchPage} />
        <Route path={`/$/${PAGES.TOP}`} exact component={TopPage} />
        <Route path={`/$/${PAGES.SETTINGS}`} exact component={SettingsPage} />
        <Route path={`/$/${PAGES.SETTINGS_ADVANCED}`} exact component={SettingsAdvancedPage} />
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
        <PrivateRoute
          {...props}
          exact
          path={`/$/${PAGES.CHANNELS_FOLLOWING_DISCOVER}`}
          component={ChannelsFollowingDiscoverPage}
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
