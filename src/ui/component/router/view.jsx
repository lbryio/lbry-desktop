import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import { Router } from '@reach/router';
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

const ScrollHandler = props => {
  const { key } = props.location;

  useEffect(() => {
    // This shouldn't scroll to top when you click "back"
    // Might take some more work but fixes scroll position being stuck on navigation for now
    const main = document.querySelector('main');
    main.scrollIntoView();
  }, [key]);

  return props.children;
};

export default function AppRouter() {
  return (
    <Router>
      <ScrollHandler path="/">
        <DiscoverPage path="/" />
        <ShowPage path="/:claimName/:claimId" />
        <ShowPage path="/:claimName" />

        <AuthPage path={`$/${PAGES.AUTH}`} />
        <BackupPage path={`$/${PAGES.BACKUP}`} />
        <InvitePage path={`$/${PAGES.INVITE}`} />
        <FileListDownloaded path={`$/${PAGES.DOWNLOADED}`} />
        <FileListPublished path={`$/${PAGES.PUBLISHED}`} />
        <HelpPage path={`$/${PAGES.HELP}`} />
        <PublishPage path={`$/${PAGES.PUBLISH}`} />
        <ReportPage path={`$/${PAGES.REPORT}`} />
        <RewardsPage path={`$/${PAGES.REWARDS}`} />
        <SearchPage path={`$/${PAGES.SEARCH}`} />
        <SettingsPage path={`$/${PAGES.SETTINGS}`} />
        <SubscriptionsPage path={`$/${PAGES.SUBSCRIPTIONS}`} />
        <TransactionHistoryPage path={`$/${PAGES.TRANSACTIONS}`} />
        <UserHistoryPage path={`$/${PAGES.HISTORY}`} />
        <AccountPage path={`$/${PAGES.ACCOUNT}`} />
        <SendCreditsPage path={`$/${PAGES.SEND}`} />
        <UserHistoryPage path={`$/${PAGES.HISTORY}`} />
        <NavigationHistory path={`$/${PAGES.HISTORY}/all`} />
      </ScrollHandler>
    </Router>
  );
}
