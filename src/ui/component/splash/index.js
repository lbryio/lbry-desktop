import { connect } from 'react-redux';
import { selectDaemonVersionMatched, selectModal } from 'redux/selectors/app';
import { doCheckDaemonVersion, doNotifyUnlockWallet, doHideModal } from 'redux/actions/app';
import SplashScreen from './view';

const select = state => ({
  modal: selectModal(state),
  daemonVersionMatched: selectDaemonVersionMatched(state),
});

const perform = dispatch => ({
  checkDaemonVersion: () => dispatch(doCheckDaemonVersion()),
  notifyUnlockWallet: () => dispatch(doNotifyUnlockWallet()),
  hideModal: () => dispatch(doHideModal()),
});

export default connect(
  select,
  perform
)(SplashScreen);
