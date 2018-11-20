import { connect } from 'react-redux';
import { selectDaemonVersionMatched, selectModal } from 'redux/selectors/app';
import { doCheckDaemonVersion, doNotifyUnlockWallet } from 'redux/actions/app';
import SplashScreen from './view';

const select = state => ({
  modal: selectModal(state),
  daemonVersionMatched: selectDaemonVersionMatched(state),
});

const perform = dispatch => ({
  checkDaemonVersion: () => dispatch(doCheckDaemonVersion()),
  notifyUnlockWallet: () => dispatch(doNotifyUnlockWallet()),
});

export default connect(
  select,
  perform
)(SplashScreen);
