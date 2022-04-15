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
  const { claim_id: claimId, signing_channel, value_type } = claim || {};

  let channelTitle = null;
  if (signing_channel) {
    const { value, name } = signing_channel;
    if (value && value.title) {
      channelTitle = value.title;
    } else {
      channelTitle = name;
    }
  }
  const isCollection = value_type && value_type === 'collection'; // hack because nudge gets cut off by card on cols.

  return {
    myReaction: makeSelectMyReactionForUri(uri)(state),
    likeCount: makeSelectLikeCountForUri(uri)(state),
    dislikeCount: makeSelectDislikeCountForUri(uri)(state),
    isLivestreamClaim: selectIsStreamPlaceholderForUri(state, uri),
    claimId,
    channelTitle,
    isCollection,
  };
};

const perform = {
  doFetchReactions,
  doReactionLike,
  doReactionDislike,
};

export default connect(select, perform)(FileReactions);
