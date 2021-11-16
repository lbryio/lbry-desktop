import { connect } from 'react-redux';
import { doFetchSubCount, selectSubCountForUri } from 'lbryinc';
import { selectTitleForUri, makeSelectClaimForUri } from 'redux/selectors/claims';
import { makeSelectInsufficientCreditsForUri } from 'redux/selectors/content';
import { makeSelectViewersForId } from 'redux/selectors/livestream';
import FileTitleSection from './view';

const select = (state, props) => {
  const claim = makeSelectClaimForUri(props.uri)(state);
  const viewers = claim && makeSelectViewersForId(claim.claim_id)(state);
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
