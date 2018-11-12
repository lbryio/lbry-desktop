import { connect } from 'react-redux';
import { doFetchClaimsByChannel } from 'redux/actions/content';
import {
  makeSelectClaimsInChannelForCurrentPage,
  makeSelectFetchingChannelClaims,
} from 'lbry-redux';
import { selectShowNsfw } from 'redux/selectors/settings';
import CategoryList from './view';

const select = (state, props) => ({
  channelClaims: makeSelectClaimsInChannelForCurrentPage(props.categoryLink)(state),
  fetching: makeSelectFetchingChannelClaims(props.categoryLink)(state),
  obscureNsfw: !selectShowNsfw(state),
});

const perform = dispatch => ({
  fetchChannel: channel => dispatch(doFetchClaimsByChannel(channel)),
});

export default connect(
  select,
  perform
)(CategoryList);
