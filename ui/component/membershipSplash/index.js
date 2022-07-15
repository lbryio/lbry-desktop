import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import {
  selectTitleForUri,
  makeSelectClaimForUri,
  selectClaimIsMineForUri,
  selectFetchingMyChannels,
} from 'redux/selectors/claims';

import { selectClientSetting } from 'redux/selectors/settings';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { selectBalance, selectIsSendingSupport } from 'redux/selectors/wallet';
import { withRouter } from 'react-router';
import * as SETTINGS from 'constants/settings';
import WalletSendTip from './view';

const select = (state, props) => ({
  activeChannelClaim: selectActiveChannelClaim(state),
  balance: selectBalance(state),
  claim: makeSelectClaimForUri(props.uri, false)(state),
  claimIsMine: selectClaimIsMineForUri(state, props.uri),
  fetchingChannels: selectFetchingMyChannels(state),
  incognito: selectIncognito(state),
  instantTipEnabled: selectClientSetting(state, SETTINGS.INSTANT_PURCHASE_ENABLED),
  instantTipMax: selectClientSetting(state, SETTINGS.INSTANT_PURCHASE_MAX),
  isPending: selectIsSendingSupport(state),
  title: selectTitleForUri(state, props.uri),
});

const perform = (dispatch) => ({
  doOpenModal,
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default withRouter(connect(select, perform)(WalletSendTip));
