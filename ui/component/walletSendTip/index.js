import { connect } from 'react-redux';
import {
  makeSelectTitleForUri,
  makeSelectClaimForUri,
  makeSelectClaimIsMine,
  selectFetchingMyChannels,
} from 'redux/selectors/claims';
import { selectBalance, selectIsSendingSupport } from 'redux/selectors/wallet';
import { doSendTip } from 'redux/actions/wallet';
import * as SETTINGS from 'constants/settings';
import WalletSendTip from './view';
import { doOpenModal, doHideModal } from 'redux/actions/app';
import { withRouter } from 'react-router';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { doToast } from 'redux/actions/notifications';
import { selectUserVerifiedEmail } from 'redux/selectors/user';

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
  isAuthenticated: Boolean(selectUserVerifiedEmail(state)),
});

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  closeModal: () => dispatch(doHideModal()),
  sendSupport: (params, isSupport) => dispatch(doSendTip(params, isSupport)),
  doToast: (options) => dispatch(doToast(options)),
});

export default withRouter(connect(select, perform)(WalletSendTip));
