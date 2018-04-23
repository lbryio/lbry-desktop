import { connect } from 'react-redux';
import { selectDaemonVersionMatched } from 'redux/selectors/app';
import { selectNotification } from 'lbry-redux';
import { doCheckDaemonVersion } from 'redux/actions/app';
import SplashScreen from './view';

const select = state => ({
  notification: selectNotification(state),
  daemonVersionMatched: selectDaemonVersionMatched(state),
});

const perform = dispatch => ({
  checkDaemonVersion: () => dispatch(doCheckDaemonVersion()),
});

export default connect(select, perform)(SplashScreen);
