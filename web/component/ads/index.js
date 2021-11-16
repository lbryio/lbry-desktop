import { connect } from 'react-redux';
import { selectTheme } from 'redux/selectors/settings';
import { makeSelectClaimForUri, selectClaimIsNsfwForUri } from 'redux/selectors/claims';
import Ads from './view';

const select = (state, props) => ({
  theme: selectTheme(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  isMature: selectClaimIsNsfwForUri(state, props.uri),
});

export default connect(select)(Ads);
