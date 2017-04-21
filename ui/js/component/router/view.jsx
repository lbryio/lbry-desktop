import React from 'react';
import SettingsPage from 'page/settings.js';
import HelpPage from 'page/help';
import ReportPage from 'page/report.js';
import StartPage from 'page/start.js';
import WalletPage from 'page/wallet.js';
import DetailPage from 'page/show.js';
import PublishPage from 'page/publish.js';
import DiscoverPage from 'page/discover.js';
import SplashScreen from 'component/splash.js';
import RewardsPage from 'page/rewards.js';
import DeveloperPage from 'page/developer.js';
import {
  FileListDownloaded,
  FileListPublished
} from 'page/file-list.js';

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
    'rewards' : <RewardsPage {...props} />,
    'start': <StartPage {...props} />,
    'wallet': <WalletPage {...props} />,
    'send': <WalletPage {...props} />,
    'receive': <WalletPage {...props} />,
    'show': <DetailPage {...props} />,
    'publish': <PublishPage {...props} />,
    'developer': <DeveloperPage {...props} />,
    'discover': <DiscoverPage {...props} />,
  })
}

export default Router
