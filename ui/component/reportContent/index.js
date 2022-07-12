import { connect } from 'react-redux';
import { doCommentById } from 'redux/actions/comments';
import { doReportContent } from 'redux/actions/reportContent';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { selectCommentForCommentId } from 'redux/selectors/comments';
import { selectIsReportingContent, selectReportContentError } from 'redux/selectors/reportContent';
import { doClaimSearch } from 'redux/actions/claims';
import { selectClaimForClaimId } from 'redux/selectors/claims';
import { withRouter } from 'react-router';
import ReportContent from './view';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const claimId = urlParams.get('claimId');
  const commentId = urlParams.get('commentId');

  return {
    claimId,
    commentId,
    isReporting: selectIsReportingContent(state),
    error: selectReportContentError(state),
    activeChannelClaim: selectActiveChannelClaim(state),
    incognito: selectIncognito(state),
    claim: selectClaimForClaimId(state, claimId),
    comment: selectCommentForCommentId(state, commentId),
  };
};

const perform = {
  doClaimSearch,
  doCommentById,
  doReportContent,
};

export default withRouter(connect(select, perform)(ReportContent));
