import { connect } from 'react-redux';
import {
  selectClaimForUri,
  selectClaimIsMine,
  selectHasChannels,
  selectFetchingMyChannels,
  makeSelectTagInClaimOrChannelForUri,
  selectMyChannelClaimIds,
} from 'redux/selectors/claims';
import { CommentCreate } from './view';
import { DISABLE_SUPPORT_TAG } from 'constants/tags';
import {
  doCommentCreate,
  doFetchCreatorSettings,
  doCommentById,
  doFetchMyCommentedChannels,
} from 'redux/actions/comments';
import { doSendTip, doSendCashTip } from 'redux/actions/wallet';
import { doToast } from 'redux/actions/notifications';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectMyCommentedChannelIdsForId, selectSettingsByChannelId } from 'redux/selectors/comments';
import { getChannelIdFromClaim } from 'util/claim';
import { doOpenModal } from 'redux/actions/app';
import { selectPreferredCurrency } from 'redux/selectors/settings';
import { selectCanReceiveFiatTipsForUri } from 'redux/selectors/stripe';
import { doTipAccountCheckForUri } from 'redux/actions/stripe';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);
  const { claim_id: claimId, name, signing_channel: channel } = claim || {};

  // setup variables for tip API
  const channelClaimId = getChannelIdFromClaim(claim);
  const tipChannelName = channel ? channel.name : name;

  const activeChannelClaim = selectActiveChannelClaim(state);
  const { claim_id: activeChannelClaimId, name: activeChannelName, canonical_url: activeChannelUrl } =
    activeChannelClaim || {};

  return {
    activeChannelClaimId,
    activeChannelName,
    activeChannelUrl,
    hasChannels: selectHasChannels(state),
    claimId,
    channelClaimId,
    tipChannelName,
    claimIsMine: selectClaimIsMine(state, claim),
    isFetchingChannels: selectFetchingMyChannels(state),
    settingsByChannelId: selectSettingsByChannelId(state),
    supportDisabled: makeSelectTagInClaimOrChannelForUri(uri, DISABLE_SUPPORT_TAG)(state),
    preferredCurrency: selectPreferredCurrency(state),
    myChannelClaimIds: selectMyChannelClaimIds(state),
    myCommentedChannelIds: selectMyCommentedChannelIdsForId(state, claim?.claim_id),
    canReceiveFiatTips: selectCanReceiveFiatTipsForUri(state, uri),
  };
};

const perform = {
  doCommentCreate,
  doFetchCreatorSettings,
  doFetchMyCommentedChannels,
  doToast,
  doCommentById,
  doSendCashTip,
  doSendTip,
  doOpenModal,
  doTipAccountCheckForUri,
};

export default connect(select, perform)(CommentCreate);
