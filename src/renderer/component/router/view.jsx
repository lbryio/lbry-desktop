import React from 'react';
import SettingsPage from 'page/settings';
import HelpPage from 'page/help';
import ReportPage from 'page/report.js';
import WalletPage from 'page/wallet';
import GetCreditsPage from '../../page/getCredits';
import SendReceivePage from 'page/sendCredits';
import ShowPage from 'page/show';
import PublishPage from 'page/publish';
import DiscoverPage from 'page/discover';
import RewardsPage from 'page/rewards';
import FileListDownloaded from 'page/fileListDownloaded';
import FileListPublished from 'page/fileListPublished';
import TransactionHistoryPage from 'page/transactionHistory';
import ChannelPage from 'page/channel';
import AuthPage from 'page/auth';
import InvitePage from 'page/invite';
import BackupPage from 'page/backup';
import SubscriptionsPage from 'page/subscriptions';

const route = (page, routesMap) => {
  const component = routesMap[page];

  return component || DiscoverPage;
};

const Router = props => {
  const { currentPage, params } = props;

  return route(currentPage, {
    auth: <AuthPage params={params} />,
    backup: <BackupPage params={params} />,
    channel: <ChannelPage params={params} />,
    discover: <DiscoverPage params={params} />,
    downloaded: <FileListDownloaded params={params} />,
    help: <HelpPage params={params} />,
    history: <TransactionHistoryPage params={params} />,
    invite: <InvitePage params={params} />,
    publish: <PublishPage params={params} />,
    published: <FileListPublished params={params} />,
    getcredits: <GetCreditsPage params={params} />,
    report: <ReportPage params={params} />,
    rewards: <RewardsPage params={params} />,
    send: <SendReceivePage params={params} />,
    settings: <SettingsPage params={params} />,
    show: <ShowPage {...params} />,
    wallet: <WalletPage params={params} />,
    subscriptions: <SubscriptionsPage params={params} />,
  });
};

export default Router;
