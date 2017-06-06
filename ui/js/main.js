import React from 'react';
import ReactDOM from 'react-dom';
import lbry from './lbry.js';
import lbryio from './lbryio.js';
import lighthouse from './lighthouse.js';
import App from 'component/app/index.js';
import SnackBar from 'component/snackBar';
import { Provider } from 'react-redux';
import store from 'store.js';
import SplashScreen from 'component/splash.js';
import { AuthOverlay } from 'component/auth.js';
import { doChangePath, doNavigate, doDaemonReady } from 'actions/app';
import { doFetchDaemonSettings } from 'actions/settings';
import { doFileList } from 'actions/file_info';
import { toQueryString } from 'util/query_params';

const { remote, ipcRenderer, shell } = require('electron');
const contextMenu = remote.require('./menu/context-menu');
const app = require('./app');

lbry.showMenuIfNeeded();

window.addEventListener('contextmenu', event => {
	contextMenu.showContextMenu(
		remote.getCurrentWindow(),
		event.x,
		event.y,
		lbry.getClientSetting('showDeveloperMenu')
	);
	event.preventDefault();
});

window.addEventListener('popstate', (event, param) => {
	const params = event.state;
	const pathParts = document.location.pathname.split('/');
	const route = '/' + pathParts[pathParts.length - 1];
	const queryString = toQueryString(params);

	let action;
	if (route.match(/html$/)) {
		action = doChangePath('/discover');
	} else {
		action = doChangePath(`${route}?${queryString}`);
	}

	app.store.dispatch(action);
});

ipcRenderer.on('open-uri-requested', (event, uri) => {
	if (uri && uri.startsWith('lbry://')) {
		app.store.dispatch(doNavigate('/show', { uri }));
	}
});

document.addEventListener('click', event => {
	var target = event.target;
	while (target && target !== document) {
		if (target.matches('a[href^="http"]')) {
			event.preventDefault();
			shell.openExternal(target.href);
			return;
		}
		target = target.parentNode;
	}
});

const initialState = app.store.getState();

var init = function() {
	function onDaemonReady() {
		window.sessionStorage.setItem('loaded', 'y'); //once we've made it here once per session, we don't need to show splash again
		const actions = [];

		app.store.dispatch(doDaemonReady());
		app.store.dispatch(doChangePath('/discover'));
		app.store.dispatch(doFetchDaemonSettings());
		app.store.dispatch(doFileList());

		ReactDOM.render(
			<Provider store={store}>
				<div>{lbryio.enabled ? <AuthOverlay /> : ''}<App /><SnackBar /></div>
			</Provider>,
			canvas
		);
	}

	if (window.sessionStorage.getItem('loaded') == 'y') {
		onDaemonReady();
	} else {
		ReactDOM.render(<SplashScreen onLoadDone={onDaemonReady} />, canvas);
	}
};

init();
