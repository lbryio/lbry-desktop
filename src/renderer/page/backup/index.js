import React from 'react';
import { connect } from 'react-redux';
import { selectDaemonSettings } from 'redux/selectors/settings';
import BackupPage from './view';

const select = state => ({
  daemonSettings: selectDaemonSettings(state),
});

export default connect(select, null)(BackupPage);
