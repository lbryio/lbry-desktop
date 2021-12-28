import { connect } from 'react-redux';
import { doFetchSubCount, selectSubCountForUri } from 'lbryinc';
import { makeSelectTitleForUri, makeSelectClaimForUri } from 'redux/selectors/claims';
import { makeSelectInsufficientCreditsForUri } from 'redux/selectors/content';
import FileTitleSection from './view';

const select = (state, props) => {
  const claim = makeSelectClaimForUri(props.uri)(state);
  const channelClaimId = claim && claim.signing_channel ? claim.signing_channel.claim_id : undefined;
  const channelUri = claim && claim.signing_channel ? claim.signing_channel.canonical_url : undefined;
  const subCount = channelUri && selectSubCountForUri(state, channelUri);

  return {
    isInsufficientCredits: makeSelectInsufficientCreditsForUri(props.uri)(state),
    title: makeSelectTitleForUri(props.uri)(state),
    channelClaimId,
    subCount,
  };
};

const perform = (dispatch) => ({
  fetchSubCount: (claimId) => dispatch(doFetchSubCount(claimId)),
});

export default connect(select, perform)(FileTitleSection);
