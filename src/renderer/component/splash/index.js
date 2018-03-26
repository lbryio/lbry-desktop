import { connect } from 'react-redux';
import { selectCurrentModal, selectDaemonVersionMatched } from 'redux/selectors/app';
import { doCheckDaemonVersion } from 'redux/actions/app';
import SplashScreen from './view';

const select = state => ({
  modal: selectCurrentModal(state),
  daemonVersionMatched: selectDaemonVersionMatched(state),
});

const perform = dispatch => ({
  checkDaemonVersion: () => dispatch(doCheckDaemonVersion()),
});

export default connect(select, perform)(SplashScreen);
