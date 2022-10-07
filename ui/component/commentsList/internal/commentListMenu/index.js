import { connect } from 'react-redux';
import { selectClaimForUri, selectClaimIsMineForUri } from 'redux/selectors/claims';
import { selectMembersOnlyCommentsForChannelId } from 'redux/selectors/comments';
import {
  selectChannelHasMembershipTiersForId,
  selectCreatorMembershipsFetchedByUri,
} from 'redux/selectors/memberships';
import { getChannelFromClaim } from 'util/claim';

import { doToggleMembersOnlyCommentsSettingForClaimId } from 'redux/actions/comments';
import { doMembershipList } from 'redux/actions/memberships';
import { doToast } from 'redux/actions/notifications';

import CommentListMenu from './view';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);
  const claimId = claim && claim.claim_id;
  const { claim_id: channelId, name: channelName } = getChannelFromClaim(claim) || {};

  return {
    claimId,
    channelId,
    channelName,
    claimIsMine: selectClaimIsMineForUri(state, uri),
    channelHasMembershipTiers: channelId && selectChannelHasMembershipTiersForId(state, channelId),
    areCommentsMembersOnly: channelId && selectMembersOnlyCommentsForChannelId(state, channelId),
    creatorMembershipsFetched: selectCreatorMembershipsFetchedByUri(state, uri),
  };
};

const perform = {
  doToggleMembersOnlyCommentsSettingForClaimId,
  doMembershipList,
  doToast,
};

export default connect(select, perform)(CommentListMenu);
