import { connect } from 'react-redux';
import { doFetchClaimsByChannel } from 'redux/actions/content';
import {
  makeSelectClaimsInChannelForCurrentPage,
  makeSelectFetchingChannelClaims,
} from 'lbry-redux';
import RecommendedVideos from './view';

const select = (state, props) => ({
  claimsInChannel: makeSelectClaimsInChannelForCurrentPage(props.channelUri)(state),
  fetching: makeSelectFetchingChannelClaims(props.channelUri)(state),
});

const perform = dispatch => ({
  fetchClaims: (uri, page) => dispatch(doFetchClaimsByChannel(uri, page)),
});

export default connect(
  select,
  perform
)(RecommendedVideos);
