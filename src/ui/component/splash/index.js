import { connect } from 'react-redux';
import { selectDaemonVersionMatched, selectModal } from 'redux/selectors/app';
import { doCheckDaemonVersion, doNotifyUnlockWallet, doHideModal } from 'redux/actions/app';
import { doSetClientSetting } from 'redux/actions/settings';
import * as settings from 'constants/settings';
import SplashScreen from './view';

import { makeSelectClientSetting } from 'redux/selectors/settings';

const select = state => ({
  modal: selectModal(state),
  daemonVersionMatched: selectDaemonVersionMatched(state),
  animationHidden: makeSelectClientSetting(settings.HIDE_SPLASH_ANIMATION)(state),
});

const perform = dispatch => ({
  checkDaemonVersion: () => dispatch(doCheckDaemonVersion()),
  notifyUnlockWallet: () => dispatch(doNotifyUnlockWallet()),
  hideModal: () => dispatch(doHideModal()),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
});

export default connect(
  select,
  perform
)(SplashScreen);
