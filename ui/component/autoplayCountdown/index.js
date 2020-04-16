import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'lbry-redux';
import { withRouter } from 'react-router';
import { makeSelectIsPlayerFloating, makeSelectNextUnplayedRecommended } from 'redux/selectors/content';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetPlayingUri } from 'redux/actions/content';
import AutoplayCountdown from './view';

/*
AutoplayCountdown does not fetch it's own next content to play, it relies on <RecommendedContent> being rendered. This is dumb but I'm just the guy who noticed
 */
const select = (state, props) => {
  const nextRecommendedUri = makeSelectNextUnplayedRecommended(props.uri)(state);
  return {
    nextRecommendedUri,
    nextRecommendedClaim: makeSelectClaimForUri(nextRecommendedUri)(state),
    isFloating: makeSelectIsPlayerFloating(props.location)(state),
    autoplay: makeSelectClientSetting(SETTINGS.AUTOPLAY)(state),
  };
};

const perform = dispatch => ({
  setPlayingUri: uri => dispatch(doSetPlayingUri(uri)),
});

export default withRouter(connect(select, perform)(AutoplayCountdown));
