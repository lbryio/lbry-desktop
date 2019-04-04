import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
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
import BackupPage from 'page/backup';
import SubscriptionsPage from 'page/subscriptions';
import SearchPage from 'page/search';
import UserHistoryPage from 'page/userHistory';
import SendCreditsPage from 'page/sendCredits';
import NavigationHistory from 'page/navigationHistory';

export default function AppRouter() {
  return (
    <Switch>
      <Route path="/" exact component={DiscoverPage} />
      <Route path={`/$/${PAGES.AUTH}`} exact component={AuthPage} />
      <Route path={`/$/${PAGES.BACKUP}`} exact component={BackupPage} />
      <Route path={`/$/${PAGES.INVITE}`} exact component={InvitePage} />
      <Route path={`/$/${PAGES.DOWNLOADED}`} exact component={FileListDownloaded} />
      <Route path={`/$/${PAGES.PUBLISHED}`} exact component={FileListPublished} />
      <Route path={`/$/${PAGES.HELP}`} exact component={HelpPage} />
      <Route path={`/$/${PAGES.PUBLISH}`} exact component={PublishPage} />
      <Route path={`/$/${PAGES.REPORT}`} exact component={ReportPage} />
      <Route path={`/$/${PAGES.REWARDS}`} exact component={RewardsPage} />
      <Route path={`/$/${PAGES.SEARCH}`} exact component={SearchPage} />
      <Route path={`/$/${PAGES.SETTINGS}`} exact component={SettingsPage} />
      <Route path={`/$/${PAGES.SUBSCRIPTIONS}`} exact component={SubscriptionsPage} />
      <Route path={`/$/${PAGES.TRANSACTIONS}`} exact component={TransactionHistoryPage} />
      <Route path={`/$/${PAGES.HISTORY}`} exact component={UserHistoryPage} />
      <Route path={`/$/${PAGES.ACCOUNT}`} exact component={AccountPage} />
      <Route path={`/$/${PAGES.SEND}`} exact component={SendCreditsPage} />
      <Route path={`/$/${PAGES.HISTORY}`} exact component={UserHistoryPage} />
      <Route path={`/$/${PAGES.HISTORY}/all`} exact component={NavigationHistory} />

      {/* Below need to go at the end to make sure we don't match any of our pages first */}
      <Route path="/:claimName/:claimId" component={ShowPage} />
      <Route path="/:claimName" component={ShowPage} />
    </Switch>
  );
}
