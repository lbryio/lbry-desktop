import { connect } from 'react-redux';
import { selectTheme } from 'redux/selectors/settings';
import { makeSelectClaimForUri, selectClaimIsNsfwForUri } from 'redux/selectors/claims';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import Ads, { injectAd } from './view';

const select = (state, props) => ({
  theme: selectTheme(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  isMature: selectClaimIsNsfwForUri(state, props.uri),
  authenticated: selectUserVerifiedEmail(state),
});

export default connect(select)(Ads);
export { injectAd };
