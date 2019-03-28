import * as PAGES from 'constants/pages';
import React from 'react';
import { Router } from '@reach/router';
import SettingsPage from 'page/settings';
import HelpPage from 'page/help';
import ReportPage from 'page/report';
import WalletPage from 'page/wallet';
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

export default function AppRouter(props) {
  return (
    <Router>
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
      <TransactionHistoryPage path={`$/${PAGES.HISTORY}`} />
      <UserHistoryPage path={`$/${PAGES.USER_HISTORY}`} />
      <WalletPage path={`$/${PAGES.WALLET}`} />
    </Router>
  );
}
