import * as settings from 'constants/settings';
import { connect } from 'react-redux';
import { doFetchClaimsByChannel } from 'redux/actions/content';
import { makeSelectClaimsInChannelForCurrentPage } from 'lbry-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import RecommendedVideos from './view';

const select = (state, props) => ({
  claimsInChannel: makeSelectClaimsInChannelForCurrentPage(props.channelUri)(state),
  autoplay: makeSelectClientSetting(settings.AUTOPLAY)(state),
});

const perform = dispatch => ({
  fetchClaims: (uri, page) => dispatch(doFetchClaimsByChannel(uri, page)),
  setAutoplay: value => dispatch(doSetClientSetting(settings.AUTOPLAY, value)),
});

export default connect(
  select,
  perform
)(RecommendedVideos);
