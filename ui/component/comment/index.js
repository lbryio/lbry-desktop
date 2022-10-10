import { connect } from 'react-redux';
import {
  selectStakedLevelForChannelUri,
  selectClaimForUri,
  selectThumbnailForUri,
  selectHasChannels,
  selectMyClaimIdsRaw,
} from 'redux/selectors/claims';
import { doCommentUpdate, doCommentList } from 'redux/actions/comments';
import { doToast } from 'redux/actions/notifications';
import { doClearPlayingUri, doClearPlayingSource } from 'redux/actions/content';
import {
  selectFetchedCommentAncestors,
  selectOthersReactsForComment,
  makeSelectTotalReplyPagesForParentId,
  selectIsFetchingCommentsForParentId,
  selectRepliesForParentId,
} from 'redux/selectors/comments';
import {
  selectOdyseeMembershipForChannelId,
  selectMembershipForCreatorOnlyIdAndChannelId,
} from 'redux/selectors/memberships';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectPlayingUri } from 'redux/selectors/content';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { getChannelIdFromClaim } from 'util/claim';
import Comment from './view';

const select = (state, props) => {
  const { comment, uri } = props;
  const { comment_id, channel_url, channel_id } = comment || {};

  const activeChannelClaim = selectActiveChannelClaim(state);
  const activeChannelId = activeChannelClaim && activeChannelClaim.claim_id;
  const reactionKey = activeChannelId ? `${comment_id}:${activeChannelId}` : comment_id;

  const claim = selectClaimForUri(state, uri);
  const creatorId = getChannelIdFromClaim(claim);

  return {
    myChannelIds: selectMyClaimIdsRaw(state),
    claim,
    thumbnail: channel_url && selectThumbnailForUri(state, channel_url),
    commentingEnabled: Boolean(selectUserVerifiedEmail(state)),
    othersReacts: selectOthersReactsForComment(state, reactionKey),
    activeChannelClaim,
    hasChannels: selectHasChannels(state),
    playingUri: selectPlayingUri(state),
    stakedLevel: selectStakedLevelForChannelUri(state, channel_url),
    linkedCommentAncestors: selectFetchedCommentAncestors(state),
    totalReplyPages: makeSelectTotalReplyPagesForParentId(comment_id)(state),
    odyseeMembership: selectOdyseeMembershipForChannelId(state, channel_id),
    creatorMembership: selectMembershipForCreatorOnlyIdAndChannelId(state, creatorId, channel_id),
    repliesFetching: selectIsFetchingCommentsForParentId(state, comment_id),
    fetchedReplies: selectRepliesForParentId(state, comment_id),
  };
};

const perform = {
  doClearPlayingUri,
  doClearPlayingSource,
  updateComment: doCommentUpdate,
  fetchReplies: doCommentList,
  doToast,
};

export default connect(select, perform)(Comment);
