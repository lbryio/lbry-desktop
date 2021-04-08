import { connect } from 'react-redux';
import { doReportContent } from 'redux/actions/reportContent';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { selectIsReportingContent, selectReportContentError } from 'redux/selectors/reportContent';
import { makeSelectClaimForClaimId, doClaimSearch } from 'lbry-redux';
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
    claim: makeSelectClaimForClaimId(claimId)(state),
  };
};

const perform = (dispatch) => ({
  doClaimSearch: (options) => dispatch(doClaimSearch(options)),
  doReportContent: (category, params) => dispatch(doReportContent(category, params)),
});

export default withRouter(connect(select, perform)(ReportContent));
