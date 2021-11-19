import { connect } from 'react-redux';
import { doFetchSubCount, selectSubCountForUri } from 'lbryinc';
import { selectTitleForUri, selectClaimForUri } from 'redux/selectors/claims';
import { selectInsufficientCreditsForUri } from 'redux/selectors/content';
import FileTitleSection from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);
  const channelClaimId = claim && claim.signing_channel ? claim.signing_channel.claim_id : undefined;
  const channelUri = claim && claim.signing_channel ? claim.signing_channel.canonical_url : undefined;
  const subCount = channelUri && selectSubCountForUri(state, channelUri);

  return {
    isInsufficientCredits: selectInsufficientCreditsForUri(state, props.uri),
    title: selectTitleForUri(state, props.uri),
    channelClaimId,
    subCount,
  };
};

const perform = (dispatch) => ({
  fetchSubCount: (claimId) => dispatch(doFetchSubCount(claimId)),
});

export default connect(select, perform)(FileTitleSection);
