import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import { doFetchRecommendedContent } from 'redux/actions/search';
import { selectRecommendedContentForUri, selectIsSearching } from 'redux/selectors/search';
import RecommendedContent from './view';

const select = (state, props) => {
  const claim = makeSelectClaimForUri(props.uri)(state);
  const { claim_id: claimId } = claim;
  const recommendedContentUris = selectRecommendedContentForUri(state, props.uri);
  const nextRecommendedUri = recommendedContentUris && recommendedContentUris[0];

  return {
    claim,
    claimId,
    recommendedContentUris,
    nextRecommendedUri,
    isSearching: selectIsSearching(state),
  };
};

export default connect(select, { doFetchRecommendedContent })(RecommendedContent);
