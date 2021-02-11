import { connect } from 'react-redux';
import {
  doSendTip,
  makeSelectTitleForUri,
  makeSelectClaimForUri,
  selectIsSendingSupport,
  selectBalance,
  SETTINGS,
  makeSelectClaimIsMine,
  selectFetchingMyChannels,
} from 'lbry-redux';
import WalletSendTip from './view';
import { doOpenModal, doHideModal } from 'redux/actions/app';
import { withRouter } from 'react-router';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';

const select = (state, props) => ({
  isPending: selectIsSendingSupport(state),
  title: makeSelectTitleForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri, false)(state),
  balance: selectBalance(state),
  instantTipEnabled: makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_ENABLED)(state),
  instantTipMax: makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_MAX)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  fetchingChannels: selectFetchingMyChannels(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  incognito: selectIncognito(state),
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  closeModal: () => dispatch(doHideModal()),
  sendSupport: (params, isSupport) => dispatch(doSendTip(params, isSupport)),
});

export default withRouter(connect(select, perform)(WalletSendTip));
