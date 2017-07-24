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
    auth: <AuthPage {...params} />,
    channel: <ChannelPage {...params} />,
    developer: <DeveloperPage {...params} />,
    discover: <DiscoverPage {...params} />,
    downloaded: <FileListDownloaded {...params} />,
    help: <HelpPage {...params} />,
    publish: <PublishPage {...params} />,
    published: <FileListPublished {...params} />,
    receive: <WalletPage {...params} />,
    report: <ReportPage {...params} />,
    rewards: <RewardsPage {...params} />,
    search: <SearchPage {...params} />,
    send: <WalletPage {...params} />,
    settings: <SettingsPage {...params} />,
    show: <ShowPage {...params} />,
    start: <StartPage {...params} />,
    wallet: <WalletPage {...params} />,
  });
};

export default Router;
