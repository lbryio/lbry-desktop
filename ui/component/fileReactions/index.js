import { connect } from 'react-redux';
import { selectMyReactionForUri, selectLikeCountForUri, selectDislikeCountForUri } from 'redux/selectors/reactions';
import { doFetchReactions, doReactionLike, doReactionDislike } from 'redux/actions/reactions';
import FileReactions from './view';
import { selectClaimForUri, selectIsStreamPlaceholderForUri, selectClaimIsMine } from 'redux/selectors/claims';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);

  const { claim_id: claimId } = claim || {};

  return {
    myReaction: selectMyReactionForUri(state, uri),
    likeCount: selectLikeCountForUri(state, uri),
    dislikeCount: selectDislikeCountForUri(state, uri),
    isLivestreamClaim: selectIsStreamPlaceholderForUri(state, uri),
    claimId,
    claimIsMine: selectClaimIsMine(state, claim),
  };
};

const perform = {
  doFetchReactions,
  doReactionLike,
  doReactionDislike,
};

export default connect(select, perform)(FileReactions);
