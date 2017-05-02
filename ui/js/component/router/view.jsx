import React from 'react';
import SettingsPage from 'page/settings.js';
import HelpPage from 'page/help';
import ReportPage from 'page/report.js';
import StartPage from 'page/start.js';
import WalletPage from 'page/wallet';
import ShowPage from 'page/showPage';
import PublishPage from 'page/publish';
import DiscoverPage from 'page/discover';
import SplashScreen from 'component/splash.js';
import DeveloperPage from 'page/developer.js';
import FileListDownloaded from 'page/fileListDownloaded'
import FileListPublished from 'page/fileListPublished'

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
    'claim': <ClaimCodePage {...props} />,
    'wallet': <WalletPage {...props} />,
    'send': <WalletPage {...props} />,
    'receive': <WalletPage {...props} />,
    'show': <ShowPage {...props} />,
    'publish': <PublishPage {...props} />,
    'developer': <DeveloperPage {...props} />,
    'discover': <DiscoverPage {...props} />,
  })
}

export default Router
