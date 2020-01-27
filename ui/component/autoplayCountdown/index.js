import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'lbry-redux';
import { makeSelectNextUnplayedRecommended } from 'redux/selectors/content';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import RecommendedVideos from './view';

const select = (state, props) => {
  const nextRecommendedUri = makeSelectNextUnplayedRecommended(props.uri)(state);
  return {
    nextRecommendedUri,
    nextRecommendedClaim: makeSelectClaimForUri(nextRecommendedUri)(state),
    autoplay: makeSelectClientSetting(SETTINGS.AUTOPLAY)(state),
  };
};

const perform = (dispatch, ownProps) => ({});

export default connect(
  select,
  perform
)(RecommendedVideos);
