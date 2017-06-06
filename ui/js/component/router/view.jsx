import React from 'react';
import SettingsPage from 'page/settings';
import HelpPage from 'page/help';
import ReportPage from 'page/report.js';
import StartPage from 'page/start.js';
import WalletPage from 'page/wallet';
import ShowPage from 'page/showPage';
import PublishPage from 'page/publish';
import DiscoverPage from 'page/discover';
import SplashScreen from 'component/splash.js';
import DeveloperPage from 'page/developer.js';
import RewardsPage from 'page/rewards.js';
import FileListDownloaded from 'page/fileListDownloaded';
import FileListPublished from 'page/fileListPublished';
import ChannelPage from 'page/channel';
import SearchPage from 'page/search';

const route = (page, routesMap) => {
	const component = routesMap[page];

	return component;
};

const Router = props => {
	const { currentPage, params } = props;

	return route(currentPage, {
		settings: <SettingsPage {...params} />,
		help: <HelpPage {...params} />,
		report: <ReportPage {...params} />,
		downloaded: <FileListDownloaded {...params} />,
		published: <FileListPublished {...params} />,
		start: <StartPage {...params} />,
		wallet: <WalletPage {...params} />,
		send: <WalletPage {...params} />,
		receive: <WalletPage {...params} />,
		show: <ShowPage {...params} />,
		channel: <ChannelPage {...params} />,
		publish: <PublishPage {...params} />,
		developer: <DeveloperPage {...params} />,
		discover: <DiscoverPage {...params} />,
		rewards: <RewardsPage {...params} />,
		search: <SearchPage {...params} />
	});
};

export default Router;
