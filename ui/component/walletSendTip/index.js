import { connect } from 'react-redux';
import {
  selectTitleForUri,
  makeSelectClaimForUri,
  makeSelectClaimIsMine,
  selectFetchingMyChannels,
} from 'redux/selectors/claims';
import { doHideModal } from 'redux/actions/app';
import { doSendTip } from 'redux/actions/wallet';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { selectBalance, selectIsSendingSupport } from 'redux/selectors/wallet';
import { withRouter } from 'react-router';
import * as SETTINGS from 'constants/settings';
import WalletSendTip from './view';

const select = (state, props) => ({
  activeChannelClaim: selectActiveChannelClaim(state),
  balance: selectBalance(state),
  claim: makeSelectClaimForUri(props.uri, false)(state), // find this selectClaim
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  fetchingChannels: selectFetchingMyChannels(state),
  incognito: selectIncognito(state),
  instantTipEnabled: makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_ENABLED)(state),
  instantTipMax: makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_MAX)(state),
  isPending: selectIsSendingSupport(state),
  title: selectTitleForUri(state, props.uri),
});

export default withRouter(connect(select, { doHideModal, doSendTip })(WalletSendTip)); // doSendCashTip gone
