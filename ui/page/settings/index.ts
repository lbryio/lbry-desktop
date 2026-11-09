//@ts-nocheck
import {connect} from 'react-redux';
import { doEnterSettingsPage, doExitSettingsPage } from 'redux/actions/settings';
import { selectDaemonSettings } from 'redux/selectors/settings';

import SettingsPage from './view';

const select = (state: unknown) => ({
  daemonSettings: selectDaemonSettings(state),
});

const perform = (dispatch: unknown) => ({
  enterSettings: () => dispatch(doEnterSettingsPage()),
  exitSettings: () => dispatch(doExitSettingsPage()),
});

export default connect(select, perform)(SettingsPage);
