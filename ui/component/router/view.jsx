// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import SettingsPage from 'page/settings';
import SettingsNotificationsPage from 'page/settingsNotifications';
import HelpPage from 'page/help';
//  @if TARGET='app'
import BackupPage from 'page/backup';
// @endif
//  @if TARGET='web'
import Code2257Page from 'web/page/code2257';
// @endif
import ReportPage from 'page/report';
import ShowPage from 'page/show';
import PublishPage from 'page/publish';
import DiscoverPage from 'page/discover';
import HomePage from 'page/home';
import InvitedPage from 'page/invited';
import RewardsPage from 'page/rewards';
import FileListPublished from 'page/fileListPublished';
import InvitePage from 'page/invite';
import SearchPage from 'page/search';
import LibraryPage from 'page/library';
import WalletPage from 'page/wallet';
import TagsFollowingPage from 'page/tagsFollowing';
import ChannelsFollowingPage from 'page/channelsFollowing';
import ChannelsFollowingDiscoverPage from 'page/channelsFollowingDiscover';
import TagsFollowingManagePage from 'page/tagsFollowingManage';
import ListBlockedPage from 'page/listBlocked';
import FourOhFourPage from 'page/fourOhFour';
import SignInPage from 'page/signIn';
import SignUpPage from 'page/signUp';
import PasswordResetPage from 'page/passwordReset';
import PasswordSetPage from 'page/passwordSet';
import SignInVerifyPage from 'page/signInVerify';
import ChannelsPage from 'page/channels';
import EmbedWrapperPage from 'page/embedWrapper';
import TopPage from 'page/top';
import Welcome from 'page/welcome';
import CreatorDashboard from 'page/creatorDashboard';
import RewardsVerifyPage from 'page/rewardsVerify';
import CheckoutPage from 'page/checkoutPage';
import ChannelNew from 'page/channelNew';
import BuyPage from 'page/buy';

import { parseURI } from 'lbry-redux';
import { SITE_TITLE, WELCOME_VERSION } from 'config';

// Tell the browser we are handling scroll restoration
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

type PrivateRouteProps = {
  component: any,
  isAuthenticated: boolean,
  location: { pathname: string },
};

function PrivateRoute(props: PrivateRouteProps) {
  const { component: Component, isAuthenticated, ...rest } = props;
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated || !IS_WEB ? (
          <Component {...props} />
        ) : (
          <Redirect to={`/$/${PAGES.AUTH}?redirect=${props.location.pathname}`} />
        )
      }
    />
  );
}

type Props = {
  currentScroll: number,
  isAuthenticated: boolean,
  location: { pathname: string, search: string },
  history: {
    entries: { title: string }[],
    goBack: () => void,
    goForward: () => void,
    index: number,
    length: number,
    location: { pathname: string },
    push: string => void,
    state: {},
    replaceState: ({}, string, string) => void,
  },
  uri: string,
  title: string,
  welcomeVersion: number,
};

function AppRouter(props: Props) {
  const {
    currentScroll,
    location: { pathname, search },
    isAuthenticated,
    history,
    uri,
    title,
    welcomeVersion,
  } = props;
  const { entries } = history;
  const entryIndex = history.index;
  const urlParams = new URLSearchParams(search);
  const resetScroll = urlParams.get('reset_scroll');

  useEffect(() => {
    if (uri) {
      const { channelName, streamName } = parseURI(uri);

      if (typeof title !== 'undefined' && title !== '') {
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
    window.scrollTo(0, currentScroll);
  }, [currentScroll, pathname, resetScroll]);

  // react-router doesn't decode pathanmes before doing the route matching check
  // We have to redirect here because if we redirect on the server, it might get encoded again
  // in the browser causing a redirect loop
  const decodedUrl = decodeURIComponent(pathname) + search;
  if (decodedUrl !== pathname + search) {
    return <Redirect to={decodedUrl} />;
  }

  return (
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

      <Route path={`/`} exact component={HomePage} />
      <Route path={`/$/${PAGES.DISCOVER}`} exact component={DiscoverPage} />
      <Route path={`/$/${PAGES.AUTH_SIGNIN}`} exact component={SignInPage} />
      <Route path={`/$/${PAGES.AUTH_PASSWORD_RESET}`} exact component={PasswordResetPage} />
      <Route path={`/$/${PAGES.AUTH_PASSWORD_SET}`} exact component={PasswordSetPage} />
      <Route path={`/$/${PAGES.AUTH}`} exact component={SignUpPage} />
      <Route path={`/$/${PAGES.AUTH}/*`} exact component={SignUpPage} />
      <Route path={`/$/${PAGES.WELCOME}`} exact component={Welcome} />
      <Route path={`/$/${PAGES.TAGS_FOLLOWING}`} exact component={TagsFollowingPage} />
      <Route
        path={`/$/${PAGES.CHANNELS_FOLLOWING}`}
        exact
        component={isAuthenticated || !IS_WEB ? ChannelsFollowingPage : DiscoverPage}
      />
      <Route path={`/$/${PAGES.CHANNELS_FOLLOWING_DISCOVER}`} exact component={ChannelsFollowingDiscoverPage} />
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
      <Route path={`/$/${PAGES.SETTINGS_NOTIFICATIONS}`} exact component={SettingsNotificationsPage} />
      <Route path={`/$/${PAGES.INVITE}/:referrer`} exact component={InvitedPage} />
      <Route path={`/$/${PAGES.CHECKOUT}`} exact component={CheckoutPage} />

      <PrivateRoute {...props} path={`/$/${PAGES.INVITE}`} component={InvitePage} />
      <PrivateRoute {...props} path={`/$/${PAGES.CHANNEL_NEW}`} component={ChannelNew} />
      <PrivateRoute {...props} path={`/$/${PAGES.PUBLISHED}`} component={FileListPublished} />
      <PrivateRoute {...props} path={`/$/${PAGES.CREATOR_DASHBOARD}`} component={CreatorDashboard} />
      <PrivateRoute {...props} path={`/$/${PAGES.PUBLISH}`} component={PublishPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.REPORT}`} component={ReportPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.REWARDS}`} exact component={RewardsPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.REWARDS_VERIFY}`} component={RewardsVerifyPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.LIBRARY}`} component={LibraryPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.TAGS_FOLLOWING_MANAGE}`} component={TagsFollowingManagePage} />
      <PrivateRoute {...props} path={`/$/${PAGES.BLOCKED}`} component={ListBlockedPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.WALLET}`} exact component={WalletPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.CHANNELS}`} component={ChannelsPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.BUY}`} component={BuyPage} />

      <Route path={`/$/${PAGES.EMBED}/:claimName`} exact component={EmbedWrapperPage} />
      <Route path={`/$/${PAGES.EMBED}/:claimName/:claimId`} exact component={EmbedWrapperPage} />

      {/* Below need to go at the end to make sure we don't match any of our pages first */}
      <Route path="/:claimName" exact component={ShowPage} />
      <Route path="/:claimName/:streamName" exact component={ShowPage} />
      <Route path="/*" component={FourOhFourPage} />
    </Switch>
  );
}

export default withRouter(AppRouter);
