import { connect } from 'react-redux';
import {
  makeSelectMyReactionForUri,
  makeSelectLikeCountForUri,
  makeSelectDislikeCountForUri,
} from 'redux/selectors/reactions';
import { doFetchReactions, doReactionLike, doReactionDislike } from 'redux/actions/reactions';
import FileReactions from './view';
import { selectClaimForUri, selectIsStreamPlaceholderForUri } from 'redux/selectors/claims';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);
  const { claim_id: claimId } = claim || {};

  return {
    myReaction: makeSelectMyReactionForUri(uri)(state),
    likeCount: makeSelectLikeCountForUri(uri)(state),
    dislikeCount: makeSelectDislikeCountForUri(uri)(state),
    isLivestreamClaim: selectIsStreamPlaceholderForUri(state, uri),
    claimId,
  };
};

const perform = {
  doFetchReactions,
  doReactionLike,
  doReactionDislike,
};

export default connect(select, perform)(FileReactions);
