import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectMetadataForUri } from 'redux/selectors/claims';
import { doFetchRecommendedContent } from 'redux/actions/search';
import { selectRecommendedContentForUri, selectIsSearching } from 'redux/selectors/search';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import RecommendedContent from './view';

const select = (state, props) => {
  const claim = makeSelectClaimForUri(props.uri)(state);
  const { claim_id: claimId } = claim;
  const recommendedContentUris = selectRecommendedContentForUri(state, props.uri);
  const nextRecommendedUri = recommendedContentUris && recommendedContentUris[0];
  const metadata = makeSelectMetadataForUri(props.uri)(state);

  return {
    claim,
    claimId,
    recommendedContentUris,
    nextRecommendedUri,
    isSearching: selectIsSearching(state),
    isAuthenticated: selectUserVerifiedEmail(state),
    metadata,
  };
};

export default connect(select, { doFetchRecommendedContent })(RecommendedContent);
