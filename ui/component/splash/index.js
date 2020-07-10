import * as MODALS from 'constants/modal_types';
import { connect } from 'react-redux';
import { selectDaemonVersionMatched, selectModal } from 'redux/selectors/app';
import { doCheckDaemonVersion, doOpenModal, doHideModal } from 'redux/actions/app';
import { doSetClientSetting, doClearDaemonSetting } from 'redux/actions/settings';
import { DAEMON_SETTINGS, SETTINGS } from 'lbry-redux';
import { doToast } from 'redux/actions/notifications';
import SplashScreen from './view';

import { makeSelectClientSetting } from 'redux/selectors/settings';

const select = state => ({
  modal: selectModal(state),
  daemonVersionMatched: selectDaemonVersionMatched(state),
  animationHidden: makeSelectClientSetting(SETTINGS.HIDE_SPLASH_ANIMATION)(state),
});

const perform = dispatch => ({
  checkDaemonVersion: () => dispatch(doCheckDaemonVersion()),
  notifyUnlockWallet: shouldTryWithBlankPassword =>
    dispatch(doOpenModal(MODALS.WALLET_UNLOCK, { shouldTryWithBlankPassword })),
  hideModal: () => dispatch(doHideModal()),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  clearWalletServers: () => dispatch(doClearDaemonSetting(DAEMON_SETTINGS.LBRYUM_SERVERS)),
  doShowSnackBar: message => dispatch(doToast({ isError: true, message })),
});

export default connect(select, perform)(SplashScreen);
