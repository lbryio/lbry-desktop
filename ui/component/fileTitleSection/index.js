import { connect } from 'react-redux';
import { doFetchSubCount, makeSelectSubCountForUri } from 'lbryinc';
import { makeSelectTitleForUri, makeSelectClaimForUri } from 'lbry-redux';
import { makeSelectInsufficientCreditsForUri } from 'redux/selectors/content';
import { makeSelectViewersForId } from 'redux/selectors/livestream';
import FileTitleSection from './view';

const select = (state, props) => {
  const claim = makeSelectClaimForUri(props.uri)(state);
  const viewers = claim && makeSelectViewersForId(claim.claim_id)(state);
  const channelUri = claim && claim.signing_channel ? claim.signing_channel.canonical_url : undefined;
  return {
    claim,
    viewers,
    isInsufficientCredits: makeSelectInsufficientCreditsForUri(props.uri)(state),
    title: makeSelectTitleForUri(props.uri)(state),
    subCount: channelUri && makeSelectSubCountForUri(channelUri)(state),
  };
};

const perform = (dispatch) => ({
  fetchSubCount: (claimId) => dispatch(doFetchSubCount(claimId)),
});

export default connect(select, perform)(FileTitleSection);
