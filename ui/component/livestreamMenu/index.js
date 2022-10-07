import { connect } from 'react-redux';
import { selectClaimForUri, selectClaimIsMineForUri } from 'redux/selectors/claims';
import { doToggleLiveChatMembersOnlySettingForClaimId } from 'redux/actions/comments';
import { selectLivestreamChatMembersOnlyForChannelId } from 'redux/selectors/comments';
import { selectChannelHasMembershipTiersForId } from 'redux/selectors/memberships';
import { doToast } from 'redux/actions/notifications';
import { getChannelFromClaim } from 'util/claim';

import ChatLayout from './view';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);
  const claimId = claim && claim.claim_id;
  const { claim_id: channelId } = getChannelFromClaim(claim);

  return {
    claimId,
    claimIsMine: selectClaimIsMineForUri(state, uri),
    channelHasMembershipTiers: channelId && selectChannelHasMembershipTiersForId(state, channelId),
    isLivestreamChatMembersOnly: selectLivestreamChatMembersOnlyForChannelId(state, channelId),
  };
};

const perform = {
  doToggleLiveChatMembersOnlySettingForClaimId,
  doToast,
};

export default connect(select, perform)(ChatLayout);
