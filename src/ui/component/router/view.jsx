// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import SettingsPage from 'page/settings';
import HelpPage from 'page/help';
import ReportPage from 'page/report';
import AccountPage from 'page/account';
import ShowPage from 'page/show';
import PublishPage from 'page/publish';
import DiscoverPage from 'page/discover';
import RewardsPage from 'page/rewards';
import FileListDownloaded from 'page/fileListDownloaded';
import FileListPublished from 'page/fileListPublished';
import TransactionHistoryPage from 'page/transactionHistory';
import InvitePage from 'page/invite';
import SearchPage from 'page/search';
import LibraryPage from 'page/library';
import WalletPage from 'page/wallet';
import TagsPage from 'page/tags';
import FollowingPage from 'page/following';
import ListBlockedPage from 'page/listBlocked';
import FourOhFourPage from 'page/fourOhFour';
import SignInPage from 'page/signIn';

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
  const { currentScroll } = props;

  useEffect(() => {
    window.scrollTo(0, currentScroll);
  }, [currentScroll]);

  return (
    <Switch>
      <Route path="/" exact component={DiscoverPage} />
      <Route path={`/$/${PAGES.DISCOVER}`} exact component={DiscoverPage} />
      <Route path={`/$/${PAGES.AUTH}`} exact component={SignInPage} />
      <Route path={`/$/${PAGES.TAGS}`} exact component={TagsPage} />
      <Route path={`/$/${PAGES.HELP}`} exact component={HelpPage} />
      <Route path={`/$/${PAGES.SEARCH}`} exact component={SearchPage} />

      <PrivateRoute {...props} path={`/$/${PAGES.INVITE}`} component={InvitePage} />
      <PrivateRoute {...props} path={`/$/${PAGES.DOWNLOADED}`} component={FileListDownloaded} />
      <PrivateRoute {...props} path={`/$/${PAGES.PUBLISHED}`} component={FileListPublished} />
      <PrivateRoute {...props} path={`/$/${PAGES.PUBLISH}`} component={PublishPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.REPORT}`} component={ReportPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.REWARDS}`} component={RewardsPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.SETTINGS}`} component={SettingsPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.TRANSACTIONS}`} component={TransactionHistoryPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.LIBRARY}`} component={LibraryPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.ACCOUNT}`} component={AccountPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.FOLLOWING}`} component={FollowingPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.WALLET}`} component={WalletPage} />
      <PrivateRoute {...props} path={`/$/${PAGES.BLOCKED}`} component={ListBlockedPage} />

      {/* Below need to go at the end to make sure we don't match any of our pages first */}
      <Route path="/:claimName" exact component={ShowPage} />
      <Route path="/:claimName/:streamName" exact component={ShowPage} />
      <Route path="/*" component={FourOhFourPage} />
    </Switch>
  );
}

export default withRouter(AppRouter);
