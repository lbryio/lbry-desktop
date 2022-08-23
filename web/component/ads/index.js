import { connect } from 'react-redux';
import { selectShouldShowAds } from 'redux/selectors/app';
import { makeSelectClaimForUri, selectClaimIsNsfwForUri } from 'redux/selectors/claims';
import Ads from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isMature: selectClaimIsNsfwForUri(state, props.uri),
  shouldShowAds: selectShouldShowAds(state),
});

export default connect(select)(Ads);
