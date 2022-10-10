import { connect } from 'react-redux';
import {
  selectStakedLevelForChannelUri,
  selectClaimForUri,
  selectClaimsByUri,
  selectTitleForUri,
  selectDateForUri,
} from 'redux/selectors/claims';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import {
  selectOdyseeMembershipForChannelId,
  selectMembershipForCreatorOnlyIdAndChannelId,
} from 'redux/selectors/memberships';
import { getChannelIdFromClaim } from 'util/claim';

import ChatComment from './view';

const select = (state, props) => {
  const { uri, comment } = props;
  const { channel_url: authorUri, channel_id: channelId } = comment;
  const authorTitle = selectTitleForUri(state, authorUri);
  const channelAge = selectDateForUri(state, authorUri);

  const activeChannelClaim = selectActiveChannelClaim(state);

  const claim = selectClaimForUri(state, uri);
  const creatorId = getChannelIdFromClaim(claim);

  return {
    claim,
    stakedLevel: selectStakedLevelForChannelUri(state, authorUri),
    claimsByUri: selectClaimsByUri(state),
    odyseeMembership: selectOdyseeMembershipForChannelId(state, channelId),
    creatorMembership: selectMembershipForCreatorOnlyIdAndChannelId(state, creatorId, channelId),
    activeChannelClaim,
    authorTitle,
    channelAge,
  };
};

const perform = {};

export default connect(select, perform)(ChatComment);
