import { connect } from 'react-redux';
import {
  selectStakedLevelForChannelUri,
  makeSelectClaimForUri,
  selectThumbnailForUri,
  selectHasChannels,
  selectMyClaimIdsRaw,
} from 'redux/selectors/claims';
import { doCommentUpdate, doCommentList } from 'redux/actions/comments';
import { makeSelectChannelIsMuted } from 'redux/selectors/blocked';
import { doToast } from 'redux/actions/notifications';
import { doClearPlayingUri } from 'redux/actions/content';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import {
  selectLinkedCommentAncestors,
  selectOthersReactsForComment,
  makeSelectTotalReplyPagesForParentId,
} from 'redux/selectors/comments';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectPlayingUri } from 'redux/selectors/content';
import Comment from './view';

const select = (state, props) => {
  const { comment, uri } = props;
  const { comment_id, author_uri } = comment || {};

  const activeChannelClaim = selectActiveChannelClaim(state);
  const activeChannelId = activeChannelClaim && activeChannelClaim.claim_id;
  const reactionKey = activeChannelId ? `${comment_id}:${activeChannelId}` : comment_id;

  return {
    myChannelIds: selectMyClaimIdsRaw(state),
    claim: makeSelectClaimForUri(uri)(state),
    thumbnail: author_uri && selectThumbnailForUri(state, author_uri),
    channelIsBlocked: author_uri && makeSelectChannelIsMuted(author_uri)(state),
    commentingEnabled: IS_WEB ? Boolean(selectUserVerifiedEmail(state)) : true,
    othersReacts: selectOthersReactsForComment(state, reactionKey),
    activeChannelClaim,
    hasChannels: selectHasChannels(state),
    playingUri: selectPlayingUri(state),
    stakedLevel: selectStakedLevelForChannelUri(state, author_uri),
    linkedCommentAncestors: selectLinkedCommentAncestors(state),
    totalReplyPages: makeSelectTotalReplyPagesForParentId(comment_id)(state),
  };
};

const perform = {
  doClearPlayingUri,
  doCommentUpdate,
  fetchReplies: doCommentList,
  doToast,
};

export default connect(select, perform)(Comment);
