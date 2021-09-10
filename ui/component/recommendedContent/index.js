import { connect } from 'react-redux';
import { makeSelectClaimIsNsfw, makeSelectClaimForUri } from 'lbry-redux';
import { doRecommendationUpdate, doRecommendationClicked } from 'redux/actions/content';
import { doFetchRecommendedContent } from 'redux/actions/search';
import { makeSelectRecommendedContentForUri, selectIsSearching } from 'redux/selectors/search';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { makeSelectNextUnplayedRecommended } from 'redux/selectors/content';
import RecommendedContent from './view';

const select = (state, props) => {
  const claim = makeSelectClaimForUri(props.uri)(state);
  const { claim_id: claimId } = claim;
  return {
    mature: makeSelectClaimIsNsfw(props.uri)(state),
    recommendedContentUris: makeSelectRecommendedContentForUri(props.uri)(state),
    nextRecommendedUri: makeSelectNextUnplayedRecommended(props.uri)(state),
    isSearching: selectIsSearching(state),
    isAuthenticated: selectUserVerifiedEmail(state),
    claim,
    claimId,
  };
};

const perform = (dispatch) => ({
  doFetchRecommendedContent: (uri, mature) => dispatch(doFetchRecommendedContent(uri, mature)),
  doRecommendationUpdate: (claimId, urls, id, parentId) =>
    dispatch(doRecommendationUpdate(claimId, urls, id, parentId)),
  doRecommendationClicked: (claimId, index) => dispatch(doRecommendationClicked(claimId, index)),
});

export default connect(select, perform)(RecommendedContent);
