import React from "react";
import SettingsPage from "page/settings";
import HelpPage from "page/help";
import ReportPage from "page/report.js";
import WalletPage from "page/wallet";
import ReceiveCreditsPage from "page/receiveCredits";
import SendCreditsPage from "page/sendCredits";
import ShowPage from "page/show";
import PublishPage from "page/publish";
import DiscoverPage from "page/discover";
import DeveloperPage from "page/developer.js";
import RewardsPage from "page/rewards";
import FileListDownloaded from "page/fileListDownloaded";
import FileListPublished from "page/fileListPublished";
import TransactionHistoryPage from "page/transactionHistory";
import ChannelPage from "page/channel";
import SearchPage from "page/search";
import AuthPage from "page/auth";
import InvitePage from "page/invite";
import BackupPage from "page/backup";

const route = (page, routesMap) => {
  const component = routesMap[page];

  return component;
};

const Router = props => {
  const { currentPage, params } = props;

  return route(currentPage, {
    auth: <AuthPage params={params} />,
    backup: <BackupPage params={params} />,
    channel: <ChannelPage params={params} />,
    developer: <DeveloperPage params={params} />,
    discover: <DiscoverPage params={params} />,
    downloaded: <FileListDownloaded params={params} />,
    help: <HelpPage params={params} />,
    history: <TransactionHistoryPage params={params} />,
    invite: <InvitePage params={params} />,
    publish: <PublishPage params={params} />,
    published: <FileListPublished params={params} />,
    receive: <ReceiveCreditsPage params={params} />,
    report: <ReportPage params={params} />,
    rewards: <RewardsPage params={params} />,
    search: <SearchPage params={params} />,
    send: <SendCreditsPage params={params} />,
    settings: <SettingsPage params={params} />,
    show: null,
    wallet: <WalletPage params={params} />,
  });
};

export default Router;
