import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'lbry-redux';
import { makeSelectIsPlayerFloating, makeSelectNextUnplayedRecommended } from 'redux/selectors/content';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetPlayingUri } from 'redux/actions/content';
import AutoplayCountdown from './view';

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

export default connect(select, perform)(AutoplayCountdown);
