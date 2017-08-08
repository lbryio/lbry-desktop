import React from "react";
import SettingsPage from "page/settings";
import HelpPage from "page/help";
import ReportPage from "page/report.js";
import StartPage from "page/start.js";
import WalletPage from "page/wallet";
import ShowPage from "page/showPage";
import PublishPage from "page/publish";
import DiscoverPage from "page/discover";
import DeveloperPage from "page/developer.js";
import RewardsPage from "page/rewards";
import FileListDownloaded from "page/fileListDownloaded";
import FileListPublished from "page/fileListPublished";
import ChannelPage from "page/channel";
import SearchPage from "page/search";
import AuthPage from "page/auth";

const route = (page, routesMap) => {
  const component = routesMap[page];

  return component;
};

const Router = props => {
  const { currentPage, params } = props;

  return route(currentPage, {
    auth: <AuthPage params={params} />,
    channel: <ChannelPage params={params} />,
    developer: <DeveloperPage params={params} />,
    discover: <DiscoverPage params={params} />,
    downloaded: <FileListDownloaded params={params} />,
    help: <HelpPage params={params} />,
    publish: <PublishPage params={params} />,
    published: <FileListPublished params={params} />,
    receive: <WalletPage params={params} />,
    report: <ReportPage params={params} />,
    rewards: <RewardsPage params={params} />,
    search: <SearchPage params={params} />,
    send: <WalletPage params={params} />,
    settings: <SettingsPage params={params} />,
    show: <ShowPage params={params} />,
    start: <StartPage params={params} />,
    wallet: <WalletPage params={params} />,
  });
};

export default Router;
