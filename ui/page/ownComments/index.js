import { connect } from 'react-redux';
import {
  selectIsFetchingComments,
  selectCommentsForUri,
  makeSelectTotalCommentsCountForUri,
  makeSelectTopLevelTotalPagesForUri,
} from 'redux/selectors/comments';
import { doCommentListOwn, doCommentReset } from 'redux/actions/comments';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectClaimsById } from 'redux/selectors/claims';
import OwnComments from './view';

const select = (state) => {
  const activeChannelClaim = selectActiveChannelClaim(state);
  const uri = activeChannelClaim && activeChannelClaim.canonical_url;

  return {
    activeChannelClaim,
    allComments: selectCommentsForUri(state, uri),
    claimsById: selectClaimsById(state),
    isFetchingComments: selectIsFetchingComments(state),
    topLevelTotalPages: makeSelectTopLevelTotalPagesForUri(uri)(state),
    totalComments: makeSelectTotalCommentsCountForUri(uri)(state),
  };
};

const perform = (dispatch) => ({
  doCommentListOwn: (channelId, page, pageSize) => dispatch(doCommentListOwn(channelId, page, pageSize)),
  doCommentReset: (claimId) => dispatch(doCommentReset(claimId)),
});

export default connect(select, perform)(OwnComments);
