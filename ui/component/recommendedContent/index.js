import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'lbry-redux';
import { doFetchRecommendedContent } from 'redux/actions/search';
import { makeSelectRecommendedContentForUri, selectIsSearching } from 'redux/selectors/search';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import RecommendedContent from './view';

const select = (state, props) => {
  const claim = makeSelectClaimForUri(props.uri)(state);
  const { claim_id: claimId } = claim;
  const recommendedContentUris = makeSelectRecommendedContentForUri(props.uri)(state);
  const nextRecommendedUri = recommendedContentUris && recommendedContentUris[0];

  return {
    claim,
    claimId,
    recommendedContentUris,
    nextRecommendedUri,
    isSearching: selectIsSearching(state),
    isAuthenticated: selectUserVerifiedEmail(state),
  };
};

export default connect(select, { doFetchRecommendedContent })(RecommendedContent);
