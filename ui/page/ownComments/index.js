import { connect } from 'react-redux';
import { doCommentListOwn, doCommentReset } from 'redux/actions/comments';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import {
  selectIsFetchingComments,
  selectCommentsForUri,
  selectTotalCommentsCountForUri,
  makeSelectTopLevelTotalPagesForUri,
} from 'redux/selectors/comments';
import { selectClaimsById } from 'redux/selectors/claims';

import OwnComments from './view';

const select = (state) => {
  const activeChannelClaim = selectActiveChannelClaim(state);
  const uri = activeChannelClaim && activeChannelClaim.canonical_url;

  return {
    activeChannelClaim,
    allComments: selectCommentsForUri(state, uri),
    totalComments: selectTotalCommentsCountForUri(state, uri),
    topLevelTotalPages: makeSelectTopLevelTotalPagesForUri(uri)(state),
    isFetchingComments: selectIsFetchingComments(state),
    claimsById: selectClaimsById(state),
  };
};

const perform = (dispatch) => ({
  doCommentReset: (a) => dispatch(doCommentReset(a)),
  doCommentListOwn: (a, b, c) => dispatch(doCommentListOwn(a, b, c)),
});

export default connect(select, perform)(OwnComments);
