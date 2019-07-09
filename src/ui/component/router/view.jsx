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
import AuthPage from 'page/auth';
import InvitePage from 'page/invite';
import SearchPage from 'page/search';
import LibraryPage from 'page/library';
import WalletPage from 'page/wallet';
import NavigationHistory from 'page/navigationHistory';
import TagsPage from 'page/tags';
import FollowingPage from 'page/following';

const Scroll = withRouter(function ScrollWrapper(props) {
  const { pathname } = props.location;

  useEffect(() => {
    // Auto scroll to the top of a window for new pages
    // The browser will handle scrolling if it needs to, but
    // for new pages, react-router maintains the current y scroll position
    window.scrollTo(0, 0);
  }, [pathname]);

  return props.children;
});

export default function AppRouter() {
  return (
    <Scroll>
      <Switch>
        <Route path="/" exact component={DiscoverPage} />
        <Route path={`/$/${PAGES.DISCOVER}`} exact component={DiscoverPage} />
        <Route path={`/$/${PAGES.AUTH}`} exact component={AuthPage} />
        <Route path={`/$/${PAGES.INVITE}`} exact component={InvitePage} />
        <Route path={`/$/${PAGES.DOWNLOADED}`} exact component={FileListDownloaded} />
        <Route path={`/$/${PAGES.PUBLISHED}`} exact component={FileListPublished} />
        <Route path={`/$/${PAGES.HELP}`} exact component={HelpPage} />
        <Route path={`/$/${PAGES.PUBLISH}`} exact component={PublishPage} />
        <Route path={`/$/${PAGES.REPORT}`} exact component={ReportPage} />
        <Route path={`/$/${PAGES.REWARDS}`} exact component={RewardsPage} />
        <Route path={`/$/${PAGES.SEARCH}`} exact component={SearchPage} />
        <Route path={`/$/${PAGES.SETTINGS}`} exact component={SettingsPage} />
        <Route path={`/$/${PAGES.TRANSACTIONS}`} exact component={TransactionHistoryPage} />
        <Route path={`/$/${PAGES.LIBRARY}`} exact component={LibraryPage} />
        <Route path={`/$/${PAGES.ACCOUNT}`} exact component={AccountPage} />
        <Route path={`/$/${PAGES.LIBRARY}/all`} exact component={NavigationHistory} />
        <Route path={`/$/${PAGES.TAGS}`} exact component={TagsPage} />
        <Route path={`/$/${PAGES.FOLLOWING}`} exact component={FollowingPage} />
        <Route path={`/$/${PAGES.WALLET}`} exact component={WalletPage} />
        {/* Below need to go at the end to make sure we don't match any of our pages first */}
        <Route path="/:claimName" exact component={ShowPage} />
        <Route path="/:claimName/:contentName" exact component={ShowPage} />

        {/* Route not found. Mostly for people typing crazy urls into the url */}
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </Scroll>
  );
}
