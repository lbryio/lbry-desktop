import { connect } from 'react-redux';
import { doReportContent } from 'redux/actions/reportContent';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { selectIsReportingContent, selectReportContentError } from 'redux/selectors/reportContent';
import { doClaimSearch } from 'redux/actions/claims';
import { selectClaimForClaimId } from 'redux/selectors/claims';
import { withRouter } from 'react-router';
import ReportContent from './view';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const claimId = urlParams.get('claimId');

  return {
    isReporting: selectIsReportingContent(state),
    error: selectReportContentError(state),
    activeChannelClaim: selectActiveChannelClaim(state),
    incognito: selectIncognito(state),
    claimId: claimId,
    claim: selectClaimForClaimId(state, claimId),
  };
};

const perform = {
  doClaimSearch,
  doReportContent,
};

export default withRouter(connect(select, perform)(ReportContent));
