import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { selectClaimForUri } from 'redux/selectors/claims';
import { doFetchRecommendedContent } from 'redux/actions/search';
import { selectRecommendedContentForUri, selectIsSearching } from 'redux/selectors/search';
import { selectUserHasOdyseePremiumPlus } from 'redux/selectors/memberships';
import RecommendedContent from './view';
import { selectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';

const select = (state, props) => {
  const recommendedContentUris = selectRecommendedContentForUri(state, props.uri);
  const nextRecommendedUri = recommendedContentUris && recommendedContentUris[0];

  return {
    claim: selectClaimForUri(state, props.uri),
    recommendedContentUris,
    nextRecommendedUri,
    isSearching: selectIsSearching(state),
    searchInLanguage: selectClientSetting(state, SETTINGS.SEARCH_IN_LANGUAGE),
    hasPremiumPlus: selectUserHasOdyseePremiumPlus(state),
  };
};

export default withRouter(connect(select, { doFetchRecommendedContent })(RecommendedContent));
