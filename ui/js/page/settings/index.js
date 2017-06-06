import React from 'react';
import { connect } from 'react-redux';
import { doSetDaemonSetting } from 'actions/settings';
import { selectDaemonSettings } from 'selectors/settings';
import SettingsPage from './view';

const select = state => ({
	daemonSettings: selectDaemonSettings(state)
});

const perform = dispatch => ({
	setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value))
});

export default connect(select, perform)(SettingsPage);
