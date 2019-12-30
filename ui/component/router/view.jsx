// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import SettingsPage from 'page/settings';
import HelpPage from 'page/help';
import ReportPage from 'page/report';
import ShowPage from 'page/show';
import PublishPage from 'page/publish';
import DiscoverPage from 'page/discover';
import HomePage from 'page/home';
import InvitedPage from 'page/invited';
import RewardsPage from 'page/rewards';
import FileListDownloaded from 'page/fileListDownloaded';
import FileListPublished from 'page/fileListPublished';
import TransactionHistoryPage from 'page/transactionHistory';
import InvitePage from 'page/invite';
import SearchPage from 'page/search';
import LibraryPage from 'page/library';
import WalletPage from 'page/wallet';
import TagsPage from 'page/tags';
import TagsFollowingPage from 'page/tagsFollowing';
import ChannelsFollowingPage from 'page/channelsFollowing';
import ChannelsFollowingManagePage from 'page/channelsFollowingManage';
import TagsFollowingManagePage from 'page/tagsFollowingManage';
import ListBlockedPage from 'page/listBlocked';
import FourOhFourPage from 'page/fourOhFour';
import SignInPage from 'page/signIn';
import SignInVerifyPage from 'page/signInVerify';
import ChannelsPage from 'page/channels';
import EmbedWrapperPage from 'page/embedWrapper';

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
  location: { pathname: string, search: string },
  isAuthenticated: boolean,
};

function AppRouter(props: Props) {
  const {
    currentScroll,
    location: { pathname },
    isAuthenticated,
  } = props;

  useEffect(() => {
    window.scrollTo(0, currentScroll);
  }, [currentScroll, pathname]);

  return (
    <Switch>
      <Route path={`/`} exact component={HomePage} />
      <Route path={`/$/${PAGES.DISCOVER}`} exact component={DiscoverPage} />
      <Route path={`/$/${PAGES.AUTH}`} exact component={SignInPage} />
      <Route path={`/$/${PAGES.TAGS}`} exact component={TagsPage} />
      <Route path={`/$/${PAGES.TAGS_FOLLOWING}`} exact component={TagsFollowingPage} />
      <Route
        path={`/$/${PAGES.CHANNELS_FOLLOWING}`}
        exact
        component={isAuthenticated || !IS_WEB ? ChannelsFollowingPage : DiscoverPage}
      />
      <Route path={`/$/${PAGES.CHANNELS_FOLLOWING_MANAGE}`} exact component={ChannelsFollowingManagePage} />
      <Route path={`/$/${PAGES.HELP}`} exact component={HelpPage} />
      <Route path={`/$/${PAGES.AUTH_VERIFY}`} exact component={SignInVerifyPage} />
      <Route path={`/$/${PAGES.SEARCH}`} exact component={SearchPage} />
      <Route path={`/$/${PAGES.SETTINGS}`} exact component={SettingsPage} />
      <Route path={`/$/${PAGES.INVITE}/:referrer`} exact component={InvitedPage} />

      <PrivateRoute {...props} path={`/$/${PAGES.INVITE}`} component={InvitePage} />
      <PrivateRoute {...props} path={`/$/${PAGES.DOWNLOADED}`} component={FileListDownloaded} />
      <PrivateRoute {...props} path={`/$/${PAGES.PUBLISHED}`} component={FileListPublished} />
      <PrivateRoute {...props} path={`/$/${PAGES.PUBLISH}`} component={PublishPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.REPORT}`} component={ReportPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.REWARDS}`} component={RewardsPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.TRANSACTIONS}`} component={TransactionHistoryPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.LIBRARY}`} component={LibraryPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.TAGS_FOLLOWING_MANAGE}`} component={TagsFollowingManagePage} />
      <PrivateRoute {...props} path={`/$/${PAGES.BLOCKED}`} component={ListBlockedPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.WALLET}`} exact component={WalletPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.CHANNELS}`} component={ChannelsPage} />

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
