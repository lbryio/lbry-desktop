import { connect } from 'react-redux';
import {
  selectTitleForUri,
  selectClaimForUri,
  selectClaimIsMineForUri,
  selectFetchingMyChannels,
} from 'redux/selectors/claims';
import { doHideModal } from 'redux/actions/app';
import { doSendTip, doSendCashTip } from 'redux/actions/wallet';
import { selectClientSetting } from 'redux/selectors/settings';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { selectBalance, selectIsSendingSupport } from 'redux/selectors/wallet';
import { withRouter } from 'react-router';
import * as SETTINGS from 'constants/settings';
import { getChannelIdFromClaim, getChannelNameFromClaim } from 'util/claim';
import WalletSendTip from './view';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri, false);
  const { claim_id: claimId, value_type: claimType } = claim || {};

  // setup variables for backend tip API
  const channelClaimId = getChannelIdFromClaim(claim);
  const tipChannelName = getChannelNameFromClaim(claim);

  const activeChannelClaim = selectActiveChannelClaim(state);
  const { name: activeChannelName, claim_id: activeChannelId } = activeChannelClaim || {};

  return {
    activeChannelName,
    activeChannelId,
    balance: selectBalance(state),
    claimId,
    claimType,
    channelClaimId,
    tipChannelName,
    claimIsMine: selectClaimIsMineForUri(state, uri),
    fetchingChannels: selectFetchingMyChannels(state),
    incognito: selectIncognito(state),
    instantTipEnabled: selectClientSetting(state, SETTINGS.INSTANT_PURCHASE_ENABLED),
    instantTipMax: selectClientSetting(state, SETTINGS.INSTANT_PURCHASE_MAX),
    isPending: selectIsSendingSupport(state),
    title: selectTitleForUri(state, uri),
    preferredCurrency: selectClientSetting(state, SETTINGS.PREFERRED_CURRENCY),
  };
};

const perform = {
  doHideModal,
  doSendTip,
  doSendCashTip,
};

export default withRouter(connect(select, perform)(WalletSendTip));
