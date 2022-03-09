import { connect } from 'react-redux';
import { selectClaimForUri } from 'redux/selectors/claims';
import { doFetchRecommendedContent } from 'redux/actions/search';
import { selectRecommendedContentForUri, selectIsSearching } from 'redux/selectors/search';
import { selectOdyseeMembershipIsPremiumPlus } from 'redux/selectors/user';
import RecommendedContent from './view';

const select = (state, props) => {
  const recommendedContentUris = selectRecommendedContentForUri(state, props.uri);
  const nextRecommendedUri = recommendedContentUris && recommendedContentUris[0];

  return {
    claim: selectClaimForUri(state, props.uri),
    recommendedContentUris,
    nextRecommendedUri,
    isSearching: selectIsSearching(state),
    userHasPremiumPlus: selectOdyseeMembershipIsPremiumPlus(state),
  };
};

export default connect(select, { doFetchRecommendedContent })(RecommendedContent);
