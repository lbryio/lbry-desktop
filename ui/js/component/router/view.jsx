import React from 'react';
import SettingsPage from 'page/settings.js';
import HelpPage from 'page/help';
import ReportPage from 'page/report.js';
import StartPage from 'page/start.js';
import WalletPage from 'page/wallet';
import FilePage from 'page/filePage';
import PublishPage from 'page/publish';
import DiscoverPage from 'page/discover';
import SplashScreen from 'component/splash.js';
import DeveloperPage from 'page/developer.js';
import RewardsPage from 'page/rewards.js';
import FileListDownloaded from 'page/fileListDownloaded'
import FileListPublished from 'page/fileListPublished'
import ChannelPage from 'page/channel'

const route = (page, routesMap) => {
  const component = routesMap[page]

  return component
};


const Router = (props) => {
  const {
    currentPage,
  } = props;

  return route(currentPage, {
    'settings': <SettingsPage {...props} />,
    'help': <HelpPage {...props} />,
    'report': <ReportPage {...props} />,
    'downloaded': <FileListDownloaded {...props} />,
    'published': <FileListPublished {...props} />,
    'start': <StartPage {...props} />,
    'wallet': <WalletPage {...props} />,
    'send': <WalletPage {...props} />,
    'receive': <WalletPage {...props} />,
    'show': <FilePage {...props} />,
    'channel': <ChannelPage {...props} />,
    'publish': <PublishPage {...props} />,
    'developer': <DeveloperPage {...props} />,
    'discover': <DiscoverPage {...props} />,
    'rewards': <RewardsPage {...props} />,
  })
}

export default Router
