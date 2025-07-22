// @flow
import React, { useEffect } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';

import * as PAGES from 'constants/pages';
import { PAGE_TITLE } from 'constants/pageTitles';
import { LINKED_COMMENT_QUERY_PARAM } from 'constants/comment';
import { parseURI, isURIValid } from 'util/lbryURI';
import { WELCOME_VERSION } from 'config';
import { GetLinksData } from 'util/buildHomepage';
import { useIsLargeScreen } from 'effects/use-screensize';

import HomePage from 'page/home';
import BackupPage from 'page/backup';

// Chunk: "secondary"
import SignInPage from 'page/signIn';
import SignInWalletPasswordPage from 'page/signInWalletPassword';

import SignUpPage from 'page/signUp';
import SignInVerifyPage from 'page/signInVerify';

// Chunk: "wallet/secondary"
import BuyPage from 'page/buy';
import ReceivePage from 'page/receive';
import SendPage from 'page/send';
import WalletPage from 'page/wallet';

// Chunk: none
import NotificationsPage from 'page/notifications';
import CollectionPage from 'page/collection';
import ChannelNew from 'page/channelNew';
import ChannelsFollowingDiscoverPage from 'page/channelsFollowingDiscover';

import ChannelsFollowingPage from 'page/channelsFollowing';
import ChannelsPage from 'page/channels';
import CreatorDashboard from 'page/creatorDashboard';
import DiscoverPage from 'page/discover';
import FileListPublished from 'page/fileListPublished';
import HelpPage from 'page/help';
import LibraryPage from 'page/library';
import ListBlockedPage from 'page/listBlocked';
import ListsPage from 'page/lists';
import PlaylistsPage from 'page/playlists';
import OwnComments from 'page/ownComments';
import PasswordResetPage from 'page/passwordReset';
import PasswordSetPage from 'page/passwordSet';
import PublishPage from 'page/publish';
import ReportContentPage from 'page/reportContent';
import ReportPage from 'page/report';
import RepostNew from 'page/repost';
import SearchPage from 'page/search';

import SettingsCreatorPage from 'page/settingsCreator';
import SettingsNotificationsPage from 'page/settingsNotifications';

import SettingsPage from 'page/settings';
import ShowPage from 'page/show';
import TagsFollowingManagePage from 'page/tagsFollowingManage';

import TagsFollowingPage from 'page/tagsFollowing';
import TopPage from 'page/top';
import UpdatePasswordPage from 'page/passwordUpdate';
import Welcome from 'page/welcome';
import TestComponents from 'component/testComponents';

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
};

type PrivateRouteProps = Props & {
  component: any,
  isAuthenticated: boolean,
};

function PrivateRoute(props: PrivateRouteProps) {
  const { component: Component, isAuthenticated, ...rest } = props;
  return <Route {...rest} render={(props) => <Component {...props} />} />;
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
  const isLargeScreen = useIsLargeScreen();
  const dynamicRoutes = GetLinksData(homepageData, isLargeScreen).filter(
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
    const getDefaultTitle = (pathname: string) => {
      const title = pathname.startsWith('/$/') ? PAGE_TITLE[pathname.substring(3)] : '';
      if (process.env.NODE_ENV !== 'production') {
        return uri || pathname || title;
      }
      return __(title) || 'LBRY';
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
    <Switch>
      {welcomeVersion < WELCOME_VERSION && <Route path="/*" component={Welcome} />}
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
      {/* $FlowFixMe */}
      {dynamicRoutes.map((dynamicRouteProps: RowDataItem) => (
        <Route
          key={dynamicRouteProps.route}
          path={dynamicRouteProps.route}
          component={(routerProps) => <DiscoverPage {...routerProps} dynamicRouteProps={dynamicRouteProps} />}
        />
      ))}

      {/* Odysee signin */}
      <Route path={`/$/${PAGES.AUTH_SIGNIN}`} exact component={SignInPage} />
      <Route path={`/$/${PAGES.AUTH_PASSWORD_RESET}`} exact component={PasswordResetPage} />
      <Route path={`/$/${PAGES.AUTH_PASSWORD_SET}`} exact component={PasswordSetPage} />
      <Route path={`/$/${PAGES.AUTH}`} exact component={SignUpPage} />
      <Route path={`/$/${PAGES.AUTH}/*`} exact component={SignUpPage} />
      <Route path={`/$/${PAGES.AUTH_VERIFY}`} exact component={SignInVerifyPage} />

      <Route path={`/$/${PAGES.WELCOME}`} exact component={Welcome} />

      <Route path={`/$/${PAGES.HELP}`} exact component={HelpPage} />
      {/* @if TARGET='app' */}
      <Route path={`/$/${PAGES.BACKUP}`} exact component={BackupPage} />
      {/* @endif */}
      <Route path="/test-ui" exact component={TestComponents} />
      <Route path={`/$/${PAGES.SEARCH}`} exact component={SearchPage} />
      <Route path={`/$/${PAGES.TOP}`} exact component={TopPage} />
      <Route path={`/$/${PAGES.SETTINGS}`} exact component={SettingsPage} />
      <Route path={`/$/${PAGES.REPORT_CONTENT}`} exact component={ReportContentPage} />
      <Route {...props} path={`/$/${PAGES.LIST}/:collectionId`} component={CollectionPage} />

      <PrivateRoute {...props} exact path={`/$/${PAGES.TAGS_FOLLOWING}`} component={TagsFollowingPage} />
      <PrivateRoute {...props} exact path={`/$/${PAGES.CHANNELS_FOLLOWING}`} component={ChannelsFollowingPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.SETTINGS_NOTIFICATIONS}`} component={SettingsNotificationsPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.SETTINGS_UPDATE_PWD}`} component={UpdatePasswordPage} />
      <PrivateRoute
        {...props}
        exact
        path={`/$/${PAGES.CHANNELS_FOLLOWING_DISCOVER}`}
        component={ChannelsFollowingDiscoverPage}
      />
      <PrivateRoute {...props} path={`/$/${PAGES.CHANNEL_NEW}`} component={ChannelNew} />
      <PrivateRoute {...props} path={`/$/${PAGES.REPOST_NEW}`} component={RepostNew} />
      <PrivateRoute {...props} path={`/$/${PAGES.UPLOADS}`} component={FileListPublished} />
      <PrivateRoute {...props} path={`/$/${PAGES.CREATOR_DASHBOARD}`} component={CreatorDashboard} />
      <PrivateRoute {...props} path={`/$/${PAGES.UPLOAD}`} component={PublishPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.REPORT}`} component={ReportPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.LIBRARY}`} component={LibraryPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.LISTS}`} component={ListsPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.PLAYLISTS}`} component={PlaylistsPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.TAGS_FOLLOWING_MANAGE}`} component={TagsFollowingManagePage} />
      <PrivateRoute {...props} path={`/$/${PAGES.SETTINGS_BLOCKED_MUTED}`} component={ListBlockedPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.SETTINGS_CREATOR}`} component={SettingsCreatorPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.WALLET}`} exact component={WalletPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.CHANNELS}`} component={ChannelsPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.BUY}`} component={BuyPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.RECEIVE}`} component={ReceivePage} />
      <PrivateRoute {...props} path={`/$/${PAGES.SEND}`} component={SendPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.NOTIFICATIONS}`} component={NotificationsPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.AUTH_WALLET_PASSWORD}`} component={SignInWalletPasswordPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.SETTINGS_OWN_COMMENTS}`} component={OwnComments} />

      {/* Below need to go at the end to make sure we don't match any of our pages first */}
      <Route path="/:claimName" exact component={ShowPage} />
      <Route path="/:claimName/:streamName" exact component={ShowPage} />
    </Switch>
  );
}

export default withRouter(AppRouter);
