import { connect } from 'react-redux';
import { selectYoutubeChannels, doClaimYoutubeChannels, doUserFetch } from 'lbryinc';

import YoutubeChannelList from './view';

const select = state => ({
  ytChannels: selectYoutubeChannels(state),
});

const perform = dispatch => ({
  claimChannels: () => dispatch(doClaimYoutubeChannels()),
  updateUser: () => dispatch(doUserFetch()),
});

export default connect(
  select,
  perform
)(YoutubeChannelList);
