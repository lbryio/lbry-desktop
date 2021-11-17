import { connect } from 'react-redux';
import { doFetchSubCount, selectSubCountForUri } from 'lbryinc';
import { selectTitleForUri, selectClaimForUri } from 'redux/selectors/claims';
import { makeSelectInsufficientCreditsForUri } from 'redux/selectors/content';
import { selectViewersForId } from 'redux/selectors/livestream';
import FileTitleSection from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);
  const viewers = claim && selectViewersForId(state, claim.claim_id);
  const channelClaimId = claim && claim.signing_channel ? claim.signing_channel.claim_id : undefined;
  const channelUri = claim && claim.signing_channel ? claim.signing_channel.canonical_url : undefined;
  const subCount = channelUri && selectSubCountForUri(state, channelUri);

  return {
    viewers,
    isInsufficientCredits: makeSelectInsufficientCreditsForUri(props.uri)(state),
    title: selectTitleForUri(state, props.uri),
    channelClaimId,
    subCount,
  };
};

const perform = (dispatch) => ({
  fetchSubCount: (claimId) => dispatch(doFetchSubCount(claimId)),
});

export default connect(select, perform)(FileTitleSection);
