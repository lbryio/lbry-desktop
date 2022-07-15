import { connect } from 'react-redux';
import { withRouter } from 'react-router';
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
    hasPremiumPlus: selectOdyseeMembershipIsPremiumPlus(state),
  };
};

export default withRouter(connect(select, { doFetchRecommendedContent })(RecommendedContent));
